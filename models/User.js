'use strict'
const Sequelize = require('sequelize')

module.exports = function(sequelize, DataTypes){
	const User = sequelize.define( 'User',{
    username: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    hashedPassword: {
        type: Sequelize.STRING
    },
    trainer_id: {
        type: Sequelize.INTEGER
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
	User.belongsTo(models.Roles, {
		as: 'roles',
		foreignKey: {
			name: 'role_id',
			allowNull: false,
		},
	});
}


return User

};

