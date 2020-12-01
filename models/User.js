'use strict'

const Sequelize = require('sequelize')

module.exports = function(sequelize){
	const User = sequelize.define( 'User',{
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
    tableName: "users",
}
)

User.associate = function (models) {
	User.belongsTo(models.Role, {
		as: 'roles',
		foreignKey: {
			name: 'role_id',
			allowNull: false,
		},
    })

    User.belongsTo(models.User, {
        onDelete: 'CASCADE',
        as: 'trainers',
        foreignKey: {
            name: 'trainer_id'
        },
    } )
    
    User.belongsToMany(models.Exercise, {through: 'UserExercise'});
}


return User

};

