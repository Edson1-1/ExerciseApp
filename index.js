'use strict'
const Hapi = require('@hapi/hapi')
const models = require('./models')

const hapiCookie = require('@hapi/cookie')
const validate = require('./authentication/auth')
require('dotenv').config()


//initializing server
const server = new Hapi.Server({
    host: 'localhost',
    port: process.env.PORT | 8000
})


//starting database
models.sequelize.authenticate()
    .then( () => {
        console.log()
        console.log(`Connected to database ${process.env.DB_NAME}`)
    })
    .catch(err => console.log("Error occured: " + err))
    
//starting server
async function start(){
    try{
        await server.register(hapiCookie)
        server.auth.strategy('session', 'cookie', {
            cookie: {
                name: 'session',
                password: process.env.COOKIE_PASSWORD,
                isSecure: false
            },
            redirectTo: '/login',
            validateFunc: validate
        })
        server.auth.default('session')
        server.route(require("./routes/index.js"))
        await server.start()
        console.log("server started at port 8000")
        console.log()
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}


start()

