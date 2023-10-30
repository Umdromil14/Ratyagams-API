const CategoryRouteur = require('./category.js');
const PublicationControleur = require('./publication.js');
const UserRouteur = require('./user.js');
const GameRouteur = require('./game.js');
const PlatformRouteur = require('./platform.js');
const TypeRouteur = require('./type.js');
const VideoGameRouteur = require('./videoGame.js');

const routeur = require("express").Router();

// routeur.use('/category', CategoryRouteur);
// routeur.use('/product', ProductRouteur);
routeur.use('/user', UserRouteur);
routeur.use('/game', GameRouteur);
routeur.use('/platform', PlatformRouteur);
// routeur.use('/type', TypeRouteur);
routeur.use('/videoGame', VideoGameRouteur);

module.exports = routeur;