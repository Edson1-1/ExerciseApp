

const Joi = require('@hapi/joi')
const searchController = require("../controllers/searchController")

const baseAddress = '/search/api'
module.exports = [ 
    {
        //search Users by trainer name
        method: 'POST',
        path: baseAddress+'/getuserbytrainer',
        handler: searchController.getUserByTrainerName,

    },
    {
        //search Users by trainer id
        method: 'POST',
        path: baseAddress+'/getuserbytrainer/{id}',
        handler: searchController.getUserByTrainerId,

    },
    {
        //search Exercise by name/type
        method: 'POST',
        path: baseAddress+'/getexercise',
        handler: searchController.getExercise,

    },
    {
        //search User's exercises by given date
        //not working
        method: 'POST',
        path: baseAddress+'/getuserexercisebydate',
        handler: searchController.getUserExerciseByDate,

    },
    {
        //search User's exercises by given user name/email/id
        method: 'POST',
        path: baseAddress+'/getuserexercise',
        handler: searchController.getUserExercise,

    },
    {
        //search Exercise's users' by given exercise name/id
        method: 'POST',
        path: baseAddress+'/getexerciseuser',
        handler: searchController.getExerciseUser,

    }
]