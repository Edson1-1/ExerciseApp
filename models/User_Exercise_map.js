'use strict'


const Sequelize = require('sequelize')

module.exports = (sequelize) => {
    const UserExercise = sequelize.define('UserExercise', {
        date: {
            type: Sequelize.DATE,
            defaultValue: new Date(),
        },
        duration:{
            type: Sequelize.INTEGER,
        },
        // end_time:{
        //     type: Sequelize.DATE,
        //     defaultValue: new Date()
        // }
    },
    {
        underscored : true,
        tableName: 'user_exercises_map'
    }
    )

    UserExercise.associate = function (models) {
        UserExercise.belongsTo(models.User, {
            as: 'user',
            foreignKey: {
                name: 'user_id',
            },
        })
        UserExercise.belongsTo(models.Exercise, {
            as: 'exercises',
            foreignKey: {
                name: 'exercise_id',
            },
        })
        

    }

    return UserExercise
}