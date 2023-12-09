/**
 * Create a game
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} userId the id of the user
 * @param {number} publicationId the id of the publication
 * @param {boolean} [isOwned=false] whether the user owns the game; defaults to `false`
 * @param {number} [reviewRating=null] the rating the user gave to the game; defaults to `null`
 * @param {string} [reviewComment=null] the comment the user gave to the game; defaults to `null`
 * @param {Date} [reviewDate=null] the date the user gave the review; defaults to `null`
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.createGame = async (client, userId, publicationId, isOwned = false, reviewRating = null, reviewComment = null, reviewDate = null) => {
    return await client.query(
        `INSERT INTO game (user_id, publication_id, is_owned, review_rating, review_comment, review_date) VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, publicationId, isOwned, reviewRating, reviewComment, reviewDate]
    );
}

/**
 * Get games
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number=} userId the id of the user; if specified, only games from this user will be returned
 * @param {number=} publicationId the id of the publication; if specified, only games from this publication will be returned
 * @param {number=} page the page number
 * @param {number=} limit the limit of games per result
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getGames = async (client, userId, publicationId, page, limit) => {
    const queryConditions = [];
    const values = [];

    if (userId !== undefined) {
        queryConditions.push(`user_id = $${queryConditions.length + 1}`);
        values.push(userId);
    }
    if (publicationId !== undefined) {
        queryConditions.push(`publication_id = $${queryConditions.length + 1}`);
        values.push(publicationId);
    }

    let query = `SELECT * FROM game`;
    if (queryConditions.length > 0) {
        query += ` WHERE ${queryConditions.join(" AND ")}`;
    }

    if (page !== undefined && limit !== undefined) {
        query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(limit);
        values.push(page * limit);
    }

    return await client.query(query, values);
}


/**
 * Get the number of games
 * 
 * @param {pg.Pool} client the postgres client
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getGamesCount = async (client) => {
    return await client.query(`SELECT COUNT(*) AS no FROM game`);
}

/**
 * Update a game
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} userId the id of the user
 * @param {number} publicationId the id of the publication
 * @param {Object} updateValues the values to update
 * @param {number=} updateValues.user_id if undefined, the user id won't be updated
 * @param {number=} updateValues.publication_id if undefined, the publication id won't be updated
 * @param {boolean=} updateValues.is_owned if undefined, the is_owned field won't be updated
 * @param {number=} updateValues.review_rating if undefined, the review_rating field won't be updated
 * @param {string=} updateValues.review_comment if undefined, the review_comment field won't be updated
 * @param {Date=} updateValues.review_date if undefined, the review_date field won't be updated
 * 
 * @returns {Promise<pg.Result>} the result of the query
 * 
 * @throws {Error} if no values to update
 */
module.exports.updateGame = async (client, userId, publicationId, updateValues) => {
    const {
        user_id: newUserId,
        publication_id: newPublicationId,
        is_owned: isOwned,
        review_rating: reviewRating,
        review_comment: reviewComment,
        review_date: reviewDate
    } = updateValues;

    let query = `UPDATE game SET `;
    const values = [];
    let index = 1;

    if (newUserId !== undefined) {
        query += `user_id = $${index}, `;
        values.push(newUserId);
        index++;
    }
    if (newPublicationId !== undefined) {
        query += `publication_id = $${index}, `;
        values.push(newPublicationId);
        index++;
    }
    if (isOwned !== undefined) {
        query += `is_owned = $${index}, `;
        values.push(isOwned);
        index++;
    }
    if (reviewRating !== undefined) {
        query += `review_rating = $${index}, `;
        values.push(reviewRating);
        index++;
    }
    if (reviewComment !== undefined) {
        query += `review_comment = $${index}, `;
        values.push(reviewComment);
        index++;
    }
    if (reviewDate !== undefined) {
        query += `review_date = $${index}, `;
        values.push(reviewDate);
        index++;
    }

    if (index === 1) {
        throw new Error("No fields to update");
    }

    query = query.slice(0, -2);
    query += ` WHERE user_id = $${index} AND publication_id = $${index + 1}`;
    values.push(userId);
    values.push(publicationId);

    return await client.query(query, values);
}

/**
 * Delete a game
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} userId the id of the user
 * @param {number} publicationId the id of the publication
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deleteGame = async (client, userId, publicationId) => {
    return await client.query(
        `DELETE FROM game WHERE user_id = $1 AND publication_id = $2`,
        [userId, publicationId]
    );
}

/**
 * Delete all games from a user
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} userId the id of the user
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deleteGamesFromUser = async (client, userId) => {
    return await client.query(
        `DELETE FROM game WHERE user_id = $1`,
        [userId]
    );
}

/**
 * Delete all games from a publication
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} publicationId the id of the publication
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deleteGamesFromPublication = async (client, publicationId) => {
    return await client.query(
        `DELETE FROM game WHERE publication_id = $1`,
        [publicationId]
    );
}

/**
 * Check if a game exists
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} userId the id of the user
 * @param {number} publicationId the id of the publication
 * 
 * @returns {Promise<boolean>} `true` if the game exists, `false` otherwise
 */
module.exports.gameExists = async (client, userId, publicationId) => {
    const { rows } = await client.query(
        `SELECT count(*) AS no FROM game WHERE user_id = $1 AND publication_id = $2`,
        [userId, publicationId]
    );
    return rows[0].no > 0;
}