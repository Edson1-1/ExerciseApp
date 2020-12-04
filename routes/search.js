

const Joi = require('@hapi/joi')
const searchController = require("../controllers/searchController")

const baseAddress = '/search/api'
module.exports = [ 
    {
        //search Customers(Users) *
        method: 'POST',
        path: baseAddress+'/searchcustomer',
        handler: searchController.adminSearchCustomer,

    },
    {
        //search Users by trainer id
        method: 'POST',
        path: baseAddress+'/getuserbytrainer/{id}',
        handler: searchController.getUserByTrainerId,

    },
    {
        //search Exercise by name/type *
        method: 'POST',
        path: baseAddress+'/getexercise',
        handler: searchController.getExercise,

    },
    {
        //search User's exercises by given date
        //not working
        //done below in searching customers
        method: 'POST',
        path: baseAddress+'/getuserexercisebydate',
        handler: searchController.getUserExerciseByDate,

    },
    {
        //search User's exercises by given user name/email/id
        //done below in searching customers
        method: 'POST',
        path: baseAddress+'/getuserexercise',
        handler: searchController.getUserExercise,

    },
    {
        //search Exercise's users' by given exercise name/id
        method: 'POST',
        path: baseAddress+'/getexerciseuser',
        handler: searchController.getExerciseUser,

    },
    {   //searching customers
        //search customer's exercises by exercise_name, duration, date *
        method: 'POST',
        path: baseAddress+'/customersexercise',
        handler: searchController.searchCustomerExercise
    }
]