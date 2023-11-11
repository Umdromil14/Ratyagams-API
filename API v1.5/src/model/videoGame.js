/**
 * Get a video game by id
 * @param {pg.Pool} client the postgres client
 * @param {number} id the id of the video game
 * 
 * @returns {Promise<pg.QueryResult>} the result of the query
 */
module.exports.getVideoGame = async (client, id) => {
    return await client.query(
        `SELECT * FROM video_game WHERE id = $1`,
        [id]
    );
}

/**
 * Get all the video games
 * 
 * @param {pg.Pool} client the postgres client
 * 
 * @returns {Promise<pg.QueryResult>} the result of the query
 */

module.exports.getVideoGames = async (client) => {
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
 * @returns {Promise<pg.QueryResult>} the result of the query
 */
module.exports.createVideoGame = async (client, name, description) => {
    await client.query(
        `INSERT INTO video_game (name, description) VALUES ($1, $2)`,
        [name, description]
    );
}

/**
 * Check if a video game exists
 * 
 * @param {pg.Pool} client the postgres client
 * @param {string} name the name of the video game
 * 
 * @returns {Promise<boolean>} true if the video game exists, false otherwise
 */
module.exports.videoGameExists = async (client, name) => {
    const {rows} = await client.query(
        `SELECT COUNT(*) AS no FROM video_game WHERE name = $1`,
        [name]
    );
    return rows[0].no > 0;
}

/**
 * Check if a video game exists by id
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} id the id of the video game
 * 
 * @returns {Promise<boolean>} true if the video game exists, false otherwise
 */
module.exports.videoGameExistsById = async (client, id) => {
    const {rows} = await client.query(`SELECT id FROM video_game WHERE id = $1`, [id]);
    return rows.length === 1;
}

/**
 * Update a video game
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} id the id of the video game
 * @param {string} name the name of the video game
 * @param {string} description the description of the video game
 * 
 * @returns {Promise<pg.QueryResult>} the result of the query
 */
module.exports.updateVideoGame = async (client,id, videoGame) => {
    const {name , description} = videoGame;
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
 * @returns {Promise<pg.QueryResult>} the result of the query
 */
module.exports.deleteVideoGame = async (client, id) => {
    await client.query(
        `DELETE FROM video_game WHERE id = $1`,
        [id]
    );
};