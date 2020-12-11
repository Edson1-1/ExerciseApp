
const populateUserController = require('../../controllers/test/populateUserController')

const baseAddress = '/test/api'
module.exports = [
    {
        method: 'POST',
        path: baseAddress+'/populateusers',
        // handler: populateUserController.addRandomUserDataToSampleUserTable, 
        handler: populateUserController.populateUserTable, // does same thing but much more cleaner than above handler
        options:{
            auth: false
        }
    },
    {   // deletes fake users only from User table and SampleUser table
        method: 'DELETE',
        path: baseAddress+'/destroyfakeuser',
        handler: populateUserController.destroyFakeUsers,
        options:{
            auth: false
        }
    },
    {   //logs exercises for fake users
        method: 'POST',
        path: baseAddress+'/fakelogexercise',
        handler: populateUserController.logExerciseForFakeUsers,
        options:{
            auth: false
        }
    },
    {   //deletes all exercise logs 
        method: 'DELETE',
        path: baseAddress+'/destroylogexercise',
        handler: populateUserController.destroyFakeExerciseLogs,
        options:{
            auth: false
        }
    },
    {   // does not work... was trying to use fork so as to make the server non-blocking. 
        method: 'POST',
        path: baseAddress+'/parallel',
        handler: populateUserController.createUsersParallel,
        options:{
            auth: false
        }
    }
]