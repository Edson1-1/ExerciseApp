
const faker = require('faker')
const bcrypt = require('bcrypt')



process.on("message",  message => {

    console.log('in process.on: message', message.numberOfUsers)
    
    const userData =  createUserData(message.numberOfUsers, message.role);
    console.log('before sending to process.on in main process')
    process.send({userData});
    process.exit();
})




function createUserData(numberOfUsers, role) {

    console.log('no: users',numberOfUsers)
    console.log('role',role)

    const populate = (rounds,role ) => {

        let userArr = []
        let sampleUserArr = []
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
            console.log('user array length =>', userArr.length)
        }

        return { userArr, sampleUserArr }

    }


    const userData = populate(numberOfUsers, role)

    const user = userData.userArr
    console.log('user array length =>', user.length)
    const sample = userData.sampleUserArr
    console.log('sample user array length =>', sample.length)


    const set = {}
    const newUser = []
    const newSampleUser = []
    for (let i = 0; i < user.length; i++) {
        if (!(user[i].username in set)) {
            console.log('user at postion added - ', i)
            set[user[i].username] = 1
            newUser.push(user[i])
            newSampleUser.push(sample[i])
        } else {
            console.log('duplicate =>', user[i].username)
        }
    }
    console.log('before returning to process.on in childProcess')
    return { newUser, newSampleUser }


}