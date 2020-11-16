//CRUD Exrs admin API - should contain /admin/api in the path

const baseAddress = '/admin/api/exercise'
module.exports = [
    {   //add new exercise
        method: 'POST',
        path: baseAddress+'/add',
        handler: (request, h) => {
            const exercise = { 
                name : request.payload.name,
                type: request.payload.type,
                equipment: request.payload.equipment
            }
            //add to DB
            console.log(exercise)
            return {message : "added to db succesfully"}
        },
        options:{
            auth: 'session'
        }
    },
    {   //get all exercise
        method: 'GET',
        path: baseAddress+'/',
        handler: (request, h) => {
            return "GET all exercises works"
        },  
    },
    {   //get exercise according to id
        method: 'GET',
        path: baseAddress+'/{id}',
        handler: (request, h) => {
            const id = request.params.id
            return `GET exercise ${id} works`
        } 
    },
    {   //update exercise
        method: 'PUT',
        path: baseAddress+'/update/{id}',
        handler: (request, h) => {
            const id = request.params.id
            return `update exercise ${id} works`
        }
    },
    {   //delete exercise
        method: 'DELETE',
        path: baseAddress+'/delete/{id}',
        handler: (request, h) => {
            const id = request.params.id
            return `delete exercise ${id} works`
        }
    }
]