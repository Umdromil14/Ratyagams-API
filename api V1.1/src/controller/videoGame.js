const pool = require("../model/database");
const VideoGameModel = require("../model/videoGame");
const PublicationModel = require("../model/publication");
const GameController = require("../model/game");
const CategoryModel = require("../model/category");

//value for videoGames is id name description

module.exports.getVideoGames = async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows: videoGames } = await VideoGameModel.getVideoGames(client);
    res.json(videoGames);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  } finally {
    client.release();
  }
};

module.exports.getVideoGame = async (req, res) => {
  const id = parseInt(req.params.id);
  const client = await pool.connect();
  try {
    const { rows: videoGame } = await VideoGameModel.getVideoGame(client, id);
    if (videoGame.length === 0) {
      res.status(404).send("No video game found");
    } else {
      res.json(videoGame[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  } finally {
    client.release();
  }
};

//get a name of a video game and a short description of it

module.exports.postVideoGame = async (req, res) => {
  const { name: name, description: description } = req.body;
  if (!name || !description) {
    res.status(400).send("Missing name or description");
    return;
  }
  const client = await pool.connect();
  try {
    await VideoGameModel.createVideoGame(client, name, description); // still need to create createVideoGame
    res.status(201).send("Video Game created");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  } finally {
    client.release();
  }
};

module.exports.updateVideoGame = async (req, res) => {
    const { id : id ,name: name, description: description } = req.body;
    
    if (!name || !description || !id || isNaN(id)) {
      res.status(400).send("Something went wrong with the parameters");
      return;
    }
  const client = await pool.connect();
  try {
    await VideoGameModel.updateVideoGame(client, id, name, description); // still need to create updateVideoGame
    res.status(200).send("Video Game updated");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  } finally {
    client.release();
  }
};

module.exports.deleteVideoGame = async (req, res) => {
  const id = parseInt(req.params.id);
  const client = await pool.connect();
  try {
    client.query("BEGIN");
    // ! todo : get all the publication from the await function for cédric please dépeche you
    const { rows : publicationIds } = await PublicationModel.getPublicationsByVideoGame(client, id);
    if (publicationIds.length !== 0) {
        for (const publicationId of publicationIds) {
            await GameController.deleteGamesByPublication(client, publicationId.id);
            await PublicationModel.deletePublication(client, publicationId.id);
        } // end
    }
    await CategoryModel.deleteCategoriesFromVideoGame(client, id); //! j'ai (ced) rajouté ça pour discuter demain
    await VideoGameModel.deleteVideoGame(client, id); // still need to create deleteVideoGame
    client.query("COMMIT");
    res.status(200).send("Video Game deleted");
  } catch (error) {
    client.query("ROLLBACK");
    console.error(error);
    res.status(500).send("Internal Server Error");
  } finally {
    client.release();
  }
};
