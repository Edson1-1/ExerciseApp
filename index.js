'use strict'
const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const models = require('./models')

const hapiCookie = require('@hapi/cookie')
const validate = require('./authentication/auth')
const JWTvalidate = require('./authentication/JWTvalidate')
require('dotenv').config()


//initializing server
const server = new Hapi.Server({
    'host': 'localhost',
    'port': process.env.PORT | 8000,
    'routes':{
        'cors': true
    }
})


//starting database
models.sequelize.authenticate()
    .then( () => {
        console.log(`Connected to database ${process.env.DB_NAME}`)
    })
    .catch(err => console.log("Error occured: " + err))
    
//starting server
async function start(){
    try{
        await server.register(hapiCookie)
        await server.register(Jwt);
        server.auth.strategy('my_jwt_stategy', 'jwt', {
            keys: process.env.JWTSECRET,
            verify: {
                aud: false,
                iss: false,
                sub: false,
                nbf: true,
                exp: true,
                maxAgeSec:0,
                timeSkewSec: 0
            },
            validate: JWTvalidate
        });
        server.auth.strategy('session', 'cookie', {
            cookie: {
                name: 'session',
                password: process.env.COOKIE_PASSWORD,
                isSecure: false,
            },
            redirectTo: '/login',
            validateFunc: validate
        })

        server.auth.default('my_jwt_stategy') //JWT auth strategy

        server.route(require("./routes/index.js")) //routing file

        await server.start() // starting server
        console.log("server started at port 8000")
    }catch(err){
        console.log(err.toString())
        process.exit(1)
    }
}


start() // start server

