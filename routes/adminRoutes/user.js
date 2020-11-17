//CRUD user admin API - should contain /admin/api in the path

const Joi = require('@hapi/joi')
const userController = require('../../controllers/userController')

const baseAddress = '/admin/api/user'
module.exports = [
    {   //user sign up
        method: 'POST',
        path: baseAddress+'/register',
        handler: userController.userRegister,
        options: {
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
    }
]