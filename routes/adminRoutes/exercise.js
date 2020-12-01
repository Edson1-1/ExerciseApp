//CRUD Exrs admin API - should contain /admin/api in the path
const exerciseController = require('../../controllers/exerciseController')
const Joi = require('@hapi/joi')
const baseAddress = '/admin/api/exercise'
module.exports = [
    {   //add new exercise
        method: 'POST',
        path: baseAddress+'/add',
        handler: exerciseController.addExercise,
        options:{
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    type: Joi.string().required(),
                    equipment : Joi.required()
                })
            }
        }
    },
    {   //get all exercise
        method: 'GET',
        path: baseAddress+'/',
        handler: exerciseController.getAllExercises
    },
    {   //get exercise according to id
        method: 'GET',
        path: baseAddress+'/{id}',
        handler: exerciseController.getExerciseById
    },
    {   //update exercise
        method: 'PUT',
        path: baseAddress+'/update/{id}',
        handler: exerciseController.updateExerciseById
    },
    {   //delete exercise
        method: 'DELETE',
        path: baseAddress+'/delete/{id}',
        handler: exerciseController.deleteById,
    },
    {   //get all types
        method: 'GET',
        path: baseAddress+'/type/',
        handler: exerciseController.getAllType,
    }
]