const UserDB = require('./userDB');

module.exports.getUser = async (client, username,email) => {
    // Promise.all is used to run multiple promises in parallel
    // voir cours du prof
    const promiseClientUsername = userDB.getUserByUsername(client, username);
    const promiseClientEmail = userDB.getUserByEmail(client, email);
    const [userUsername, userEmail] = await Promise.all([promiseClientUsername, promiseClientEmail]);
    if (userUsername.rows.length === 0) {
        if (userEmail.rows.length === 0) {
            return ;
        }
        return userEmail.rows[0];
    }
    return userUsername.rows[0];
};

