'use strict'

const Sequelize = require('sequelize')

module.exports = (sequelize) => {

    const Equipment = sequelize.define("Equipment", {
        equipment_name : {
            type: Sequelize.STRING,
            unique: true
        }
    },
    {
        underscored: true,
        tableName: 'equipments'
    }
    )

    Equipment.associate = (models) => {
        Equipment.hasMany(models.Exercise, {
            as: 'equipments',
            foreignKey: {
                name: "equipment_id",
                allowNull: false,
            }
        });
    }
    
return Equipment

}