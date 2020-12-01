const Joi = require('@hapi/joi')
const roleController = require('../../controllers/roleController')
const baseAddress = '/admin/api/role'
module.exports = [
    {   //getAll roles
        method: 'GET',
        path: baseAddress+'/all',
        options:{
            auth: false
        },
        handler: roleController.getRoles
    }
]