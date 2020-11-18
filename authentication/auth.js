
// const {User} = require('../models/Index');
const User = require('../models/User');


//customer login
module.exports = async (request, session) => {
    console.log("auth session id", session.id)
    const account = await User.findByPk(session.id)


    if (!account) {
        console.log("auth false")
        console.log("----------")

        return { valid: false };
    }
    console.log("auth true")
    console.log("----------")

    return { valid: true, credentials: account };
}