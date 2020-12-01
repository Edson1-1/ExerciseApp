'use strict'

const Sequelize = require('sequelize')


module.exports = (sequelize) => {
    const Exercise = sequelize.define('Exercise',{
        exercise_name: {
            type: Sequelize.STRING,
            unique: true
        },
        type_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'exercise_types',
                key: 'id',
            }
        },
        equipment_id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'equipments',
                key: 'id'
            }
        }
    },
    {
        underscored: true,
        tableName: 'exercises',
    }
    )

    Exercise.associate = (models) => {
        Exercise.belongsTo(models.Exercise_Type,{
            as: 'type',
            foreignKey: {
                name: 'type_id',
                allowNull: false
            }
        })

        Exercise.belongsTo(models.Equipment, {
            as: 'equipment',
            foreignKey: {
                name: 'equipment_id',
                allowNull: false
            }
        })

    Exercise.belongsToMany(models.User, {through: 'UserExercise'});

    }

return Exercise

}