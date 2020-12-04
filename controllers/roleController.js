const models = require('../models')

module.exports = {
    //getRoles
    getRoles: async (request, h) => {
        try{
            const roles = await models.Role.findAll()
            return roles
        }catch(err){
            console.log(err.toString())
            return h.response(err.toString()).code(400)
        }
    }
}