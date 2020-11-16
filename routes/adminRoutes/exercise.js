//CRUD Exrs admin API - should contain /admin/api in the path

const baseAddress = '/admin/api/exercise'
module.exports = [
    {
        method: 'POST',
        path: baseAddress+'/add',
        handler: (request, h) => {
            const exercise = { 
                name : request.payload.name,
                type: request.payload.type,
                equipment: request.payload.equipment
            }
            console.log(exercise)
            return exercise
        }
    },
    {
        method: 'GET',
        path: baseAddress+'/',
        handler: (request, h) => {
            return "GET all exercises works"
        }   
    },
    {
        method: 'GET',
        path: baseAddress+'/{id}',
        handler: (request, h) => {
            const id = request.params.id
            return `GET exercise ${id} works`
        } 
    },
    {
        method: 'PUT',
        path: baseAddress+'/update/{id}',
        handler: (request, h) => {
            const id = request.params.id
            return `update exercise ${id} works`
        }
    },
    {
        method: 'DELETE',
        path: baseAddress+'/delete/{id}',
        handler: (request, h) => {
            const id = request.params.id
            return `delete exercise ${id} works`
        }
    }
]