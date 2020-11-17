const bcrypt = require('bcrypt')
const User = require('../models/User');
const Roles = require('../models/Roles');

module.exports = {
    //signUp
    userRegister: async(request, h) => {
        const password = request.payload.password
        const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT));
        const user = { 
            name : request.payload.name,
            hashedPassword : hashedPassword,
            email: request.payload.email,
            role_id: request.payload.role_id,
        }
        try{
            const registeredUser = await User.create({username: user.name, email: user.email, hashedPassword: user.hashedPassword,
            role_id : user.role_id})
            return registeredUser
        }catch(err){
            console.log(err)
            return "something went wrong"
        }
},
    //signIn
    userLogin: async (request, h) => {

        const user = {
            name: request.payload.name,
            password: request.payload.password,
            role_id: request.payload.role_id
        }
        
        const userInDB = await User.findOne({ where: {username: user.name}})
        if(bcrypt.compareSync(user.password, userInDB.hashedPassword)){
            request.cookieAuth.set({ id: userInDB.id});
            return "logged in"
        }else{
            return "not logged in"
        }  
},
    getAll: async(request, h) => {
        try{
            role_id = request.auth.credentials.role_id
            console.log("auth credentials", role_id)
            if(role_id !== 1){
                return "Not a valid user"
            }
            const users = await User.findAll({include : Roles})
            return users
        }catch(err){
            console.log(err.toString())
            return "something went wrong"
            
        }
    } 

}