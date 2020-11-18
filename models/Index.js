
const Sequelize = require('sequelize')
require('dotenv').config()
const User = require('./User')
const Role = require('./Role')

const models ={}


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_OWNER, process.env.DB_PASSWORD, {
    host: "localhost",
	dialect: "postgres",
})


models.User = User

models.Role = Role


Object.keys(models).forEach((modelName) => {
	// console.log("test" + modelName);
	if ("associate" in models[modelName]) {
		models[modelName].associate(models);
	}
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;
sequelize.sync({ force: true })


// module.exports.sequelize = sequelize;

module.exports = models;
