/**
 * Autorization middleware to know if the user is admin or not
 * 
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * 
 * @returns {void}
 */
const HTTPStatus = require("../tools/HTTPStatus.js");
module.exports.autorization = (req, res, next) => {
    if (req.session.data.is_admin) {
        next();
    } else {
        //! faire un if pour certaines routes ??
        res.sendStatus(HTTPStatus.UNAUTHORIZED);
    }
}