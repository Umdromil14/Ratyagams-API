module.exports.createPublication = async (client, platformCode, videoGameId, releaseDate, releasePrice = null, storePageURL = null) => {
    return await client.query(`
        INSERT INTO publication
        (platform_code, video_game_id, release_date, release_price, store_page_url)
        VALUES ($1, $2, $3, $4, $5)
        `, [platformCode, videoGameId, releaseDate, releasePrice, storePageURL]
        );
}

module.exports.getPublication = async (client, id) => {
    return await client.query(`
        SELECT * FROM publication WHERE id = $1
    `, [id]);
}

module.exports.getPublicationByPlatform = async (client, platformCode) => {
    return await client.query(`SELECT * FROM publication WHERE platform_code = $1`, [platformCode]);
}

module.exports.getPublications = async (client) => {
    return await client.query(`SELECT * FROM publication`);
}

module.exports.getPublicationByGameAndPlatform = async (client, videoGameCode, platformCode) => {
    return await client.query(
        `SELECT * FROM publication WHERE video_game_id = $1 AND platform_code = $2`,
        [videoGameCode, platformCode]
    );
}

module.exports.getPublicationsByVideoGame = async (client, videoGameId) => {
    return await client.query(`SELECT * FROM publication WHERE video_game_id = $1`, [videoGameId])
} 

// ? demander si il faut changer l'id
module.exports.updatePublication = async (
        client, id, newId = null, newPlatformCode = null, newVideoGameId = null, newReleaseDate = null,
        newReleasePrice = null, newStorePageURL = null) => {
    
    let query = `UPDATE publication SET `;
    let values = [];
    let index = 1;

    if(newId === null && newPlatformCode === null && newVideoGameId === null && newReleaseDate === null
        && newReleasePrice === null && newStorePageURL === null){
        return;
    }

    if (newId !== null) {
        query += `id = $${index}, `;
        values.push(newId);
        index++;
    }
    if (newPlatformCode !== null) {
        query += `platform_code = $${index}, `;
        values.push(newPlatformCode);
        index++;
    }
    if (newVideoGameId !== null) {
        query += `video_game_id = $${index}, `;
        values.push(newVideoGameId);
        index++;
    }
    if (newReleaseDate !== null) {
        query += `release_date = $${index}, `;
        values.push(newReleaseDate);
        index++;
    }
    if (newReleasePrice !== null) {
        query += `release_price = $${index}, `;
        values.push(newReleasePrice);
        index++;
    }
    if (newStorePageURL !== null) {
        query += `store_page_url = $${index}, `;
        values.push(newStorePageURL);
        index++;
    }
    query = query.slice(0, -2);
    query += ` WHERE id = $${index}`;
    values.push(id);
    
    return await client.query(query, values);
}

module.exports.deletePublication = async (client, id) => {
    return await client.query(`
        DELETE FROM publication WHERE id = $1
    `, [id]);
}

module.exports.deleteAllPublicationFromGame = async (client, videoGameId) => {
    return await client.query(`
        DELETE FROM publication WHERE video_game_id = $1
    `, [videoGameId]);
}