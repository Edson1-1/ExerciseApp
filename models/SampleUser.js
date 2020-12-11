'use strict'

const Sequelize = require('sequelize')

module.exports = function(sequelize){
	const SampleUser = sequelize.define( 'SampleUser',{
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    hashedPassword: {
        type: Sequelize.STRING
    },
    trainer_id: {
        type: Sequelize.INTEGER,
        references: {
            model: "users",
            key: "id",
    },
},
    role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "roles",
            key: "id",
        },
    }
}, 
{
    underscored: true,
    tableName: "sample_users",
}
)

SampleUser.associate = function (models) {
	SampleUser.belongsTo(models.Role, {
		as: 'roles',
		foreignKey: {
			name: 'role_id',
			allowNull: false,
		},
    })

    SampleUser.belongsTo(models.SampleUser, {
        onDelete: 'CASCADE',
        as: 'trainers',
        foreignKey: {
            name: 'trainer_id'
        },
    } )
    
}


return SampleUser

};

