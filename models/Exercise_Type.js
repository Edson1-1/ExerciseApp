'use strict'

const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const Exercise_Type = sequelize.define('Exercise_Type', {
        exercise_type: {
            type: Sequelize.STRING
        }
    }, 
        {
            underscored: true,
            tableName: 'exercise_types'
        }
    )


    Exercise_Type.associate = (models) => {
        Exercise_Type.hasMany(models.Exercise,{
            as: 'type',
            foreignKey: {
                name: 'type_id',
                allowedNul: false
            }
        })
    }

    return Exercise_Type
}