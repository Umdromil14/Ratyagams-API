/**
 * Creates a publication
 *
 * @param {pg.Pool} client the postgres client
 * @param {string} platformCode the code of the platform
 * @param {number} videoGameId the id of the video game
 * @param {Date} releaseDate the date of the video game release
 * @param {number} [releasePrice=null] the video game price when it's released; default to `null`
 * @param {string} [storePageURL=null] the url to the official webstore; default to `null`
 *
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.createPublication = async (
    client,
    platformCode,
    videoGameId,
    releaseDate,
    releasePrice = null,
    storePageURL = null
) => {
    return await client.query(
        `
        INSERT INTO publication
        (platform_code, video_game_id, release_date, release_price, store_page_url)
        VALUES ($1, $2, $3, $4, $5) RETURNING id
        `,
        [platformCode, videoGameId, releaseDate, releasePrice, storePageURL]
    );
};

/**
 * Get one or more publications
 *
 * @param {pg.Pool} client the postgres client
 * @param {number=} publicationId the publication id
 * @param {string=} platformCode the platform code
 * @param {number=} videoGameId the id of the video game
 * @param {string=} videoGameName the name of the video game (case insensitive and partial)
 * @param {number=} userId the id of the user that owns the video game
 * @param {boolean=} alphabetical `true` if the result should be ordered alphabetically, `false` otherwise
 *
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getPublication = async (
    client,
    publicationId,
    platformCode,
    videoGameId,
    videoGameName,
    userId,
    alphabetical,
    page,
    limit
) => {
    const queryConditions = [];
    const queryValues = [];

    if (publicationId !== undefined) {
        queryConditions.push(`publication.id = $${queryValues.length + 1}`);
        queryValues.push(publicationId);
    }
    if (platformCode !== undefined) {
        queryConditions.push(`platform_code = $${queryValues.length + 1}`);
        queryValues.push(platformCode);
    }
    if (videoGameId !== undefined) {
        queryConditions.push(`video_game_id = $${queryValues.length + 1}`);
        queryValues.push(videoGameId);
    }
    if (videoGameName !== undefined) {
        queryConditions.push(`LOWER(video_game.name) LIKE $${queryValues.length + 1}`);
        queryValues.push(`%${videoGameName.toLowerCase()}%`);
    }
    if (userId !== undefined) {
        queryConditions.push(
            `publication.id in (SELECT publication_id FROM game WHERE user_id = $${
                queryValues.length + 1
            })`
        );
        queryValues.push(userId);
    }

    let query = `SELECT publication.* FROM publication INNER JOIN video_game ON publication.video_game_id = video_game.id`;
    if (queryConditions.length > 0) {
        query += ` WHERE ${queryConditions.join(" AND ")}`;
    }
    if (alphabetical) {
        query += ` ORDER BY video_game.name ASC`;
    }

    if (page !== undefined && limit !== undefined) {
        const offset = (page - 1) * limit;
        query += ` LIMIT $${queryValues.length + 1} OFFSET $${queryValues.length + 2}`;
        queryValues.push(limit);
        queryValues.push(offset);
    }

    return await client.query(query, queryValues);
};

/**
 * Get all publications from a video game
 *
 * @param {pg.Pool} client the postgres client
 * @param {number} videoGameId the video game id
 *
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getPublicationsFromVideoGame = async (client, videoGameId) => {
    return await client.query(
        `SELECT * FROM publication WHERE video_game_id = $1`,
        [videoGameId]
    );
};

/**
 * Update a publication
 *
 * @param {pg.Pool} client the postgres client
 * @param {number} id the publication id
 * @param {object} updateValues the values to update
 * @param {string=} updateValues.platform_code the platform code
 * @param {number=} updateValues.video_game_id the id of the video game
 * @param {Date=} updateValues.release_date the date of the release
 * @param {number=} updateValues.release_price the video game price when the game is released
 * @param {string=} updateValues.store_page_url the url of the official store
 *
 * @returns {Promise<pg.Result>} the result of the query
 *
 * @throws {Error} if there is no values to update
 */
module.exports.updatePublication = async (client, id, updateValues) => {
    const {
        platform_code: newPlatformCode,
        video_game_id: newVideoGameId,
        release_date: newReleaseDate,
        release_price: newReleasePrice,
        store_page_url: newStorePageURL,
    } = updateValues;

    let query = `UPDATE publication SET `;
    let values = [];
    let index = 1;

    if (newPlatformCode !== undefined) {
        query += `platform_code = $${index}, `;
        values.push(newPlatformCode);
        index++;
    }
    if (newVideoGameId !== undefined) {
        query += `video_game_id = $${index}, `;
        values.push(newVideoGameId);
        index++;
    }
    if (newReleaseDate !== undefined) {
        query += `release_date = $${index}, `;
        values.push(newReleaseDate);
        index++;
    }
    if (newReleasePrice !== undefined) {
        query += `release_price = $${index}, `;
        values.push(newReleasePrice);
        index++;
    }
    if (newStorePageURL !== undefined) {
        query += `store_page_url = $${index}, `;
        values.push(newStorePageURL);
        index++;
    }

    if (values.length === 0) {
        throw new Error("No values to update");
    }
    query = query.slice(0, -2);
    query += ` WHERE id = $${index}`;
    values.push(id);

    return await client.query(query, values);
};

/**
 * Delete a publication by its id
 *
 * @param {pg.Pool} client the postgres client
 * @param {number} id the publication id
 *
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deletePublication = async (client, id) => {
    return await client.query(
        `
        DELETE FROM publication WHERE id = $1
    `,
        [id]
    );
};

/**
 * Delete all publications from a game
 *
 * @param {pg.Pool} client the postgres client
 * @param {number} videoGameId the id of the video game
 *
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deleteAllPublicationFromGame = async (client, videoGameId) => {
    return await client.query(
        `
        DELETE FROM publication WHERE video_game_id = $1
    `,
        [videoGameId]
    );
};

/**
 * Check if a publication exist by its id
 *
 * @param {pg.Pool} client the postgres client
 * @param {number} id the publication id
 *
 * @returns {Promise<boolean>} `true` if the publication exists, `false` otherwise
 */
module.exports.publicationExists = async (client, id) => {
    const { rows } = await client.query(
        "SELECT id FROM publication WHERE id = $1",
        [id]
    );
    return rows.length === 1;
};

/**
 * Check if a publication exists by its video game and its platform
 *
 * @param {pg.Pool} client the postgres client
 * @param {string} platform_code the platform code
 * @param {number} videoGameId the id of the video game
 *
 * @returns {Promise<boolean>} `true` if the publication exists, `false` otherwise
 */
module.exports.publicationExistsByPVB = async (
    client,
    videoGameId,
    platformCode
) => {
    const { rows } = await client.query(
        "SELECT id FROM publication WHERE video_game_id = $1 AND platform_code = $2",
        [videoGameId, platformCode]
    );
    return rows.length === 1;
};

/**
 * Get the number of publications
 *
 * @param {pg.Pool} client the postgres client
 *
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getPublicationCount = async (client) => {
    return await client.query("SELECT COUNT(*) AS no FROM publication");
};
