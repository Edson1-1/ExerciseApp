const bcrypt = require('bcrypt')
const models = require('../models')
const roleauth = require('../authentication/roleauth')
const jwt = require('jsonwebtoken')


module.exports = {
    //signUp
    userRegister: async (request, h) => {
        const password = request.payload.password
        const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT));
        const user = {
            username: request.payload.name,
            hashedPassword: hashedPassword,
            email: request.payload.email,
            role_id: request.payload.role_id,
        }
        try {
            const registeredUser = await models.User.create(user)
            console.log(JSON.stringify(registeredUser))
            const token = jwt.sign({ name: registeredUser.username, id: registeredUser.id, role_id: registeredUser.role_id }, process.env.JWTSECRET)
            return h.response({ token, message: "User registered" })
        } catch (err) {
            console.log('singUp error')
            console.log(err.toString())
            if (err.toString() === 'SequelizeUniqueConstraintError: Validation error') {
                //const response = h.response('username or email already exists')
                //     response.code(400)
                return h.response('username or email already exists').code(400)
            }
            const response = h.response(err.toString())
            response.code(400)

            return response
        }
    },
    //signIn
    userLogin: async (request, h) => {

        const user = {
            name: request.payload.name,
            password: request.payload.password,
            role_id: request.payload.role_id
        }
        try {
            const userInDB = await models.User.findOne({ where: { username: user.name, role_id: user.role_id } })
            if (!userInDB) {
                return h.response('Username or Password or Role is wrong. Please try again').code(400)
            }
            if (bcrypt.compareSync(user.password, userInDB.hashedPassword)) {
                console.log(JSON.stringify(userInDB))
                const token = jwt.sign({ name: userInDB.username, id: userInDB.id, role_id: userInDB.role_id }, process.env.JWTSECRET)
                const response = h.response({ token, message: "Logged in" })
                response.code(200)
                return response
            } else {
                const response = h.response('Cannot Loggin in. Username or Password is wrong')
                response.code(400)
                return response
            }
        } catch (err) {
            const response = h.response("Error Loggin in. Error: " + err.toString())
            response.code(400)
            return response
        }
    },
    //getallUsersforADMIN
    getAll: async (request, h) => {
        try {
            const role_id = request.auth.credentials.role_id
            console.log("auth credentials", role_id)
            const isAdmin = await roleauth.isAdmin(role_id)
            if (!isAdmin) {
                return h.response("Not an Admin. Only Admin can view all Users").code(400)
            }
            const users = await models.User.findAll({ include: { model: models.Role, as: 'roles' } })
            return users
        } catch (err) {
            console.log(err.toString())
            return h.response(`something went wrong. Error: ${err.toString()}`).code(400)

        }
    },
    getCustomers: async (request, h) => {
        try {
            const role_id = request.auth.credentials.role_id
            console.log("auth credentials", role_id)
            const isAdmin = await roleauth.isAdmin(role_id)
            if (!isAdmin) {
                return h.response("Not an Admin. Only Admin can view all Users").code(400)
            }
            const users = await models.User.findAll({ include: [{ model: models.Role, as: 'roles', required: true, where: { title: 'customer' } }, { model: models.User, as: 'trainers' }] })
            console.log(users)
            return users
        } catch (err) {
            console.log(err.toString())
            return h.response(`something went wrong. Error: ${err.toString()}`).code(400)

        }
    },
    addTrainer: async (request, h) => {
        const role_id = request.auth.credentials.role_id
        console.log("auth credentials", role_id)
        const isAdmin = await roleauth.isAdmin(role_id)
        if (!isAdmin) {
            return h.response("Not an Admin. Only Admin can assign trainer to user").code(400)
        }
        const id = request.params.id
        const trainer_id = request.payload.trainer
        try {
            const customerRole = await models.Role.findOne({ where: { title: "customer" } })
            const customer = await models.User.findByPk(id)
            if (customer.role_id !== customerRole.id) {
                return h.response("Not a customer. Only customer can have a trainer").code(400)
            }
            customer.trainer_id = trainer_id
            await customer.save()
            const updatedCustomer = await models.User.findByPk(customer.id, {include: {model: models.User, as : 'trainers' }})
            console.log(JSON.stringify(updatedCustomer))
            return updatedCustomer
        } catch (err) {
            console.log("error while updating trainer_id")
            console.log(err.toString())
            return h.response(err.toString()).code(400)
        }

    },
    getAllTrainers: async (request, h) => {
        try {
            const trainer_role = await models.Role.findOne({ where: { title: 'trainer' } })

            const trainers = await models.User.findAll({ where: { role_id: trainer_role.id }, include: { model: models.Role, as: 'roles' } })
            return trainers
        } catch (err) {
            console.log(err.toString())
            return { message: `something went wrong. Error: ${err.toString()}` }

        }

    },

    deleteUser: async (request, h) => {
        try {
            role_id = request.auth.credentials.role_id
            console.log("auth credentials", role_id)
            const isAdmin = await roleauth.isAdmin(role_id)
            if (!isAdmin) {
                return { message: "Not an Admin. Only Admin can delete a User" }
            }
            const deletedUser = await models.User.destroy({ where: { id: request.params.id } })
            return { deletedUser }
        } catch (err) {
            console.log(err.toString())
            return { message: err.toString() }
        }
    }

}