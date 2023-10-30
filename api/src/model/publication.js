module.exports.getPublication = async (client, videoGameCode, platformCode) => {
    return await client.query(
        `SELECT * FROM publication WHERE video_game_id = $1 AND platform_code = $2`,
        [videoGameCode, platformCode]
    );
}