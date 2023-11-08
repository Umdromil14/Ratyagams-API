/**
 * Creates a category
 * @param {Client} client the postgres client
 * @param {number} typeId the id of the type
 * @param {number} videoGameId the id of the video game
 * 
 * @returns {Promise<QueryResult<any>>} the result of the query
 */
module.exports.createCategory = async (client, typeId, videoGameId) => {
    return await client.query(`INSERT INTO category (type_id, video_game_id) VALUES ($1, $2)`, [typeId, videoGameId]);
}

/**
 * Get all categories
 * @param {Client} client the postgres client
 * 
 * @returns {Promise<QueryResult<any>>} the result of the query
 */
module.exports.getAllCategories = async (client) => {
    return await client.query(`SELECT * FROM category`);
}

/**
 * Get a category
 * @param {Client} client the postgres client
 * @param {number} typeId the id of the type
 * @param {number} videoGameId the id of the video game
 * 
 * @returns {Promise<QueryResult<any>>} the result of the query
 */
module.exports.getCategory = async (client, typeId, videoGameId) => {
    return await client.query(`SELECT * FROM category WHERE type_id = $1 AND video_game_id = $2`, [typeId, videoGameId]);
}

/**
 * Get all categories from a type
 * @param {Client} client the postgres client
 * @param {number} typeId the id of the type
 * 
 * @returns {Promise<QueryResult<any>>} the result of the query
 */
module.exports.getCategoriesFromType = async (client, typeId) => {
    return await client.query(`SELECT * FROM category WHERE type_id = $1`, [typeId]);
}

/**
 * Get all categories from a video game
 * @param {Client} client the postgres client
 * @param {number} videoGameId the id of the video game
 * 
 * @returns {Promise<QueryResult<any>>} the result of the query
 */
module.exports.getCategoriesFromVideoGame = async (client, videoGameId) => {
    return await client.query(`SELECT * FROM category WHERE video_game_id = $2`, [videoGameId]);
}

/**
 * Update a category
 * @param {Client} client the postgres client
 * @param {number} typeId the id of the type
 * @param {number} videoGameId the id of the video game
 * @param {Object} updateValues the values to update
 * @param {number=} updateValues.type_id if undefined, the type id won't be updated
 * @param {number=} updateValues.video_game_id if undefined, the video game id won't be updated
 * 
 * @returns {Promise<QueryResult<any>>} the result of the query
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
        values.push(newId);
        index++;
    }
    if (newVideoGameId !== undefined) {
        query += `video_game_id = $${index}, `;
        values.push(newVideoGameId);
        index++;
    }

    query = query.slice(0, -2);
    query += ` WHERE type_id = $${index} AND video_game_id = $${index + 1}`;
    values.push(typeId);
    values.push(videoGameId)

    return await client.query(query, values);
}

module.exports.deleteCategory = async (client, typeId, videoGameId) => {
    return await client.query(`DELETE FROM category WHERE type_id = $1 AND video_game_id = $2`, [typeId, videoGameId]);
}

module.exports.deleteCategoriesFromType = async (client, typeId) => {
    return await client.query(`DELETE FROM category WHERE type_id = $1`, [typeId]);
}

module.exports.deleteCategoriesFromVideoGame = async (client, videoGameId) => {
    return await client.query(`DELETE FROM category WHERE video_game_id = $1`, [videoGameId]);
}