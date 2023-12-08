/**
 * Create a platform
 *
 * @param {pg.Pool} client the postgres client
 * @param {string} code the code of the platform
 * @param {string} description the description of the platform
 * @param {string} abbreviation the abbreviation of the platform
 *
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.createPlatform = async (
    client,
    code,
    description,
    abbreviation
) => {
    return await client.query(
        `INSERT INTO platform (code, description, abbreviation) VALUES ($1, $2, $3)`,
        [code, description, abbreviation]
    );
};

/**
 * Get platforms
 *
 * @param {pg.Pool} client the postgres client
 * @param {string=} code the code of the platform; if `undefined`, all platforms will be returned
 *
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getPlatforms = async (client, code, page, limit) => {
    let query = `SELECT * FROM platform`;
    const values = [];

    if (code !== undefined) {
        values.push(code);
        query += ` WHERE code = $1`;
    }

    query += ` ORDER BY description`;

    if (page !== undefined && limit !== undefined) {
        const offset = (page - 1) * limit;
        query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(limit);
        values.push(offset);
    }

    return await client.query(`${query}`, values);
};

/**
 * Update a platform
 *
 * @param {pg.Pool} client the postgres client
 * @param {string} code the code of the platform to update
 * @param {Object} updateValues the values to update
 * @param {string=} updateValues.code if undefined, the code won't be updated
 * @param {string=} updateValues.description if undefined, the description won't be updated
 * @param {string=} updateValues.abbreviation if undefined, the abbreviation won't be updated
 *
 * @returns {Promise<pg.Result>} the result of the query
 *
 * @throws {Error} if no values to update
 */
module.exports.updatePlatform = async (client, code, updateValues) => {
    const { code: newCode, description, abbreviation } = updateValues;

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
    if (abbreviation !== undefined) {
        query += `abbreviation = $${index}, `;
        values.push(abbreviation);
        index++;
    }

    if (values.length === 0) {
        throw new Error("No values to update");
    }

    query = query.slice(0, -2);
    query += ` WHERE code = $${index}`;
    values.push(code);

    return await client.query(query, values);
};

/**
 * Delete a platform
 *
 * @param {pg.Pool} client the postgres client
 * @param {string} code the code of the platform
 *
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deletePlatform = async (client, code) => {
    return await client.query(`DELETE FROM platform WHERE code = $1`, [code]);
};

/**
 * Check if a platform exists
 *
 * @param {pg.Pool} client the postgres client
 * @param {string} code the code of the platform
 *
 * @returns {Promise<boolean>} `true` if the platform exists, `false` otherwise
 */
module.exports.platformExists = async (client, code) => {
    const { rows } = await client.query(
        `SELECT count(*) AS no FROM platform WHERE code = $1`,
        [code]
    );
    return rows[0].no > 0;
};


/**
 * Get number of platforms
 *
 * @param {pg.Pool} client the postgres client
 *
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getPlatformsCount = async (client) => {
    return await client.query(`SELECT count(*) AS no FROM platform`);
};
