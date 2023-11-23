/**
 * @swagger
 * components:
 *  schemas:
 *      Type:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *                  description: The id
 *              name:
 *                  type: string
 *                  description: The type name
 *              description:
 *                  type: string
 *                  description: The type description
 */
const pool = require("../model/database");
const TypeModel = require("../model/type");
const CategoryModel = require("../model/category");
const tools = require("../tools/utils");
const HTTPStatus = require("../tools/HTTPStatus");

const { typeSchema, getTypeSchema } = require("../zod/schema/type");
const PGErrors = require("../tools/PGErrors");
const { validateObject } = require("../zod/zod");

/**
 * Create a type
 *
 * @param {Request} req The name and the description of the new type inside of the body
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      TypeAdded:
 *          description: The type was added
 *  requestBodies:
 *      TypeToAdd:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: The type name
 *                          description:
 *                              type: string
 *                              description: The type description
 *                      required:
 *                          - name
 *                          - description
 */
module.exports.createType = async (req, res) => {
    let name, description;
    try {
        ({ name, description } = validateObject(req.body, typeSchema));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }

    const client = await pool.connect();
    try {
        await TypeModel.createType(client, name, description);
        res.status(HTTPStatus.CREATED).send("Creation done");
    } catch (error) {
        switch (error.code) {
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).send("Type already exists");
                break;
            default:
                res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
                break;
        }
    } finally {
        client.release();
    }
};

/**
 * Get a type by id or all types
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      TypeFound:
 *          description: Type was found
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Type'
 */
module.exports.getTypes = async (req, res) => {
    let id;
    try {
        ({ id } = validateObject(req.query, getTypeSchema));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }
    const client = await pool.connect();
    try {
        const { rows: types } = await TypeModel.getTypes(client, id);
        if (types.length === 0) {
            res.status(HTTPStatus.NOT_FOUND).send("No types found");
            return;
        }
        res.json(types);
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Update a type
 * 
 * @param {Request} req The type id to update as parameter and the new name and/or new description inside of the body
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 * 
 * @swagger
 * components:
 *  responses:
 *      TypeUpdated:
 *          description: The type was updated
 *  requestBodies:
 *      TypeToUpdate:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: The type name
 *                          description:
 *                              type: string
 *                              description: The type description

 */
module.exports.updateType = async (req, res) => {
    let updateValues;
    try {
        updateValues = validateObject(req.body, typeSchema.partial());
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        return;
    }

    const client = await pool.connect();
    try {
        const { rowCount } = await TypeModel.updateType(
            client,
            id,
            updateValues
        );

        if (rowCount === 0) {
            res.status(HTTPStatus.BAD_REQUEST).send("type not found");
            return;
        }

        res.sendStatus(HTTPStatus.NO_CONTENT);
    } catch (error) {
        switch (error.code) {
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).send(
                    "name is already in the database"
                );
                break;
            default:
                res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
                break;
        }
    } finally {
        client.release();
    }
}

/**
 * Delete a type
 *
 * @param {Request} req The type id to delete as a parameter
 * @param {Response} res
 *
 * @returns {Promise<void>}
 * 
 * @swagger
 * components:
 *  responses:
 *      TypeDeleted:
 *          description: The type was deleted
 */
module.exports.deleteType = async (req, res) => {
    const client = await pool.connect();
    let id;
    try {
        ({ id } = validateObject(req.params, getTypeSchema));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }
    try {
        client.query("BEGIN");
        await CategoryModel.deleteCategoriesFromType(client, id);
        const { rowCount } = await TypeModel.deleteType(client, id);
        if (rowCount === 0) {
            res.status(HTTPStatus.BAD_REQUEST).send("Id not found");
            return;
        }
        res.sendStatus(HTTPStatus.NO_CONTENT);
        client.query("COMMIT");
    } catch (error) {
        client.query("ROLLBACK");
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}
