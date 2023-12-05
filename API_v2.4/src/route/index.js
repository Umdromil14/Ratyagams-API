const CategoryRouter = require('./category.js');
const PublicationRouter = require('./publication.js');
const UserRouter = require('./user.js');
const GameRouter = require('./game.js');
const PlatformRouter = require('./platform.js');
const GenreRouter = require('./genre.js');
const VideoGameRouter = require('./videoGame.js');

const router = require("express").Router();

router.use('/category', CategoryRouter);
router.use('/user', UserRouter);
router.use('/game', GameRouter);
router.use('/platform', PlatformRouter);
router.use('/publication', PublicationRouter);
router.use('/genre', GenreRouter);
router.use('/videoGame', VideoGameRouter);

module.exports = router;