
const faker = require('faker')
const models = require('../../models')
const bcrypt = require('bcrypt')

const { fork } = require('child_process')


module.exports = {
    // not used. 
    addRandomUserDataToSampleUserTable: async (request, h) => {

        const createUserData = async (ieterations) => {
            let userArr = []
            let sampleUserArr = []
            const role = await models.Role.findOne({ where: { title: 'customer' } })
            if (!role) {
                return "error"
            }
            for (i = 1; i <= ieterations; i++) {
                let username = faker.internet.userName().toLowerCase()
                let password = faker.internet.password()
                let hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT));
                let email = faker.internet.email()
                let role_id = role.id

                const userObj = {
                    username, hashedPassword, email, role_id
                }
                const sampleUserObj = {
                    username, hashedPassword: password, email, role_id
                }
                userArr.push(userObj)
                sampleUserArr.push(sampleUserObj)
                if (i % 10 === 0) { //batch update each 10 items
                    try {
                        console.log('i in each interval of 10 - ', i)
                        await models.User.bulkCreate(userArr)
                        await models.SampleUser.bulkCreate(sampleUserArr)
                        userArr = []
                        sampleUserArr = []
                    } catch (err) { // if duplicate is found remove that item
                        console.log(err.message)
                        console.log(err.errors)
                        if (err.message === 'Validation error') {
                            for (let k = 0; k < err.errors.length; k++) {
                                let errorItem = err.errors[k].path
                                console.log(errorItem)
                                let errorItemValue = err.errors[k].value
                                console.log(errorItemValue)
                                for (let j = 0; j < userArr.length; j++) {
                                    if (userArr[j][errorItem] === errorItemValue) {
                                        userArr.splice(j, 1)
                                        sampleUserArr.splice(j, 1)
                                    }
                                }
                            }
                            try { //after removing duplicate item add to DB
                                console.log('i in catch block interval of 10. removed dupilcate and going to insert data into DB - ', i)
                                await models.User.bulkCreate(userArr)
                                await models.SampleUser.bulkCreate(sampleUserArr)
                                console.log('inserted into DB without duplicate')
                                userArr = []
                                sampleUserArr = []
                            } catch (err) {
                                console.log(err.message)

                            }

                        }
                    }
                }

                if (i == ieterations & userArr.length !== 0) { //if last ieteration and data has to be inserted
                    try {
                        console.log('i when i===ieterations - ', i)
                        await models.User.bulkCreate(userArr)
                        await models.SampleUser.bulkCreate(sampleUserArr)
                        userArr = []
                        sampleUserArr = []
                    } catch (err) { // handling duplicates ---
                        console.log(err.message)
                        console.log(err.errors[0])
                        if (err.message === 'Validation error') {
                            for (let k = 0; k < err.errors.length; k++) {
                                let errorItem = err.errors[k].path
                                let errorItemValue = err.errors[k].errorItemValue
                                for (let j = 0; j < userArr.length; j++) {
                                    if (userArr[j][errorItem] === errorItemValue) {
                                        userArr.splice(j, 1)
                                        sampleUserArr.splice(j, 1)
                                    }
                                }
                            }
                            console.log('i when i===ieterations and inside catch - ', i)
                            try { //add to DB after removing duplicate
                                await models.User.bulkCreate(userArr)
                                await models.SampleUser.bulkCreate(sampleUserArr)
                                userArr = []
                                sampleUserArr = []
                            } catch (err) {
                                console.log(err.message)
                            }

                        }
                    }
                }


            }

            const count = await models.SampleUser.count()
            return `succesfully added ${count} users`

        }


        const rounds = request.query.rounds
        if (rounds <= 0) {
            return h.response('number of rounds should be atleast 1').code(400)
        }
        const populateUserData = await createUserData(rounds)
        if (populateUserData === 'error') {
            return h.response('Role not found').code(400)
        }

        return populateUserData

    },
    // deletes fake users' from User table and SampleUser table
    // test/api/destroyfakeuser
    destroyFakeUsers: async (request, h) => {

        try {
            const fakeUsers = await models.SampleUser.findAll()
            const fakeUserNames = fakeUsers.map(user => user.username)
            const deletedUsers = await models.User.destroy({ where: { username: fakeUserNames } })
            const deletedSampleUser = await models.SampleUser.destroy({ where: { username: fakeUserNames } })
            return [deletedUsers, deletedSampleUser]
        } catch (err) {
            console.log(err.toString())
            return h.response(err.toString()).code(400)
        }
    },

    //log exercise
    //blocking - 1million logs ( i.e, number of fake users is 1000 and logged exercise per user is 1000) - 6mins 18sec
    // test/api/fakelogexercise?logCount=${number of exercises per user}
    logExerciseForFakeUsers: async (request, h) => {

        // creates a given number of exercise logs 
        const logExercisefn = async (user, rounds) => {
            let logArr = []
            let user_id = user.id
            for (let i = 0; i < rounds; i++) {
                try {
                    let exercise_id = await models.Exercise.findOne({ order: models.sequelize.random(), attributes: ['id'] })
                    let date = faker.date.between('2019-01-01', '2021-12-31').toISOString().substring(0, 10)
                    let duration = Math.floor(Math.random() * (100 - 10 + 1) + 10)
                    const logObj = { user_id, exercise_id: exercise_id.id, date, duration }
                    logArr.push(logObj)
                } catch (err) {
                    console.log(err.toString())
                    return err.toString()
                }
            }

            return logArr
        }

        //---------------
        //start 
        const logCount = request.query.logCount

        try { 
            const fakeUsers = await models.SampleUser.findAll().map(user => user.username)
            const users = await models.User.findAll({ where: { username: fakeUsers } })
            for (let i = 0; i < users.length; i++) { // loop through all users
                let user = users[i]
                let logged = await logExercisefn(user, logCount) //create given number of exercise logs
                let jobArray = []
                for (let k = 0; k < logged.length; k++) { //add log to UserExercise map table
                    if (jobArray.length < 100) {    // add 100 exercises to db at a time
                        jobArray.push(logged[k])
                    } else {
                        jobArray.push(logged[k])
                        await models.UserExercise.bulkCreate(jobArray)
                        console.log(`added ${jobArray.length} exercise logs`)
                        console.log('user no: ', i)
                        jobArray = []
                    }

                    if (k === logged.length - 1 && jobArray.length !== 0) { // if jobArray has anything left at the end of the loop
                        await models.UserExercise.bulkCreate(jobArray)
                        console.log(`added last exercise logs- ${jobArray.length}`)
                        console.log('user no: ', i)
                        jobArray = []
                    }
                }
                if (i === users.length - 1) { //when done
                    console.log("done")
                    console.log(logged.length)
                }
            }

            const mapCount = await models.UserExercise.count() // number of items in UserExercise table
            return `Exercise logging complete. Count is = ${mapCount}`


        } catch (err) {
            console.log(err.toString())
            return h.response(err.toString()).code(400)
        }
    },

    // deletes all items in UserExericse map table
    // test/api/destroylogexercise
    destroyFakeExerciseLogs: async (request, h) => {

        try {


            // const fakeUsers = await models.SampleUser.findAll().map(user => user.username)
            // const users = await models.User.findAll({ where: { username: fakeUsers } })
            // const users_id = users.map(user => user.id)
            // const deletedLog = await models.UserExercise.destroy({ where: { user_id: users_id } })


            const deletedLog = await models.UserExercise.destroy({where: {}})

            return deletedLog

        } catch (err) {
            console.log(err.toString())
            return h.response(err.toString()).code(400)
        }
    },


    // test/api/populateusers?rounds=${number of fake users' to be created}
    // create fake user data
    //blocking - creating 1000 users takes around 1.04 minutes
    populateUserTable: async (request, h) => {

        const populate = async (rounds) => { //create given number of fake user data

            let userArr = []
            let sampleUserArr = []
            const role = await models.Role.findOne({ where: { title: 'customer' } })
            if (!role) {
                return "error"
            }
            for (let i = 1; i <= rounds; i++) {
                console.log('user : ', i)
                let username = faker.internet.userName().toLowerCase()
                let password = faker.internet.password()
                let hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT));
                let email = `${username}@email.com`
                let role_id = role.id

                const userObj = {
                    username, hashedPassword, email, role_id
                }
                const sampleUserObj = {
                    username, hashedPassword: password, email, role_id
                }
                userArr.push(userObj)
                sampleUserArr.push(sampleUserObj)
            }

            return { userArr, sampleUserArr }

        }
        //-------------

        //start

        const rounds = request.query.rounds

        const userData = await populate(rounds)

        const user = userData.userArr
        console.log('user array length =>', user.length)
        const sample = userData.sampleUserArr
        console.log('sample user array length =>', sample.length)

        const set = {}
        const newUser = []
        const newSampleUser = []
        for (let i = 0; i < user.length; i++) { //to remove duplicate data.  
            if (!(user[i].username in set)) {
                console.log('user at postion added - ', i)
                set[user[i].username] = 1
                newUser.push(user[i])
                newSampleUser.push(sample[i])
            } else {
                console.log('duplicate =>', user[i].username)
            }
        }
        let jobArrayUser = []
        let jobArraySample = []
        for (i = 0; i < newUser.length; i++) {
            try {
                if (jobArrayUser.length === 100) { // add 100 items to db at a time
                    console.log(`add 100 users to db, i = ${i}`)
                    //add to db
                    jobArraySample.push(newSampleUser[i])
                    jobArrayUser.push(newUser[i])
                    await models.User.bulkCreate(jobArrayUser)
                    await models.SampleUser.bulkCreate(jobArraySample)
                    jobArrayUser = []
                    jobArraySample = []
                } else {
                    jobArraySample.push(newSampleUser[i])
                    jobArrayUser.push(newUser[i])
                }

                if (i === newUser.length - 1 && jobArrayUser.length !== 0) { //if loop is at the end and jobArray not empty
                    console.log(`add last set of users to db - ${i}`)
                    //add to db
                    await models.User.bulkCreate(jobArrayUser)
                    await models.SampleUser.bulkCreate(jobArraySample)
                    jobArrayUser = []
                    jobArraySample = []
                }
            } catch (err) {
                console.log(err.message)
                console.log(err.errors)
                if (err.message === 'Validation error') { // if a user with same username exists, remove it from jobArray
                    for (let k = 0; k < err.errors.length; k++) {
                        let errorItem = err.errors[k].path
                        console.log(errorItem)
                        let errorItemValue = err.errors[k].value
                        console.log(errorItemValue)
                        for (let j = 0; j < jobArrayUser.length; j++) {
                            if (jobArrayUser[j][errorItem] === errorItemValue) {
                                jobArrayUser.splice(j, 1)  //removeing the duplicate
                                jobArraySample.splice(j, 1)
                            }
                        }
                    }
                    try { //after removing duplicate item add to DB
                        console.log('inside catch  - ', i)
                        await models.User.bulkCreate(jobArrayUser)
                        await models.SampleUser.bulkCreate(jobArraySample)
                        console.log('inserted into DB without duplicate')
                        jobArrayUser = []
                        jobArraySample = []
                    } catch (err) {
                        console.log(err.toString())
                        console.log(err.message)
                    }
                }
            }
        }

        const fakeUserCount = await models.SampleUser.count()
        return `fakeUserCount = ${fakeUserCount}`
    },














    //using fork - not working
    createUsersParallel: async (request, h) => {

        const role = await models.Role.findOne({ where: { title: 'customer' } })
        const numberOfUsers = request.query.rounds

        const childProcess = fork('./controllers/test/populateUserfn.js')
        console.log(numberOfUsers)
        console.log(role.id)
        childProcess.send({ "numberOfUsers": parseInt(numberOfUsers), "role": role })
        childProcess.on("message", message => {
            console.log('in main process')
            console.log('message in main process:', message)
        })

        // return "finish"
        // let jobArrayUser = []
        // let jobArraySample = []
        // for (i = 0; i < newUser.length; i++) {
        //     try {
        //         if (jobArrayUser.length === 100) {
        //             console.log(`add 100 users to db, i = ${i}`)
        //             //add to db
        //             jobArraySample.push(newSampleUser[i])
        //             jobArrayUser.push(newUser[i])
        //             await models.User.bulkCreate(jobArrayUser)
        //             await models.SampleUser.bulkCreate(jobArraySample)
        //             jobArrayUser = []
        //             jobArraySample = []
        //         } else {
        //             jobArraySample.push(newSampleUser[i])
        //             jobArrayUser.push(newUser[i])
        //         }

        //         if (i === newUser.length - 1 && jobArrayUser.length !== 0) {
        //             console.log(`add last set of users to db - ${i}`)
        //             //add to db
        //             await models.User.bulkCreate(jobArrayUser)
        //             await models.SampleUser.bulkCreate(jobArraySample)
        //             jobArrayUser = []
        //             jobArraySample = []
        //         }
        //     } catch (err) {
        //         console.log(err.message)
        //         console.log(err.errors)
        //         if (err.message === 'Validation error') {
        //             for (let k = 0; k < err.errors.length; k++) {
        //                 let errorItem = err.errors[k].path
        //                 console.log(errorItem)
        //                 let errorItemValue = err.errors[k].value
        //                 console.log(errorItemValue)
        //                 for (let j = 0; j < jobArrayUser.length; j++) {
        //                     if (jobArrayUser[j][errorItem] === errorItemValue) {
        //                         jobArrayUser.splice(j, 1)
        //                         jobArraySample.splice(j, 1)
        //                     }
        //                 }
        //             }
        //             try { //after removing duplicate item add to DB
        //                 console.log('inside catch  - ', i)
        //                 await models.User.bulkCreate(jobArrayUser)
        //                 await models.SampleUser.bulkCreate(jobArraySample)
        //                 console.log('inserted into DB without duplicate')
        //                 jobArrayUser = []
        //                 jobArraySample = []
        //             } catch (err) {
        //                 console.log(err.toString())
        //                 console.log(err.message)
        //             }
        //         }
        //     }
        // }

        // const fakeUserCount = await models.SampleUser.count()
        // return `fakeUserCount = ${fakeUserCount}`

    },
}