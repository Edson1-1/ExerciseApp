//CRUD user admin API - should contain /admin/api in the path

const bcrypt = require('bcrypt')
const Joi = require('@hapi/joi')

const baseAddress = '/admin/api/user'
module.exports = [
    {   //user sign up
        method: 'POST',
        path: baseAddress+'/register',
        handler: async(request, h) => {
            const password = request.payload.password
            const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT));
            const user = { 
                name : request.payload.name,
                hashedPassword : hashedPassword,
                email: request.payload.email,
                role_id: request.payload.role_id,
            }
            console.log(hashedPassword)
            console.log(user)
            return user
        },
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
        handler: async (request, h) => {
            const hashedPassword = "$2b$10$JaHWv.NSN8ctdYWaJdAxHuPkmjklO6g3zfT7J4AdTi.sRRg9dArUK"
            const user = {
                id: 1,
                name: 'Jon Doe',
                password: "endurance",
                email: 'ssss@email.com',
                role_id: 1
              }
                
              if(bcrypt.compareSync(user.password, hashedPassword)){
                request.cookieAuth.set({ id: user.id });
                return "logged in"
               }else{
                   return "not logged in"
               }  
        },
        options: {
            auth: {
                mode: 'try'
            }
        }   
    }
]