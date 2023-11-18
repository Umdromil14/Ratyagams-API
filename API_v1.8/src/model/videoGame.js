/**
 * Get a video game by id
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} id the id of the video game
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getVideoGame = async (client, id) => {
    return await client.query(
        `SELECT * FROM video_game WHERE id = $1`,
        [id]
    );
}

/**
 * Get video games that contains the name
 * 
 * @param {pg.Pool} client the postgres client
 * @param {string} name the name of the video game (case insensitive and partial)
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getVideoGamesByName = async (client, name) => {
    return await client.query(
        `SELECT * FROM video_game WHERE LOWER(name) LIKE $1`,
        [`%${name.toLowerCase()}%`]
    );

}

/**
 * Get all the video games
 * 
 * @param {pg.Pool} client the postgres client
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */

module.exports.getAllVideoGames = async (client) => {
    return await client.query(
        `SELECT * FROM video_game`
    );
}
/**
 * Create a video game
 * 
 * @param {pg.Pool} client the postgres client
 * @param {string} name the name of the video game
 * @param {string} description the description of the video game
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.createVideoGame = async (client, name, description) => {
    return await client.query(
        `INSERT INTO video_game (name, description) VALUES ($1, $2) RETURNING id`,
        [name, description]
    );
}

/**
 * Check if a video game exists by id
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} id the id of the video game
 * 
 * @returns {Promise<boolean>} true if the video game exists, false otherwise
 */
module.exports.videoGameExists = async (client, id) => {
    const { rows } = await client.query(`SELECT id FROM video_game WHERE id = $1`, [id]);
    return rows.length === 1;
}

/**
 * Update a video game
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} id the id of the video game
 * @param {object} updateValues the video game object
 * @param {string=} updateValues.name the name of the video game
 * @param {string=} updateValues.description the description of the video game
 * 
 * @returns {Promise<pg.Result>} the result of the query
 * 
 * @throws {Error} if no values to update
 */
module.exports.updateVideoGame = async (client, id, updateValues) => {
    const { name, description } = updateValues;
    let query = `UPDATE video_game SET `;
    let params = [];
    let index = 1;
    if (name !== undefined) {
        query += `name = $${index}, `;
        params.push(name);
        index++;
    }
    if (description !== undefined) {
        query += `description = $${index}, `;
        params.push(description);
        index++;
    }

    if (params.length === 0) {
        throw new Error("No values to update");
    }

    query = query.slice(0, -2);
    query += ` WHERE id = $${index}`;
    params.push(id);
    return await client.query(query, params);
}

/**
 * Delete a video game
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} id the id of the video game
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deleteVideoGame = async (client, id) => {
    return await client.query(
        `DELETE FROM video_game WHERE id = $1`,
        [id]
    );
};