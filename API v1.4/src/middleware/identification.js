const jwt = require('jsonwebtoken');
require('dotenv').config();

const HTTPStatus = require("../tools/HTTPStatus.js")

/**
 * Identification middleware for the user or admin session
 * 
 * @param {Request} req all the information of the user 
 * @param {Response} res 
 * @param {Function} next send to the next function 
 * 
 * @returns {void} 
 */
module.exports.identification = (req, res, next) => {
    let token = req.get('Authorization');
    if (!token){
        return res.status(HTTPStatus.UNAUTHORIZED).send('No token provided');
    }
    if (token.includes("Bearer")){
        token = token.split(" ")[1];
    } else {
        res.status(HTTPStatus.UNAUTHORIZED).send('invalid token');
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.session = user;
    next();
}