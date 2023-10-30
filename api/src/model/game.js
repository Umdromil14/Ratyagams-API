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

module.exports.updateGame = async (
    client,
    userId,
    publicationId,
    newUserId = null,
    newPublicationId = null,
    isOwned = null,
    reviewRating = null,
    reviewComment = null,
    reviewDate = null,
) => {
    let query = `UPDATE game SET `;
    let values = [];
    let index = 1;

    if (newUserId !== null) {
        query += `user_id = $${index}, `;
        values.push(newUserId);
        index++;
    }
    if (newPublicationId !== null) {
        query += `publication_id = $${index}, `;
        values.push(newPublicationId);
        index++;
    }
    if (isOwned !== null) {
        query += `is_owned = $${index}, `;
        values.push(isOwned);
        index++;
    }
    if (reviewRating !== null) {
        query += `review_rating = $${index}, `;
        values.push(reviewRating);
        index++;
    }
    if (reviewComment !== null) {
        query += `review_comment = $${index}, `;
        values.push(reviewComment);
        index++;
    }
    if (reviewDate !== null) {
        query += `review_date = $${index}, `;
        values.push(reviewDate);
        index++;
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

module.exports.deleteUserGames = async (client,userId) => {
    return await client.query(
        `DELETE FROM game WHERE user_id = $1`,
        [userId]
    );
}

module.exports.deletePublicationGames = async (client, publicationId) => {
    return await client.query(
        `DELETE FROM game WHERE publication_id = $1`,
        [publicationId]
    );
}

module.exports.gameExists = async (client, userId, publicationId) => {
    const { rows } =  await client.query(
        `SELECT count(*) AS no FROM game WHERE user_id = $1 AND publication_id = $2`,
        [userId, publicationId]
    );
    return rows[0].no > 0;
}

