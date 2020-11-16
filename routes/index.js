const exercise = require('./adminRoutes/exercise')
const equipment = require('./adminRoutes/equipment')
const user = require('./adminRoutes/user')

module.exports = [].concat(exercise,equipment,user)