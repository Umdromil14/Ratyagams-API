module.exports.getVideoGame = async (client ,value) => {
    return await client.query(
        `SELECT * FROM video_game WHERE id = $1`,
        [value]
    );
}

module.exports.getVideoGames = async (client) => {
    return await client.query(
        `SELECT * FROM video_game`
    );
}

module.exports.createVideoGame = async (client, name, description) => {
    await client.query(
        `INSERT INTO video_game (name, description) VALUES ($1, $2)`,
        [name, description]
    );
}

module.exports.videoGameExists = async (client, name) => {
    const {rows : videoGame} = await client.query(
        `SELECT * FROM video_game WHERE name = $1`,
        [name]
    );
    return videoGame.length > 0;
}

// ! update name et description séparément
module.exports.updateVideoGame = async (client, id, name, description) => {
    await client.query(
        `UPDATE video_game SET name = $1, description = $2 WHERE id = $3`,
        [name, description, id]
    );
};

module.exports.deleteVideoGame = async (client, id) => {
    await client.query(
        `DELETE FROM video_game WHERE id = $1`,
        [id]
    );
};