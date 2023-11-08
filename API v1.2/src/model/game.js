module.exports.createGame = async (client, userId, publicationId, isOwned = false, reviewRating = null, reviewComment = null, reviewDate = null) => {
    return await client.query(
        `INSERT INTO game (user_id, publication_id, is_owned, review_rating, review_comment, review_date) VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, publicationId, isOwned, reviewRating, reviewComment, reviewDate]
    );
}

module.exports.getGame = async (client, userId, publicationId) => {
    return await client.query(
        `SELECT * FROM game WHERE user_id = $1 AND publication_id = $2`,
        [userId, publicationId]
    );
}

module.exports.getUserGames = async (client, userId) => {
    return await client.query(
        `SELECT * FROM game WHERE user_id = $1`,
        [userId]
    );
}

/**
 * Update a game.
 * @param {Client} client the postgres client
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
 * @returns {Promise<QueryResult<any>>} the result of the query
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

module.exports.deleteGame = async (client, userId, publicationId) => {
    return await client.query(
        `DELETE FROM game WHERE user_id = $1 AND publication_id = $2`,
        [userId, publicationId]
    );
}

module.exports.deleteGamesByUser = async (client, userId) => {
    return await client.query(
        `DELETE FROM game WHERE user_id = $1`,
        [userId]
    );
}

module.exports.deleteGamesByPublication = async (client, publicationId) => {
    return await client.query(
        `DELETE FROM game WHERE publication_id = $1`,
        [publicationId]
    );
}

module.exports.gameExists = async (client, userId, publicationId) => {
    const { rows } = await client.query(
        `SELECT count(*) AS no FROM game WHERE user_id = $1 AND publication_id = $2`,
        [userId, publicationId]
    );
    return rows[0].no > 0;
}

