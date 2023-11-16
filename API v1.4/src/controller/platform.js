const pool = require("../model/database");
const PlatformModel = require("../model/platform");
const { isValidObject } = require("../tools/utils");
const HTTPStatus = require("../tools/HTTPStatus");


// * DONE
// TODO swagger
/**
 * Get a platform by its code
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getPlatform = async (req, res) => {
    const code = req.params.code.toUpperCase();

    const client = await pool.connect();
    try {
        const { rows: platform } = await PlatformModel.getPlatform(client, code);
        if (platform.length === 0) {
            res.status(HTTPStatus.NOT_FOUND).send("No platform found");
        } else {
            res.json(platform[0]);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Get all platforms
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getAllPlatforms = async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows: platforms } = await PlatformModel.getAllPlatforms(client);
        if (platforms.length === 0) {
            res.status(HTTPStatus.NOT_FOUND).send("No platform found");
        } else {
            res.json(platforms);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Create a new platform
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.postPlatform = async (req, res) => {
    const model = {
        code: ["string"],
        description: ["string"]
    }

    const body = req.body;
    if (!isValidObject(body, model)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }

    const code = body.code.toUpperCase();
    const { description } = body;

    const client = await pool.connect();
    try {
        if (await PlatformModel.platformExists(client, code)) {
            res.status(HTTPStatus.CONFLICT).send("Platform already exists")
        } else {
            await PlatformModel.createPlatform(client, code, description);
            res.sendStatus(HTTPStatus.CREATED);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Update a platform
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.updatePlatform = async (req, res) => {
    const model = {
        code: ["string", "optional"],
        description: ["string", "optional"]
    }

    const code = req.params.code.toUpperCase();
    const body = req.body;
    if (!isValidObject(body, model, true)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }

    const newCode = body.code ? body.code.toUpperCase() : undefined;
    const updateValues = {
        code: newCode,
        description: body.description
    };

    const client = await pool.connect();
    try {
        if (newCode && code !== newCode && await PlatformModel.platformExists(client, newCode)) {
            res.status(HTTPStatus.CONFLICT).send("Platform already exists");
            return;
        }
        
        const { rowCount } = await PlatformModel.updatePlatform(client, code, updateValues);
        if (rowCount) {
            res.sendStatus(HTTPStatus.NO_CONTENT);
        } else {
            res.status(HTTPStatus.NOT_FOUND).send("Platform not found");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Delete a platform
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.deletePlatform = async (req, res) => {
    const code = req.params.code.toUpperCase();
    
    const client = await pool.connect();
    try {
        const { rowCount } = await PlatformModel.deletePlatform(client, code);
        if (rowCount) {
            res.sendStatus(HTTPStatus.NO_CONTENT);
        } else {
            res.status(HTTPStatus.NOT_FOUND).send("Platform not found");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}