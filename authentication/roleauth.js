const models = require('../models')

module.exports = {
    isAdmin : async (roleId) => {
        try{
            console.log(roleId)
            const admin = await models.Role.findOne({where:{ title: 'admin'}})
            console.log(JSON.stringify(admin))
            if(roleId === admin.id){
                console.log("is admin")
                return true
            }else{
                console.log("not admin")
                return false
            }
        }catch(err){
            console.log('error at role auth')
            console.log(err.toString())
            return false
        }
    }
}