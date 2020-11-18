//CRUD Equipment admin API - should contain /admin/api in the path
const Equipment = require('../../models/Equipment')


const baseAddress = '/admin/api/equipment'
module.exports = [
    {   //add new equipment
        method: 'POST',
        path: baseAddress+'/add',
        handler: async (request, h) => {
            
            const equipment =  request.payload.name
            try{
                const addedEquipment = await Equipment.create({Equipment_name : equipment})
                return addedEquipment
            }catch(err){
            console.log("cannot add to DB")
            return "Cannot add to db"
}        }
    },
    {   //get all equipment
        method: 'GET',
        path: baseAddress+'/',
        handler: async(request, h) => {
            const credentials = request.auth.credentials.role_id
            console.log(credentials)
            try {
                const equipments = Equipment.findAll()
                return equipments
            }catch(err){
                console.log("error occured while retrieving data. could not retrieve data")
                return "Cannot retrieve data"
            }
            
        }   
    },
    {   //get equipment according to id
        method: 'GET',
        path: baseAddress+'/{id}',
        handler: (request, h) => {
            const id = request.params.id
            return `GET equipment ${id} works`
        } 
    },
    {   //update equipment
        method: 'PUT',
        path: baseAddress+'/update/{id}',
        handler: (request, h) => {
            const id = request.params.id
            return `update equipment ${id} works`
        }
    },
    {   //delete equipment
        method: 'DELETE',
        path: baseAddress+'/delete/{id}',
        handler: (request, h) => {
            const id = request.params.id
            return `delete equipment ${id} works`
        }
    }
]