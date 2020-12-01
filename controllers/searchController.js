
const models = require('../models')


module.exports = {
    //search using trainer name/id
    getUserByTrainerName: async(request, h) => {
        try{
        const trainerName = request.payload.name
            const trainer_role = await models.Role.findOne({where: { title : 'trainer'}})
            const ourTrainer = await models.User.findOne({where: {role_id: trainer_role.id, username: trainerName}})
        const users = await models.User.findAll({where : { trainer_id : ourTrainer.id}})
        const trainer_user = { ourTrainer, users}

        return (trainer_user)
        }catch(err){
            console.log(err.toString())
            return {message: err.toString()}
        }    
    },
    getUserByTrainerId: async(request, h) => {
        try{
        const trainerId = request.params.id
            const trainer_role = await models.Role.findOne({where: { title : 'trainer'}})
            const ourTrainer = await models.User.findOne({where: {role_id: trainer_role.id, id: trainerId}})
        const users = await models.User.findAll({where : { trainer_id : ourTrainer.id}})
        const trainer_user = { ourTrainer, users}

        return (trainer_user)
        }catch(err){
            console.log(err.toString())
            return {message: err.toString()}
        }    
    },
    getExercise: async(request, h) => {
        try{
        const name = request.payload.name
        const type = await models.Exercise_Type.findOne({where: {exercise_type: name}})
        if(type){
            const exercises = await models.Exercise.findAll({where: {type_id: type.id}})
            if(!exercises){
                return h.response("no exercises of this type").code(400)
            }
            return exercises
        }else{
            const exercises = await models.Exercise.findAll({where: {exercise_name: name}})
            if(!exercises){
                return h.response("no exercises of the given title").code(400)
            }
            return exercises
        }
        }catch(err){
            console.log(err.toString())
            return h.response(err.toString()).code(400)
        }    
    },
    getUserExerciseByDate: async(request, h) => {
        try{
        const date = request.payload.date
        const user_id = request.auth.credentials.id
        console.log(user_id)
        const exercises = await models.UserExercise.findAll({where:{user_id, date}, 
            include: [{ model: models.User, as :'user', required: true},{ model: models.Exercise, as: 'exercises'}]})
    
        console.log(JSON.stringify(exercises))
        return exercises
        }catch(err){
            console.log(err.toString())
            return {message: err.toString()}
        }    
    },
    getUserExercise: async(request, h) => {
        try{
        const name = request.payload.name
        const user_id = request.auth.credentials.id
        console.log(user_id)
        console.log(parseInt(name))
        let user = await models.User.findOne({where:{username: name}})
        if(!user){
         user = await models.User.findOne({where:{email: name}})
         if(!user){
        if (parseInt(name)){
         user = await models.User.findOne({where:{id: name}})
        }
         if(!user){
                return h.response("user does not exist").code(400)
         }
         }
        }
        const exercises = await models.User.findAll({where: {id: user.id},include: models.Exercise})

        return exercises
        }catch(err){
            console.log(err.toString())
            return h.response(err.toString()).code(400)
        }    
    },
    getExerciseUser: async(request, h) => {
        try{
        const name = request.payload.name

        let exercise = await models.Exercise.findOne({where:{exercise_name: name}})
        if(!exercise){
        if (parseInt(name)){
         exercise = await models.Exercise.findOne({where:{id: name}})
        }
         if(!exercise){
                return h.response("exercise does not exist").code(400)
         }
        }
        const users = await models.Exercise.findAll({where: {id: exercise.id},include: models.User})

        return users
        }catch(err){
            console.log(err.toString())
            return h.response(err.toString()).code(400)
        }    
    }
}