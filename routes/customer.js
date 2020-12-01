/* CRUD User Exrs API - should not contain /admin  - general API only - 
should be able to log what the exrs the user has done at what datetime for how many hours */

const Joi = require('@hapi/joi')
const customerController = require("../controllers/customerController")

const baseAddress = '/customer/api'
module.exports = [ 
    {
        //log Exercise for User
        method: 'POST',
        path: baseAddress+'/logexercise',
        handler: customerController.logExercise,

    },
    {
        //delete logged exercise for User
        method : 'DELETE',
        path: baseAddress+'/delete_logged_exercise/{id}',
        handler: customerController.deleteLogExercise
    },
    {
        //get all the exercises the user has logged
        method: 'GET',
        path: baseAddress+'/getallexercises',
        handler: customerController.getAllExercises
    }
]