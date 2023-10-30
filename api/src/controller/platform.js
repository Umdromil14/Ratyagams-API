const pool = require("../model/database");
const PlatformModel = require("../model/platform");
const { isValidObject } = require("../tools");


module.exports.getPlatform = async (req, res) => {
    const code = req.params.code.toUpperCase();

    const client = await pool.connect();
    try {
        const { rows: platform } = await PlatformModel.getPlatform(client, code);
        if (platform.length === 0) {
            res.status(404).send("No platform found");
        } else {
            res.json(platform[0]);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getPlatforms = async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows: platforms } = await PlatformModel.getAllPlatforms(client);
        if (platforms.length === 0) {
            res.status(404).send("No platform found");
        } else {
            res.json(platforms);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.postPlatform = async (req, res) => {
    const model = {
        code: ["string"],
        description: ["string"]
    }

    const body = req.body;
    if (!isValidObject(body, model)) {
        res.status(400).send("Invalid body");
        return;
    }

    const { code, description } = body;
    const client = await pool.connect();
    try {
        if (await PlatformModel.platformExists(client, code)) {
            res.status(409).send("Platform already exists");
        } else {
            await PlatformModel.createPlatform(client, code, description);
            res.status(201).send("Platform created");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

// TODO faire une transaction pour update
module.exports.updatePlatform = async (req, res) => {
    const model = {
        code: ["string"],
        newCode: ["string", "optional"],
        description: ["string", "optional"]
    }

    const body = req.body;
    if (!isValidObject(body, model)) {
        res.status(400).send("Invalid body");
        return;
    }

    const { code, newCode, description } = body;
    const client = await pool.connect();
    try {
        if (await PlatformModel.platformExists(client, code)) {
            if (newCode !== undefined || description !== undefined) {
                await PlatformModel.updatePlatform(client, code, newCode, description);
            }
            res.status(200).send("Platform updated");
        } else {
            res.status(404).send("Platform not found");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.deletePlatform = async (req, res) => {
    const model = {
        code: ["string"]
    }

    const body = req.body;
    if (!isValidObject(body, model)) {
        res.status(400).send("Invalid body");
        return;
    }

    const { code } = body;
    const client = await pool.connect();
    try {
        if (await PlatformModel.platformExists(client, code)) {
            await PlatformModel.deletePlatform(client, code);
            res.status(200).send("Platform deleted");
        } else {
            res.status(404).send("Platform not found");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}