//CRUD Equipment admin API - should contain /admin/api in the path


const baseAddress = '/admin/api/equipment'
module.exports = [
    {
        method: 'POST',
        path: baseAddress+'/add',
        handler: (request, h) => {
            const equipment = { 
                name : request.payload.name
            }
            console.log(equipment)
            return equipment
        }
    },
    {
        method: 'GET',
        path: baseAddress+'/',
        handler: (request, h) => {
            return "GET all equipment works"
        }   
    },
    {
        method: 'GET',
        path: baseAddress+'/{id}',
        handler: (request, h) => {
            const id = request.params.id
            return `GET equipment ${id} works`
        } 
    },
    {
        method: 'PUT',
        path: baseAddress+'/update/{id}',
        handler: (request, h) => {
            const id = request.params.id
            return `update equipment ${id} works`
        }
    },
    {
        method: 'DELETE',
        path: baseAddress+'/delete/{id}',
        handler: (request, h) => {
            const id = request.params.id
            return `delete equipment ${id} works`
        }
    }
]