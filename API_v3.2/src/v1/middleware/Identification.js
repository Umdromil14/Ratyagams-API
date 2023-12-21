/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *  responses:
 *      DeprecatedJWT:
 *          description: JWT_DEPRECATED
 *      ErrorJWT:
 *          description: INVALID_JWT
 *      MissingJWT:
 *          description: MISSING_JWT
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = require("../model/database");
const { userExists } = require("../model/userDB");
const HTTPStatus = require("../tools/HTTPStatus.js")

/**
 * Identification middleware for the user or admin session
 * 
 * @param {Request} req
 * @param {Response} res 
 * @param {Function} next
 * 
 * @returns {Promise<void>} 
 */
module.exports.identification = async (req, res, next) => {
    const headerAuth = req.get("authorization");

    if (headerAuth && headerAuth.includes("Bearer")) {
        const token = headerAuth.split(" ")[1];

        const client = await pool.connect();
        try {
            const { data: user } = jwt.verify(token, process.env.JWT_SECRET);
            
            if (!(await userExists(client, user.id))) {
                res.status(HTTPStatus.NOT_FOUND).json({
                    code: "JWT_DEPRECATED",
                    message: "JWT token deprecated",
                });
            } else {
                req.session = user;
                next();
            }
        } catch (error) {
            res.status(HTTPStatus.BAD_REQUEST).json({
                code: "INVALID_JWT",
                message: "Invalid JWT token",
            });
        } finally {
            client.release();
        }
    } else {
        res.status(HTTPStatus.UNAUTHORIZED).send({
            code: "MISSING_JWT",
            message: "Missing JWT token",
        });
    }
}