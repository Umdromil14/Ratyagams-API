const UserDB = require('./userDB');

module.exports.getUser = async (client, username,email) => {
    const promiseClientUsername = UserDB.getUserFromUsername(client, username);
    const promiseClientEmail = UserDB.getUserFromEmail(client, email);
    const [userUsername, userEmail] = await Promise.all([promiseClientUsername, promiseClientEmail]);
    if (userUsername.rows.length === 0) {
        if (userEmail.rows.length === 0) {
            return ;
        }
        return userEmail.rows[0];
    }
    return userUsername.rows[0];
};

