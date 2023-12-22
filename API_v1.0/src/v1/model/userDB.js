const { DEFAULT_LIMIT, DEFAULT_PAGE } = require("../tools/constant");

/**
 * Get one or all users
 *
 * @param {pg.Pool} client the postgres client
 * @param {Number=} id the id of the user
 * @param {String=} username the username of the user (case insensitive and partial match)
 * @param {Number=} page the page number
 * @param {Number=} limit the limit of user per result
 *
 * @throws {Error} if the request fails
 *
 * @returns {Promise<pg.Result>} a promise that contains the result of the query
 */
module.exports.getUser = async (
    client,
    id,
    username,
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
) => {
    let query = `SELECT id, username, email, firstname, lastname, is_admin FROM "user"`;

    const queryConditions = [];
    const queryValues = [];

    if (id !== undefined) {
        queryConditions.push(`id = $${queryValues.length + 1}`);
        queryValues.push(id);
    }
    if (username !== undefined) {
        queryConditions.push(`LOWER(username) LIKE $${queryValues.length + 1}`);
        queryValues.push(`%${username.toLowerCase()}%`);
    }

    if (queryConditions.length > 0) {
        query += ` WHERE ${queryConditions.join(" AND ")}`;
    }
    query += ` ORDER BY id ASC`;

    query += ` LIMIT $${queryValues.length + 1} OFFSET $${
        queryValues.length + 2
    }`;
    queryValues.push(limit);
    queryValues.push((page - 1) * limit);

    return await client.query(query, queryValues);
};

/**
 * Get a user from his email
 *
 * @param {pg.Pool} client the postgres client
 * @param {String} email the email of the user
 *
 * @throws {Error} if the request fails
 *
 * @returns {Promise<pg.Result>} a promise that contains the result of the query
 */
module.exports.getUserFromEmail = async (client, email) => {
    return await client.query(`SELECT * FROM "user" WHERE email = $1`, [email]);
};

/**
 * Get a user from his username
 *
 * @param {pg.Pool} client the postgres client
 * @param {String} username the username of the user
 * 
 * @throws {Error} if the request fails
 *
 * @returns {Promise<pg.Result>} a promise that contains the result of the query
 */
module.exports.getUserFromUsername = async (client, username) => {
    return await client.query(`SELECT * FROM "user" WHERE username = $1`, [
        username,
    ]);
};

/**
 * Create a user
 *
 * @param {pg.Pool} client the postgres client
 * @param {String} username the username of the user
 * @param {String} email the email of the user
 * @param {String} password the password of the user
 * @param {String=} firstname the firstname of the user; default to `null`
 * @param {String=} lastname the lastname of the user; default to `null`
 * @param {Boolean=} isAdmin `true` if the user is an admin, `false` otherwise; default to `false`
 * 
 * @throws {Error} if the request fails
 *
 * @returns {Promise<pg.Result>} a promise that contains the result of the query
 */
module.exports.createUser = async (
    client,
    username,
    email,
    password,
    firstname = null,
    lastname = null,
    isAdmin = false
) => {
    return await client.query(
        `INSERT INTO "user" (username, email, hashed_password ,firstname, lastname, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [username, email, password, firstname, lastname, isAdmin]
    );
};

/**
 * Check if a user exists
 *
 * @param {pg.Pool} client the postgres client
 * @param {Number=} id the id of the user ; if `null`, you need to provide the username or the email
 * @param {String=} username the username of the user, if `null`, you need to provide the id or the email
 * @param {String=} email the email of the user, if `null`, you need to provide the id or the username
 * 
 * @throws {Error} if the request fails
 *
 * @returns {Promise<Boolean>} a promise that contains a boolean; `true` if the user exists, `false` otherwise
 */
module.exports.userExists = async (client, id, username, email) => {
    let query = `SELECT count(*) AS no FROM "user" WHERE `;
    let values = [];
    let index = 1;

    if (!id && !username && !email) {
        return false;
    }

    if (id !== undefined) {
        query += `id = $${index}, `;
        values.push(id);
        index++;
    }
    if (username !== undefined) {
        query += `username = $${index}, `;
        values.push(username);
        index++;
    }
    if (email !== undefined) {
        query += `email = $${index}, `;
        values.push(email);
        index++;
    }

    query = query.slice(0, -2);
    const { rows } = await client.query(query, values);
    return rows[0].no > 0;
};

/**
 * Update a user
 *
 * @param {pg.Pool} client the postgres client
 * @param {Number} userId the id of the user
 * @param {Object} updateValues the values to update
 * @param {String=} updateValues.email the email of the user
 * @param {String=} updateValues.username the username of the user
 * @param {String=} updateValues.firstname the firstname of the user
 * @param {String=} updateValues.lastname the lastname of the user
 * @param {String=} updateValues.password the password of the user
 * @param {Boolean=} updateValues.isAdmin `true` if the user is an admin, `false` otherwise
*
* @throws {Error} if no values to update
 *
 * @returns {Promise<pg.Result>} a promise that contains the result of the query
 */
module.exports.updateUser = async (client, userId, updateValues) => {
    const {
        firstname,
        lastname,
        email,
        username,
        password,
        is_admin: isAdmin,
    } = updateValues;
    let query = `UPDATE "user" SET `;
    let values = [];
    let index = 1;

    if (username !== undefined) {
        query += `username = $${index}, `;
        values.push(username);
        index++;
    }
    if (email !== undefined) {
        query += `email = $${index}, `;
        values.push(email);
        index++;
    }
    if (firstname !== undefined) {
        query += `firstname = $${index}, `;
        values.push(firstname);
        index++;
    }
    if (lastname !== undefined) {
        query += `lastname = $${index}, `;
        values.push(lastname);
        index++;
    }
    if (password !== undefined) {
        query += `hashed_password = $${index}, `;
        values.push(password);
        index++;
    }
    if (isAdmin !== undefined) {
        query += `is_admin = $${index}, `;
        values.push(isAdmin);
        index++;
    }

    if (values.length === 0) {
        throw new Error("No values to update");
    }

    query = query.slice(0, -2);
    query += ` WHERE id = $${index}`;
    values.push(userId);
    return await client.query(query, values);
};

/**
 * Delete a user
 *
 * @param {pg.Pool} client the postgres client
 * @param {Number} userId the id of the user
 * 
 * @throws {Error} if the request fails
 *
 * @returns {Promise<pg.Result>} a promise that contains the result of the query
 */
module.exports.deleteUser = async (client, userId) => {
    return await client.query(`DELETE FROM "user" WHERE id = $1`, [userId]);
};

/**
 * Get all users with an admin role
 *
 * @param {pg.Pool} client the postgres client
 * @param {Number} userId the id of the user
 *
 * @returns {Promise<boolean>} a promise that contains a boolean; `true` if the user is an admin, `false` otherwise
 */
module.exports.isAdmin = async (client, userId) => {
    const { rows } = await client.query(
        `SELECT count(*) AS no FROM "user" WHERE id = $1 AND is_admin = true`,
        [userId]
    );
    return rows[0].no > 0;
};

/**
 * Get the number of users
 *
 * @param {pg.Pool} client the postgres client
 *
 * @returns {Promise<pg.Result>} a promise that contains the result of the query
 */
module.exports.getUserCount = async (client) => {
    return await client.query(`SELECT count(*) AS no FROM "user"`);
};
