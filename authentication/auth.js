
const users = [{
    id: 1,
    name: 'Jon Doe',
    hashedPassword:"$2b$10$JaHWv.NSN8ctdYWaJdAxHuPkmjklO6g3zfT7J4AdTi.sRRg9dArUK",
    email: 'ssss@email.com',
    role_id: 1
    }]

module.exports = async (request, session) => {
    const account = await users.find(
        (user) => (user.id === session.id)
    );

    if (!account) {

        return { valid: false };
    }

    return { valid: true, credentials: account };
}