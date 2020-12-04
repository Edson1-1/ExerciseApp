
const models = require('../models')


module.exports = {
    //search -Admin for customer details *
    adminSearchCustomer: async (request, h) => {
        try {
            const name = request.payload.name.toLowerCase()
            const user = await models.User.findAll({
                where: { username: name },
                attributes: { exclude: ['hashedPassword']},
                include: [{ model: models.Role, as: 'roles', required: true, where: { title: 'customer' } },
                { model: models.User, as: 'trainers' }]
            })
            if (user.length !== 0) {
                return user
            } else {
                const user = await models.User.findAll({
                    where: { email: name },
                    attributes: { exclude: ['hashedPassword']},
                    include: [{ model: models.Role, as: 'roles', required: true, where: { title: 'customer' } },
                    { model: models.User, as: 'trainers' }]
                })
                if (user.length !== 0) {
                    return user
                } else {
                    const user = await models.User.findAll({
                        attributes: { exclude: ['hashedPassword']},
                        include: [{ model: models.Role, as: 'roles', required: true, where: { title: 'customer' } },
                        { model: models.User, as: 'trainers', where: { username: name } }]
                    })

                    if (user.length !== 0) {
                        return user
                    } else {
                        return h.response("User does not exist").code(400)
                    }
                }
            }

        } catch (err) {
            console.log(err.toString())
            return h.response(err.toString()).code(400)

        }

    },
    getUserByTrainerId: async (request, h) => {
        try {
            const trainerId = request.params.id
            const trainer_role = await models.Role.findOne({ where: { title: 'trainer' } })
            const ourTrainer = await models.User.findOne({ where: { role_id: trainer_role.id, id: trainerId } })
            const users = await models.User.findAll({ where: { trainer_id: ourTrainer.id } })
            const trainer_user = { ourTrainer, users }

            return (trainer_user)
        } catch (err) {
            console.log(err.toString())
            return { message: err.toString() }
        }
    },
    // search for exercises using exercise_name, type, equipment *
    getExercise: async (request, h) => {
        try {
            const name = request.payload.name.toLowerCase()
            const type = await models.Exercise_Type.findOne({ where: { exercise_type: name } })
            const equipment = await models.Equipment.findOne({ where: { equipment_name: name } })
            if (type) {
                const exercises = await models.Exercise.findAll({
                    where: { type_id: type.id }, include: [
                        { model: models.Equipment, as: 'equipment', required: true },
                        { model: models.Exercise_Type, as: 'type' }
                    ]
                })
                if (exercises.length === 0) {
                    return h.response("no exercises of this type").code(400)
                }
                return exercises
            } else if (equipment) {
                const exercises = await models.Exercise.findAll({
                    where: { equipment_id: equipment.id }, include: [
                        { model: models.Equipment, as: 'equipment', required: true },
                        { model: models.Exercise_Type, as: 'type' }
                    ]
                })
                if (exercises.length === 0) {
                    return h.response("no exercises of this type").code(400)
                }
                return exercises
            }
            else {
                const exercises = await models.Exercise.findAll({
                    where: { exercise_name: name }, include: [
                        { model: models.Equipment, as: 'equipment', required: true },
                        { model: models.Exercise_Type, as: 'type' }
                    ]
                })
                if (exercises.length === 0) {
                    return h.response("no exercises of the given title").code(400)
                }
                return exercises
            }
        } catch (err) {
            console.log(err.toString())
            return h.response(err.toString()).code(400)
        }
    },
    getUserExerciseByDate: async (request, h) => {
        try {
            const date = request.payload.date
            const user_id = request.auth.credentials.id
            console.log(user_id)
            const exercises = await models.UserExercise.findAll({
                where: { user_id, date },
                include: [{ model: models.User, as: 'user', required: true }, { model: models.Exercise, as: 'exercises' }]
            })

            console.log(JSON.stringify(exercises))
            return exercises
        } catch (err) {
            console.log(err.toString())
            return { message: err.toString() }
        }
    },
    getUserExercise: async (request, h) => {
        try {
            const name = request.payload.name
            const user_id = request.auth.credentials.id
            console.log(user_id)
            console.log(parseInt(name))
            let user = await models.User.findOne({ where: { username: name } })
            if (!user) {
                user = await models.User.findOne({ where: { email: name } })
                if (!user) {
                    if (parseInt(name)) {
                        user = await models.User.findOne({ where: { id: name } })
                    }
                    if (!user) {
                        return h.response("user does not exist").code(400)
                    }
                }
            }
            const exercises = await models.User.findAll({ where: { id: user.id }, include: models.Exercise })

            return exercises
        } catch (err) {
            console.log(err.toString())
            return h.response(err.toString()).code(400)
        }
    },
    getExerciseUser: async (request, h) => {
        try {
            const name = request.payload.name
            let exercise = await models.Exercise.findOne({ where: { exercise_name: name } })
            if (!exercise) {
                if (parseInt(name)) {
                    exercise = await models.Exercise.findOne({ where: { id: name } })
                }
                if (!exercise) {
                    return h.response("exercise does not exist").code(400)
                }
            }
            const users = await models.Exercise.findAll({ where: { id: exercise.id }, include: models.User })
            return users
        } catch (err) {
            console.log(err.toString())
            return h.response(err.toString()).code(400)
        }
    },
    // search for User's logged exercises using exercise name, duration, date
    searchCustomerExercise: async (request, h) => {
        const user_id = request.auth.credentials.id
        console.log('user_id', user_id)
        const date = request.query.date
        const searchKey = request.query.name
        if (date) {
            if (searchKey) {
                try {
                    // date and exercise_name
                    const userExerciseMap = await models.UserExercise.findAll({
                        where: { user_id: user_id, date: date }, 
                        attributes: { exclude: ['hashedPassword']},
                        include:
                            [{ model: models.Exercise, as: 'exercises', where: { exercise_name: searchKey } },
                            { model: models.User, as: 'user', include: { model: models.User, as: 'trainers' } }]
                    })
                    if (userExerciseMap.length === 0) {
                        // date and duration
                        if (parseInt(searchKey)) {
                            const userExerciseMap = await models.UserExercise.findAll({
                                where: { user_id: user_id, date: date, duration: searchKey }, 
                                attributes: { exclude: ['hashedPassword']},
                                include:
                                    [{ model: models.Exercise, as: 'exercises', },
                                    { model: models.User, as: 'user', include: { model: models.User, as: 'trainers' } }]
                            })
                            if (userExerciseMap.length === 0) {
                                return h.response(`No Exercise Log as such`).code(400)
                            } else {
                                // date and duration
                                return userExerciseMap
                            }
                        } else {
                            return h.response(`No Exercise Log as such`).code(400)
                        }
                    } else {
                        // date and exercise_name
                        return userExerciseMap
                    }
                } catch (err) {
                    console.log(err.toString())
                    return h.response(`cannot search for log at given date and for searchKey: ${err.toString()}`).code(400)
                }
            } else {
                try {
                    // date only
                    const userExerciseMap = await models.UserExercise.findAll({
                        where: { user_id: user_id, date: date }, 
                        attributes: { exclude: ['hashedPassword']},
                        include:
                            [{ model: models.Exercise, as: 'exercises' },
                            { model: models.User, as: 'user', include: { model: models.User, as: 'trainers' } }]
                    })
                    console.log('here', JSON.stringify(userExerciseMap))
                    if (userExerciseMap.length === 0) {
                        return h.response(`No Exercise Log as such`).code(400)
                    } else {
                        // date only
                        return userExerciseMap
                    }
                } catch (err) {
                    console.log(err.toString())
                    return h.response(`cannot search for log at given date : ${err.toString()}`).code(400)
                }
            }

        } else {
            if (searchKey) {
                try {
                    //exercise_name
                    const userExerciseMap = await models.UserExercise.findAll({
                        where: { user_id: user_id }, 
                        attributes: { exclude: ['hashedPassword']},
                        include:
                            [{ model: models.Exercise, as: 'exercises', where: { exercise_name: searchKey } },
                            { model: models.User, as: 'user', include: { model: models.User, as: 'trainers' } }]
                    })
                    if (userExerciseMap.length === 0) {
                        // duration
                        if (parseInt(searchKey)) {
                            const userExerciseMap = await models.UserExercise.findAll({
                                where: { user_id: user_id, duration: searchKey }, 
                                attributes: { exclude: ['hashedPassword']},
                                include:
                                    [{ model: models.Exercise, as: 'exercises', },
                                    { model: models.User, as: 'user', include: { model: models.User, as: 'trainers' } }]
                            })
                            if (userExerciseMap.length === 0) {
                                return h.response(`No Exercise Log as such`).code(400)
                            } else {
                                //duration
                                return userExerciseMap
                            }
                        } else {
                            return h.response(`No Exercise Log as such`).code(400)

                        }
                    } else {
                        //exercise_name
                        return userExerciseMap
                    }
                } catch (err) {
                    console.log(err.toString())
                    return h.response(`cannot search log for searchKey: ${err.toString()}`).code(400)
                }

            } else {
                return h.response('no search query').code(400)
            }


        }
    }
}