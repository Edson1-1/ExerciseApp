
const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_OWNER, process.env.DB_PASSWORD, {
	host: "localhost",
	dialect: "postgres",
	logging: false
});

const User = sequelize.import('./User')
const Role = sequelize.import('./Role')
const Exercise = sequelize.import('./Exercise')
const Equipment = sequelize.import('./Equipment')
const Exercise_Type = sequelize.import('./Exercise_Type')
const UserExercise = sequelize.import('./User_Exercise_map')
const SampleUser = sequelize.import('./SampleUser')


const models = {
	User,
	Role,
	Exercise,
	Equipment,
	Exercise_Type,
	UserExercise,
	SampleUser
}

Object.keys(models).forEach((modelName) => {
	// console.log("test" + modelName);
	if ("associate" in models[modelName]) {
		models[modelName].associate(models);
	}
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;
sequelize.sync()


// module.exports.sequelize = sequelize;

module.exports = models;
