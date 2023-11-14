/**
 * Creates a publication
 * 
 * @param {pg.Pool} client the postgres client
 * @param {string} platformCode the code of the platform
 * @param {number} videoGameId the id of the video game
 * @param {Date} releaseDate the date of the video game release 
 * @param {number} [releasePrice=null] the video game price when it's released
 * @param {string} [storePageURL=null] the url to the official webstore  
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.createPublication = async (client, platformCode, videoGameId, releaseDate, releasePrice = null, storePageURL = null) => {
    return await client.query(`
        INSERT INTO publication
        (platform_code, video_game_id, release_date, release_price, store_page_url)
        VALUES ($1, $2, $3, $4, $5) RETURNING id
        `, [platformCode, videoGameId, releaseDate, releasePrice, storePageURL]
    );
}

/**
 * Get a publication by its id
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} id the id of the publication
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getPublication = async (client, id) => {
    return await client.query(`
        SELECT * FROM publication WHERE id = $1
    `, [id]);
}

/**
 * Get all the publication corresponding to a platform
 * 
 * @param {pg.Pool} client the postgres client
 * @param {string} platformCode the code of the platform
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getPublicationFromPlatform = async (client, platformCode) => {
    return await client.query(`SELECT * FROM publication WHERE platform_code = $1`, [platformCode]);
}

/**
 * Get all the publications
 * 
 * @param {pg.Pool} client the postgres client
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getPublications = async (client) => {
    return await client.query(`SELECT * FROM publication`);
}

/**
 * Get a publication by its game and its platform
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} videoGameId the video game id
 * @param {string} platformCode the platform code
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getPublicationFromGameAndPlatform = async (client, videoGameId, platformCode) => {
    return await client.query(
        `SELECT * FROM publication WHERE video_game_id = $1 AND platform_code = $2`,
        [videoGameId, platformCode]
    );
}

/**
 * Get all publications from a video game
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} videoGameId the video game id
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.getPublicationsFromVideoGame = async (client, videoGameId) => {
    return await client.query(`SELECT * FROM publication WHERE video_game_id = $1`, [videoGameId])
}

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
 */
module.exports.updatePublication = async (client, id, updateValues) => {
    const {
        platform_code : newPlatformCode,
        video_game_id : newVideoGameId,
        release_date : newReleaseDate,
        release_price : newReleasePrice,
        store_page_url : newStorePageURL
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
    query = query.slice(0, -2);
    query += ` WHERE id = $${index}`;
    values.push(id);
    
    return await client.query(query, values);
}

/**
 * Delete a publication by its id
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} id the publication id
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deletePublication = async (client, id) => {
    return await client.query(`
        DELETE FROM publication WHERE id = $1
    `, [id]);
}

/**
 * Delete all publications from a game
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} videoGameId the id of the video game
 * 
 * @returns {Promise<pg.Result>} the result of the query
 */
module.exports.deleteAllPublicationFromGame = async (client, videoGameId) => {
    return await client.query(`
        DELETE FROM publication WHERE video_game_id = $1
    `, [videoGameId]);
}

/**
 * Check if a publication exist by its id
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} id the publication id
 * 
 * @returns {Promise<boolean>} `true` if the publication exists, `false` otherwise 
 */
module.exports.publicationExists = async (client, id) => {
    const {rows} = await client.query("SELECT id FROM publication WHERE id = $1", [id]);
    return rows.length === 1;
}

/**
 * Check if a publication exists by its video game and its platform
 * 
 * @param {pg.Pool} client the postgres client
 * @param {string} platform_code the platform code
 * @param {number} videoGameId the id of the video game
 * 
 * @returns {Promise<boolean>} `true` if the publication exists, `false` otherwise
 */
module.exports.publicationExistsByPVB = async (client, videoGameId, platformCode) => {
    const {rows} = await client.query("SELECT id FROM publication WHERE video_game_id = $1 AND platform_code = $2",
        [videoGameId, platformCode]);
    return rows.length === 1;
}