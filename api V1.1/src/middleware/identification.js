const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.identification = (req, res, next) => {
    let token = req.get('Authorization');
    if (!token){
        return res.status(401).send('No token provided');
    }
    if (token.includes("Bearer")){
        token = token.split(" ")[1];
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.session = user;
    next();
}