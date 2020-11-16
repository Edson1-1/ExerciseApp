'use strict'
const Hapi = require('@hapi/hapi')
require('dotenv').config()


//initializing server
const server = new Hapi.Server({
    host: 'localhost',
    port: process.env.PORT | 8000
})

//starting server
async function start(){
    try{
        await server.route(require("./routes/index.js"))
        await server.start()
        console.log("server started at port 8000")
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}


start()