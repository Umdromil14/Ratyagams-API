/**
 * @swagger
 * components:
 *  responses:
 *      MustBeAdmin:
 *          description: Must be an admin to access this route
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
    if (req.session !== undefined && req.session.data.isAdmin) {
        next();
    } else {
        res.sendStatus(HTTPStatus.FORBIDDEN);
    }
}