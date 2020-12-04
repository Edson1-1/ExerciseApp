const models = require('../models')
const roleauth = require('../authentication/roleauth')
module.exports = {
    //add new exercise
    addExercise: async(request, h) => {
        const exercise = {
            exercise_name : request.payload.name.toLowerCase(),
            type: request.payload.type.toLowerCase(),
            equipment_id : request.payload.equipment
        }

        const role_id = request.auth.credentials.role_id
        console.log("role_id", role_id)
        const isAdmin = await roleauth.isAdmin(role_id)
        if(!isAdmin){
            return h.response("You are not autherized to do this").code(401) 
        }
        //setting the exercise_type
        try{
            const type = await models.Exercise_Type.findOne({where: {exercise_type: exercise.type}})
            if(!type){
                const newType = await models.Exercise_Type.create({ exercise_type: exercise.type})
                exercise.type = newType.id
            }
            else{
                exercise.type = type.id
            }
        }catch(err){
            console.log("Error while updateing exercise_type: "+err.toString())
            return h.response("Error while updateing exercise_type: "+err.toString()).code(400) 
        }
        //creating exercise
        try{
            const newExercise = await models.Exercise.create({ exercise_name: exercise.exercise_name, 
                type_id: exercise.type, 
                equipment_id : exercise.equipment_id})
            return newExercise
        }catch(err){
            console.log("error in creating exercise")
            console.log(err.toString())
            return h.response(err.toString()).code(400)       
        }
    },
    getAllExercises: async(request, h) => {
        try{
            const exercises = await models.Exercise.findAll({
                include: [
                    { model: models.Equipment, as: 'equipment', required: true}, 
                    {model: models.Exercise_Type, as: 'type' }
                ]
            })
            return exercises
        }catch(err){
            console.log("error with retrieveing exercies")
            console.log(err.toString())
            return h.response(err.toString()).code(400)
            }
        },
        getExerciseById: async(request, h) => {
            const id = request.params.id
            try{
                const exercise = await models.Exercise.findOne({
                    where: {id}, 
                    include: [
                    { model: models.Equipment, as: 'equipment', required: true}, 
                    { model: models.Exercise_Type, as: 'type' }]
                })
                return exercise
            }catch(err){
                console.log("error while getting a single exercise")
                console.log(err.toString())
                return h.response(err.toString()).code(400)
            }
        },
        updateExerciseById: async(request, h) => {
            const id = request.params.id
            const exercise = {
                exercise_name : request.payload.name,
                type: request.payload.type,
                equipment_id : request.payload.equipment
            }
            const role_id = request.auth.credentials.role_id
            console.log("role_id", role_id)
            const isAdmin =  await roleauth.isAdmin(role_id)
            if(!isAdmin){
                return h.response("You are not autherized to do this").code(401)
            }
            //setting the exercise_type
            try{
                const type = await models.Exercise_Type.findOne({where: {exercise_type: exercise.type}})
                if(!type){
                    const newType = await models.Exercise_Type.create({ exercise_type: exercise.type})
                    exercise.type = newType.id
                }
                else{
                    exercise.type = type.id
                }
            }catch(err){
                console.log("Error while updateing exercise_type: "+err.toString())
                return h.response("Error while updateing exercise_type: "+err.toString()).code(400)
            }

            try{
                const exerciseinDB = await models.Exercise.findOne({where: {id}})
                exerciseinDB.exercise_name = exercise.exercise_name
                exerciseinDB.type_id = exercise.type 
                exerciseinDB.equipment_id = exercise.equipment_id

                const updatedExercise = await exerciseinDB.save() 

                return updatedExercise
            }catch(err){
                console.log("error in updating exercise")
                console.log(err.toString())
                return h.response(err.toString()).code(400)      
            }
        },
        deleteById: async(request, h) => {
            const role_id = request.auth.credentials.role_id
            console.log("role_id:", role_id)
            const isAdmin = await roleauth.isAdmin(role_id)
            if(!isAdmin){
                const response = h.response('You are not autherized to do this')
                response.code(400)
                return response
            }
                const id = request.params.id
                try{
                    const deletedExercise = await models.Exercise.destroy({where:{id}})
                    const response = h.response("Exercise has been deleted")
                    response.code(200)
                    return response
                }catch(err){
                    console.log("error while deleteing exercise")
                    console.log(err.toString())
                    return h.response("error while deleteing exercise"+err.toString()).code(400)
                }
    
            },
            getAllType: async(request, h) => {
                try{
                    const type = await models.Exercise_Type.findAll()
                    return type
                }catch(err){
                    console.log("error with retrieveing types")
                    console.log(err.toString())
                    return h.response(err.toString()).code(400)
                    }
                }
    
}  
