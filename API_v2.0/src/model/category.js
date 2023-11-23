/**
 * Creates a category
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} typeId the id of the type
 * @param {number} videoGameId the id of the video game
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.createCategory = async (client, typeId, videoGameId) => {
    return await client.query(`INSERT INTO category (type_id, video_game_id) VALUES ($1, $2)`, [typeId, videoGameId]);
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
 * @param {number} typeId the id of the type
 * @param {number} videoGameId the id of the video game
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getCategory = async (client, typeId, videoGameId) => {
    return await client.query(`SELECT * FROM category WHERE type_id = $1 AND video_game_id = $2`, [typeId, videoGameId]);
}

/**
 * Get all categories from a type
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} typeId the id of the type
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getCategoriesFromType = async (client, typeId) => {
    return await client.query(`SELECT * FROM category WHERE type_id = $1`, [typeId]);
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
 * @param {number} typeId the id of the type
 * @param {number} videoGameId the id of the video game
 * @param {Object} updateValues the values to update
 * @param {number=} updateValues.type_id if undefined, the type id won't be updated
 * @param {number=} updateValues.video_game_id if undefined, the video game id won't be updated
 * 
 * @returns {Promise<pg.Result>} the result of the query
 * 
 * @throws {Error} if no values to update
 */
module.exports.updateCategory = async (client, typeId, videoGameId, updateValues) => {
    const {
        type_id: newTypeId,
        video_game_id: newVideoGameId
    } = updateValues;

    let query = `UPDATE category SET `;
    let values = [];
    let index = 1;
    
    if (newTypeId !== undefined) {
        query += `type_id = $${index}, `;
        values.push(newTypeId);
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
    query += ` WHERE type_id = $${index} AND video_game_id = $${index + 1}`;
    values.push(typeId);
    values.push(videoGameId)

    return await client.query(query, values);
}

/**
 * Delete a category
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} typeId the id of the type
 * @param {number} videoGameId the id of the video game
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deleteCategory = async (client, typeId, videoGameId) => {
    return await client.query(`DELETE FROM category WHERE type_id = $1 AND video_game_id = $2`, [typeId, videoGameId]);
}

/**
 * Delete all categories from a type
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} typeId the id of the type
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deleteCategoriesFromType = async (client, typeId) => {
    return await client.query(`DELETE FROM category WHERE type_id = $1`, [typeId]);
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
 * Check if a category exists by its video game id and its type id
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} videoGameId the video game id
 * @param {number} typeId the type id
 * 
 * @returns {Promise<boolean>} `true` if the category exists, `flase` otherwise
 */
module.exports.categoryExists = async (client, videoGameId, typeId) => {
    const {rows} = await client.query(`SELECT type_id FROM category WHERE video_game_id = $1 AND type_id = $2`, 
        [videoGameId, typeId]); 
    return rows.length > 0;
}