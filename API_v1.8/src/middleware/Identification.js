/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *  responses:
 *      BlacklistedJWT:
 *          description: Token is blacklisted
 *      ErrorJWT:
 *          description: Invalid JWT token
 *      MissingJWT:
 *          description: Missing JWT token
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();
const HTTPStatus = require("../tools/HTTPStatus.js")

const blacklist = [];

/**
 * Blacklist a token
 * 
 * @param {string} token
 * 
 * @returns {void}
*/
module.exports.blacklistToken = (token) => {
    blacklist.push(token);
    setTimeout(() => {
        const index = blacklist.indexOf(token);
        if (index > -1) {
            blacklist.splice(index, 1);
        }
    }, process.env.JWT_EXPIRATION * 1000);
}

// TODO add FORBIDDEN
/**
 * Identification middleware for the user or admin session
 * 
 * @param {Request} req
 * @param {Response} res 
 * @param {Function} next
 * 
 * @returns {void} 
 */
module.exports.identification = (req, res, next) => {
    const headerAuth = req.get("authorization");

    if (headerAuth && headerAuth.includes("Bearer")) {
        const token = headerAuth.split(" ")[1];

        if (blacklist.includes(token)) {
            res.status(HTTPStatus.FORBIDDEN).send("Token is blacklisted");
            return;
        }

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.session = decodedToken;
            next();
        } catch (error) {
            res.status(HTTPStatus.BAD_REQUEST).send("Invalid JWT token");
        }
    } else {
        res.sendStatus(HTTPStatus.UNAUTHORIZED);
    }
}