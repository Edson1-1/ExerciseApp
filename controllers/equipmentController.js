

const models = require('../models')
const roleauth = require('../authentication/roleauth')
module.exports = {
    //add new equipment
    addEquipment: async (request, h) => {
        role_id = request.auth.credentials.role_id
        console.log("role_id", role_id)
        const equipment =  request.payload.name.toLowerCase()
        const isAdmin = await roleauth.isAdmin(role_id)
        if(!isAdmin){
            return h.response("Only admin can add equipment. You are not autherized to do this").code(401)
        }
        try{
            const addedEquipment = await models.Equipment.create({equipment_name : equipment})
            return addedEquipment
        }catch(err){
            console.log(err.toString())
            return h.response(err.toString()).code(400)
        }        
    
    },
    getAllEquipment: async(request, h) => {
        const role_id = request.auth.credentials.role_id
        console.log("role_id:", role_id)
        const isAdmin = await roleauth.isAdmin(role_id)
        if(isAdmin){
            try {
                const equipments = models.Equipment.findAll()
                return equipments
            }catch(err){
                console.log(err.toString())
                return h.response(err.toString()).code(400)
            }   
        }else{
            return h.response("You are not autherized to do this").code(401)
        }
    },
    getEquipmentById:  async(request, h) => {
        const role_id = request.auth.credentials.role_id
        console.log("role_id:", role_id)
        const isAdmin = await roleauth.isAdmin(role_id)
        if(isAdmin){
            const id = request.params.id
            try{
                const equipment = await models.Equipment.findByPk(id)
                if (equipment) {
                    return equipment
                }else {
                    return {message : "equipment does not exist"}
                }
            }catch(err){
                console.log(err.toString())
                return {message : err.toString}
            }
        }else{
            return {message: "You are not autherized to do this"}
        }
    },
    updateEquipmentById: async(request, h)=>{
        const role_id = request.auth.credentials.role_id
        console.log("role_id:", role_id)
        console.log("id:", request.auth.credentials.id)
        const isAdmin = await roleauth.isAdmin(role_id)
        if(isAdmin){
            const id = request.params.id
            const equipmentEdits = request.payload.name.toLowerCase()

            try{
                const equipment = await models.Equipment.findByPk(id)
                if (equipment) {
                    equipment.equipment_name = equipmentEdits
                    const updatedEquipment = await equipment.save()

                    return updatedEquipment
                }else {

                    return {message : "equipment does not exist"}
                }
            }catch(err){
                console.log(err.toString())

                return {message : err.toString}
            }
        }else{

            return {message: "You are not autherized to do this"}
        }
    },
    deleteById: async(request, h) => {
        const role_id = request.auth.credentials.role_id
        console.log("role_id:", role_id)
        const isAdmin = await roleauth.isAdmin(role_id)
        if(isAdmin){
            const id = request.params.id
            try{
                const deletedEquipment = await models.Equipment.destroy({where:{id}})
                return h.response("Equipment has been deleted").code(200)
            }catch(err){
                console.log(err.toString())
                const checkError = 'SequelizeForeignKeyConstraintError: update or delete on table "equipments" violates foreign key constraint "exercises_equipment_id_fkey" on table "exercises"'
                if(err.toString() === checkError){
                    return h.response("Cannot Delete this Equipment since an Exercise is bound to it. If you want to change the Equipment please follow onto the edit page.").code(400)
                }
                return h.response(err.toString()).code(400)
            }
        }else{

            return {message: "You are not autherized to do this"}
        }

    }   
}