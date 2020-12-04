
const models = require('../models');


module.exports = async (artifacts, request, h) => {
    console.log("jwt auth")
    console.log("artifacts.decoded = ",artifacts.decoded)
    const id = artifacts.decoded.payload.id
    const account = await models.User.findByPk(id)
    if(!account){
        console.log(" jwt auth false")
        console.log("----------")
        return { isValid: false };

    }
    console.log("jwt auth true")
    console.log("----------")

    return { isValid: true, credentials: account };
}