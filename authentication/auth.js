

const models = require('../models');


// auth login
module.exports = async (request, session) => {
    console.log("auth session id", session.id)
    console.log("----------")
    const account = await models.User.findByPk(session.id)


    if (!account) {
        console.log("auth false")
        console.log("----------")

        return { valid: false };
    }
    console.log("auth true")
    console.log("----------")

    return { valid: true, credentials: account };
}