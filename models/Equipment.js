const Sequelize = require('sequelize')
const db = require('../db_config/database')

const Equipment = db.define("Equipment", {
    Equipment_name : {
        type: Sequelize.STRING,
    }
},
    {
        freezeTableName: true,
    }
)

module.exports = Equipment