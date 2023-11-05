const UserDB = require('./userDB');

module.exports.getUser = async (client, username,email) => {;
    let user = await UserDB.getUserByEmail(client, email);
    if (user.rows.length === 0) {
        user = await UserDB.getUserByUsername(client, username);
        if (user.rows.length === 0) {
            return null;
        }
    }
    return user.rows[0];
};

