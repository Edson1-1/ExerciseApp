
const models = require('../models');

module.exports = {
    //
    logExercise: async(request, h) => {
        const id = request.auth.credentials.id //user_id
        console.log("user id: ",id)

        try{
        user = await models.User.findByPk(id); //get User
        }catch(err){
            console.log(err.toString())
            return h.response(err.toString()).code(400)
        }
        const exercise = request.payload //exercises
            const e_id = exercise.id //get exercise id
            try{
                const newExercise = await models.Exercise.findByPk(e_id); //get Exercise
                console.log(JSON.stringify(newExercise))
                const userExerciseMap = await user.addExercise(newExercise, { through: 
                    { date: exercise.date, start_time: exercise.startTime, end_time: exercise.endTime}
                }) /* create map b/w User and Exercise */
                console.log(userExerciseMap)
                return userExerciseMap
            }catch(err){
                console.log(err.toString())
                return ({message: err.toString()})
            }
            
    },
    //delete log entry
    deleteLogExercise: async(request, h) => {
        const user_id = request.auth.credentials.id
        const exercise_id = request.params.id
        try{
            const deletedExercise = await models.UserExercise.destroy({where: {user_id, exercise_id}})
            console.log(JSON.parse(deletedExercise))
            return deletedExercise
        }catch(err){
            console.log(err.toString())
            return {message: err.toString()}
        }
    },
    getAllExercises: async(request, h) => {
        const user_id = request.auth.credentials.id
        try{
            const userExerciseMap = await models.User.findOne({where: {id: user_id}, include: models.Exercise})
            return userExerciseMap
        }catch(err){
            console.log(err.toString())
            return {message: err.toString()}
        }
    }


}