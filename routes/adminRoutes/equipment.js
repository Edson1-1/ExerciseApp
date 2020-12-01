//CRUD Equipment admin API - should contain /admin/api in the path

const Joi = require('@hapi/joi')
const equipmentController = require('../../controllers/equipmentController')


const baseAddress = '/admin/api/equipment'
module.exports = [
    {   //add new equipment
        method: 'POST',
        path: baseAddress+'/add',
        handler: equipmentController.addEquipment,
        options: {
            validate:{
                payload: Joi.object({
                    name: Joi.string().required()
                })
            }
        }
    },
    {   //get all equipment
        method: 'GET',
        path: baseAddress+'/',
        handler: equipmentController.getAllEquipment,
    },
    {   //get equipment according to id
        method: 'GET',
        path: baseAddress+'/{id}',
        handler: equipmentController.getEquipmentById, 
    },
    {   //update equipment
        method: 'PUT',
        path: baseAddress+'/update/{id}',
        handler: equipmentController.updateEquipmentById,
        options: {
            validate:{
                payload: Joi.object({
                    name: Joi.string().required()
                })
            }
        }
    },
    {   //delete equipment
        method: 'DELETE',
        path: baseAddress+'/delete/{id}',
        handler: equipmentController.deleteById,
    }
]