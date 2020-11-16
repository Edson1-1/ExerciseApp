//CRUD user admin API - should contain /admin/api in the path

const baseAddress = '/admin/api/user'
module.exports = [
    {
        method: 'POST',
        path: baseAddress+'/register',
        handler: (request, h) => {
            const exercise = { 
                name : request.payload.name,
                email: request.payload.email,
                height: request.payload.height,
                weight: request.payload.weight,
                age: request.payload.age,
                role_id: request.payload.role_id,
            }
            console.log(exercise)
            return exercise
        }
    },
    {
        method: 'POST',
        path: baseAddress+'/login',
        handler: (request, h) => {
            return "logged in succesfully"
        }   
    }
]