Pour lancer l'API, il faut suivre ces différentes étapes:

    - déplacer le fichier .env à l'intérieur du folder API;
    - créer une copie du dossier "pictures" et le glisser dans le dossier "APIv1.0", à côté du dossier src;
    - ouvrir le code du folder API dans votre IDE préféré;
    - ouvrir docker desktop;
    - une fois docker lancé, ouvrir un terminal dans votre IDE préféré;
    - une fois le terminal lancé, écrire "npm install" suivit de la touche 'enter';
    - puis écrire "npm run docker" suivit de la touche 'enter';
    - ensuite écrire "npm run initDBv1" suivit de la touche 'enter';
    - et enfin, écrire "npm run dev" pour lancer l'API.

Pour lancer postman, il faut suivre ces différentes étapes: 

    - réinitialiser la base de données avec le npm run initDBv1 dans l'api;
    - Importer le fichier postman;
    - Aller dans les settings, aller dans général et regarder ou est localisé le working directory;
    - Mettre dans ce fichier une image de votre choix;
    - fermer les paramètres ;
    - aller dans la collection API/platform/post/postPlatform;
    - aller dans body et selectionner form-data pour modifier la valeur de la clé "picture" par l'image déposée dans le working directory;
    - avant de lancer la collection, mettre un delay de 50MS;
    - lancer la collection de l'api et non pas fichier par fichier.

Bon courage !
Signé par l'équipe des trolls ( Cyril, Cédric et Nathan )
