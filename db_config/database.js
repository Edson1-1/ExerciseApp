const {Sequelize} = require('sequelize')
require('dotenv').config()


module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_OWNER, process.env.DB_PASSWORD, {
    host: "localhost",
    dialect: "postgres"
})