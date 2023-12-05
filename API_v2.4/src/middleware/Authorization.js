/**
 * @swagger
 * components:
 *  responses:
 *      MustBeAdmin:
 *          description: AUTH_LEVEL_NOT_SUFFICIENT
 */

const HTTPStatus = require("../tools/HTTPStatus.js");

/**
 * Autorization middleware to know if the user is admin or not
 * 
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * 
 * @returns {void}
 */
module.exports.mustBeAdmin = (req, res, next) => {
    if (req.session !== undefined && req.session.isAdmin) {
        next();
    } else {
        res.status(HTTPStatus.FORBIDDEN).json({
            code: "AUTH_LEVEL_NOT_SUFFICIENT",
            message: "Must be an admin to access this route",
        });
    }
}