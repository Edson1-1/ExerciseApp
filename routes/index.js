const exercise = require('./adminRoutes/exercise')
const equipment = require('./adminRoutes/equipment')
const user = require('./adminRoutes/user')
const customer = require('./customer')
const search = require('./search')
const roles = require('./adminRoutes/role')
const populateUser = require('./testRoutes/populateUsers')

module.exports = [].concat(exercise,equipment,user,customer,search,roles, populateUser)