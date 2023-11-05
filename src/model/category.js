module.exports.createCategory = async (client, typeId, videoGameId) => {
    return await client.query(`INSERT INTO category (type_id, video_game_id) VALUES ($1, $2)`, [typeId, videoGameId]);
}

module.exports.getCategories = async (client) => {
    return await client.query(`SELECT * FROM category`);
}

module.exports.getCategory = async (client, typeId, videoGameId) => {
    return await client.query(`SELECT * FROM category WHERE type_id = $1 AND video_game_id = $2`, [typeId, videoGameId]);
}

module.exports.getCategoriesFromType = async (client, typeId) => {
    return await client.query(`SELECT * FROM category WHERE type_id = $1`, [typeId]);
}

module.exports.getCategoriesFromVideoGame = async (client, videoGameId) => {
    return await client.query(`SELECT * FROM category WHERE video_game_id = $2`, [videoGameId]);
}

module.exports.updateCategory = async (client, typeId, videoGameId, newTypeId = null, newVideoGameId = null) => {
    let query = `UPDATE category SET `;
    let values = [];
    let index = 1;

    if(newTypeId === null && newVideoGameId === null){
        return;
    }
    
    if(newTypeId !== null){
        query += `type_id = $${index}, `;
        values.push(newId);
        index++;
    }

    if(newVideoGameId !== null){
        query += `video_game_id = $${index}, `;
        values.push(newVideoGameId);
        index++;
    }
    query = query.slice(0, -2);
    query += ` WHERE type_id = $${index} AND video_game_id = $${index+1}`;
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