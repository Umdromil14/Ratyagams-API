module.exports.autorization = (req, res, next) => {
    if (req.session.data.is_admin) {
        next();
    } else {
        res.sendStatus(401);
    }
}