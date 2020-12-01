//CRUD user admin API - should contain /admin/api in the path
const jwt = require('jsonwebtoken')
const Joi = require('@hapi/joi')
const userController = require('../../controllers/userController')

const baseAddress = '/admin/api/user'
module.exports = [
    {   //user sign up
        method: 'POST',
        path: baseAddress+'/register',
        handler: userController.userRegister,
        options: {
            cors: true,
            auth: false,
            validate: {
                payload: Joi.object({
                    name: Joi.string().required().min(3),
                    password: Joi.string().required(),
                    email: Joi.string().email().required(),
                    role_id: Joi.required()
                })
            }
        }
    },
    {   //user login
        method: 'POST',
        path: baseAddress+'/login',
        handler: userController.userLogin,
        options: {
            validate:{
                payload: Joi.object({
                    name: Joi.string().min(3),
                    password: Joi.string().required(),
                    role_id: Joi.required()
                })
            },
            auth: {
                mode: 'try'
            }
        }   
    },
    {   //getAll users
        method: 'GET',
        path: baseAddress+'/all',
        handler: userController.getAll
    },
    {   //getAll users
        method: 'GET',
        path: baseAddress+'/customers',
        handler: userController.getCustomers
    },
    {
        //assigning trainer
        method: 'PUT',
        path: baseAddress+'/addtrainer/{id}',
        handler: userController.addTrainer
    },
    {
        //getting trainers
        method : 'GET',
        path: baseAddress+'/fetchtrainers',
        handler: userController.getAllTrainers
    },
    {
        //jwt test login
        method: 'POST',
        path: baseAddress+'/samplelogin',
        handler: (request, h) => {
            const user = {
                name: 'edson',
                id: 1,
                pass: 'eeeeee'
            }

            const token = jwt.sign(user, process.env.JWTSECRET)
            return token
        },
        options:{
            auth:{
                mode: 'try'
            }
        }
    },
    {
        //jwt test login
        method: 'POST',
        path: baseAddress+'/sampleroute',
        handler: (request, h) => {
            console.log("req.auth.credentials = ",request.auth.credentials)
            return request.auth.credentials
        },
        options:{
            auth:{
                strategy: 'my_jwt_stategy'
            }
        }
    }
]