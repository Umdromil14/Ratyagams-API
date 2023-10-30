const pool = require("../model/database");
const PublicationModel = require("../model/publication");
const videoGameModel = require("../model/videoGame");
const platformModel = require("../model/platform");

module.exports.getPublicationId = async (client, videoGameName,platformName) => {
    if (!videoGameName || !platformName) {
        return null;
    }
    const platform = await platformModel.getPlatform(client, platformName.toUpperCase());
    const videoGame = await videoGameModel.getVideoGame(client,videoGameName);
    if (platform.rows.length === 0 || videoGame.rows.length === 0) {
        return null;
    }
    const platformcode = platform.rows[0].code;
    //can only get one platform
    //can not only get one video game
    // example : call of duty on multiple platform
    // join on platform and video_game
    // console.log(platformcode);
    let videoGameCode;
    let publication;
    for (let iVideoGames = 0 ; iVideoGames < videoGame.rows.length ; iVideoGames++) {
        videoGameCode = videoGame.rows[iVideoGames].id;
        publication = await PublicationModel.getPublication(client, videoGameCode, platformcode);
    }
    if (publication.rows.length === 0) {
        return null;
    }
    return publication.rows[0].id;

}