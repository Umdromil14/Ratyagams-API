const UserDB = require('./userDB');


/**
 * Get the user with the given username or/and email
 * 
 * @param {pg.Pool} client the postgres client
 * @param {String=} username the username of the user; if `undefined`, you need to provide the email
 * @param {String=} email the email of the user; if `undefined` , you need to provide the username
 *  
 * @returns {Promise<Pg.Result>=} if the user doesn't exist, returns `undefined`. If the user exists, returns the user
 */
module.exports.getUser = async (client, username, email) => {
    const promiseClientUsername = UserDB.getUserFromUsername(client, username);
    const promiseClientEmail = UserDB.getUserFromEmail(client, email);
    const [userUsername, userEmail] = await Promise.all([promiseClientUsername, promiseClientEmail]);
    if (userUsername.rows.length === 0) {
        if (userEmail.rows.length === 0) {
            return;
        }
        return userEmail.rows[0];
    }
    return userUsername.rows[0];
};

