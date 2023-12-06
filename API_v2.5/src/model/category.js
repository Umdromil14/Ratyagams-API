/**
 * Creates a category
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} genreId the id of the genre
 * @param {number} videoGameId the id of the video game
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.createCategory = async (client, genreId, videoGameId) => {
    return await client.query(`INSERT INTO category (genre_id, video_game_id) VALUES ($1, $2)`, [genreId, videoGameId]);
}

/**
 * Get all categories
 * 
 * @param {pg.Pool} client the postgres client
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getAllCategories = async (client) => {
    return await client.query(`SELECT * FROM category`);
}

/**
 * Get a category
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} genreId the id of the genre
 * @param {number} videoGameId the id of the video game
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getCategory = async (client, genreId, videoGameId) => {
    return await client.query(`SELECT * FROM category WHERE genre_id = $1 AND video_game_id = $2`, [genreId, videoGameId]);
}

/**
 * Get all categories from a genre
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} genreId the id of the genre
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getCategoriesFromGenre = async (client, genreId) => {
    return await client.query(`SELECT * FROM category WHERE genre_id = $1`, [genreId]);
}

/**
 * Get all categories from a video game
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} videoGameId the id of the video game
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getCategoriesFromVideoGame = async (client, videoGameId) => {
    return await client.query(`SELECT * FROM category WHERE video_game_id = $1`, [videoGameId]);
}

/**
 * Update a category
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} genreId the id of the genre
 * @param {number} videoGameId the id of the video game
 * @param {Object} updateValues the values to update
 * @param {number=} updateValues.genre_id if undefined, the genre id won't be updated
 * @param {number=} updateValues.video_game_id if undefined, the video game id won't be updated
 * 
 * @returns {Promise<pg.Result>} the result of the query
 * 
 * @throws {Error} if no values to update
 */
module.exports.updateCategory = async (client, genreId, videoGameId, updateValues) => {
    const {
        genre_id: newGenreId,
        video_game_id: newVideoGameId
    } = updateValues;

    let query = `UPDATE category SET `;
    let values = [];
    let index = 1;
    
    if (newGenreId !== undefined) {
        query += `genre_id = $${index}, `;
        values.push(newGenreId);
        index++;
    }
    if (newVideoGameId !== undefined) {
        query += `video_game_id = $${index}, `;
        values.push(newVideoGameId);
        index++;
    }

    if (values.length === 0) {
        throw new Error("No values to update");
    }

    query = query.slice(0, -2);
    query += ` WHERE genre_id = $${index} AND video_game_id = $${index + 1}`;
    values.push(genreId);
    values.push(videoGameId)

    return await client.query(query, values);
}

/**
 * Delete a category
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} genreId the id of the genre
 * @param {number} videoGameId the id of the video game
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deleteCategory = async (client, genreId, videoGameId) => {
    return await client.query(`DELETE FROM category WHERE genre_id = $1 AND video_game_id = $2`, [genreId, videoGameId]);
}

/**
 * Delete all categories from a genre
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} genreId the id of the genre
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deleteCategoriesFromGenre = async (client, genreId) => {
    return await client.query(`DELETE FROM category WHERE genre_id = $1`, [genreId]);
}

/**
 * Delete all categories from a video game
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} videoGameId the id of the video game
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deleteCategoriesFromVideoGame = async (client, videoGameId) => {
    return await client.query(`DELETE FROM category WHERE video_game_id = $1`, [videoGameId]);
}

/**
 * Check if a category exists by its video game id and its genre id
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} videoGameId the video game id
 * @param {number} genreId the genre id
 * 
 * @returns {Promise<boolean>} `true` if the category exists, `flase` otherwise
 */
module.exports.categoryExists = async (client, videoGameId, genreId) => {
    const {rows} = await client.query(`SELECT genre_id FROM category WHERE video_game_id = $1 AND genre_id = $2`, 
        [videoGameId, genreId]); 
    return rows.length > 0;
}

/**
 * Get categories with pagination delimited by a limit and a page
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} page the page
 * @param {number} limit the number of categories per page
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */

module.exports.getCategoriesWithPagination = async (client, page, limit) => {
    const offset = (page - 1) * limit;
    return await client.query(`SELECT * FROM category LIMIT $1 OFFSET $2`, [limit, offset]);
}