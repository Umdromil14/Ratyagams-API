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
    return await client.query(
        `INSERT INTO category (genre_id, video_game_id) VALUES ($1, $2)`,
        [genreId, videoGameId]
    );
};

/**
 * Get one or more categories
 *
 * @param {pg.Pool} client the postgres client
 * @param {number} genreId the id of the genre
 * @param {number} videoGameId the id of the video game
 * @param {number=} page the page number
 * @param {number=} limit the number of categories per page
 *
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getCategories = async (
    client,
    genreId,
    videoGameId,
    page,
    limit
) => {
    let query = `SELECT * FROM category`;
    const queryConditions = [];
    const values = [];
    let index = 1;

    if (genreId !== undefined) {
        queryConditions.push(` genre_id = $${index}`);
        values.push(genreId);
        index++;
    }
    if (videoGameId !== undefined) {
        queryConditions.push(` video_game_id = $${index}`);
        values.push(videoGameId);
        index++;
    }

    if (queryConditions.length > 0) {
        query += ` WHERE ${queryConditions.join(" AND ")}`;
    }

    if (page !== undefined && limit !== undefined) {
        query += ` LIMIT $${index} OFFSET $${index + 1}`;
        values.push(limit);
        values.push((page - 1) * limit);
    }

    return await client.query(query, values);
};


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
module.exports.updateCategory = async (
    client,
    genreId,
    videoGameId,
    updateValues
) => {
    const { genre_id: newGenreId, video_game_id: newVideoGameId } =
        updateValues;

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
    values.push(videoGameId);

    return await client.query(query, values);
};

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
    return await client.query(
        `DELETE FROM category WHERE genre_id = $1 AND video_game_id = $2`,
        [genreId, videoGameId]
    );
};

/**
 * Delete all categories from a genre
 *
 * @param {pg.Pool} client the postgres client
 * @param {number} genreId the id of the genre
 *
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deleteCategoriesFromGenre = async (client, genreId) => {
    return await client.query(`DELETE FROM category WHERE genre_id = $1`, [
        genreId,
    ]);
};

/**
 * Delete all categories from a video game
 *
 * @param {pg.Pool} client the postgres client
 * @param {number} videoGameId the id of the video game
 *
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deleteCategoriesFromVideoGame = async (client, videoGameId) => {
    return await client.query(`DELETE FROM category WHERE video_game_id = $1`, [
        videoGameId,
    ]);
};

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
    const { rows } = await client.query(
        `SELECT genre_id FROM category WHERE video_game_id = $1 AND genre_id = $2`,
        [videoGameId, genreId]
    );
    return rows.length > 0;
};

/**
 * Get the number of categories
 *
 * @param {pg.Pool} client the postgres client
 *
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getCategoriesCount = async (client) => {
    return await client.query(`SELECT count(*) AS no FROM category`);
};
