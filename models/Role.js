const Sequelize = require('sequelize')

module.exports = function(sequelize){

    const Role = sequelize.define( 'Role', {
        title: {
            type: Sequelize.STRING
        }
    },
    {
        underscored: true,
        tableName: "roles"      
    }  
    )

    Role.associate = function (models) {
        Role.hasMany(models.User, {
            as: 'roles',
            foreignKey: {
                name: 'role_id',
                allowNull: false,
            }
        });
    }

    return Role
    
}
