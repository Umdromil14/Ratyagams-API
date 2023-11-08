/**
 * Create a platform
 * @param {Client} client the postgres client
 * @param {string} code the code of the platform
 * @param {string} description the description of the platform
 * @returns {Promise<QueryResult<any>>} the result of the query
 */
module.exports.createPlatform = async (client, code, description) => {
    return await client.query(
        `INSERT INTO platform (code, description) VALUES ($1, $2)`,
        [code, description]
    );
}

/**
 * Get a platform
 * @param {Client} client the postgres client
 * @param {string} code the code of the platform
 * @returns {Promise<QueryResult<any>>} the result of the query 
 */
module.exports.getPlatform = async (client, code) => {
    return await client.query(
        `SELECT * FROM platform WHERE code = $1`,
        [code]
    );
}

/**
 * Get all platforms
 * @param {Client} client the postgres client
 * @returns {Promise<QueryResult<any>>} the result of the query
 */
module.exports.getAllPlatforms = async (client) => {
    return await client.query(
        `SELECT * FROM platform`
    );
}

/**
 * Update a platform
 * @param {Client} client the postgres client
 * @param {string} code the code of the platform to update
 * @param {string=} newCode if undefined, the code won't be updated
 * @param {string=} description if undefined, the description won't be updated
 * @returns {Promise<QueryResult<any>>} the result of the query
 */
module.exports.updatePlatform = async (client, code, newCode, description) => {
    let query = `UPDATE platform SET `;
    let values = [];
    let index = 1;

    if (newCode !== undefined) {
        query += `code = $${index}, `;
        values.push(newCode);
        index++;
    }
    if (description !== undefined) {
        query += `description = $${index}, `;
        values.push(description);
        index++;
    }

    query = query.slice(0, -2);
    query += ` WHERE code = $${index}`;
    values.push(code);

    return await client.query(query, values);
}

/**
 * Delete a platform
 * @param {Client} client the postgres client
 * @param {string} code the code of the platform
 * @returns {Promise<QueryResult<any>>} the result of the query
 */
module.exports.deletePlatform = async (client, code) => {
    return await client.query(
        `DELETE FROM platform WHERE code = $1`,
        [code]
    );
}

/**
 * Check if a platform exists
 * @param {Client} client the postgres client
 * @param {string} code the code of the platform
 * @returns {Promise<boolean>} true if the platform exists, false otherwise
 */
module.exports.platformExists = async (client, code) => {
    const { rows } = await client.query(
        `SELECT count(*) AS no FROM platform WHERE code = $1`,
        [code]
    );
    return rows[0].no > 0;
}