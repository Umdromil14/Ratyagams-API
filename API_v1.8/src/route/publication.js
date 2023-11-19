/**
 * @swagger
 * /publication:
 *  post:
 *       tags:
 *           - Publication
 *       description: Creating a new publication
 *       requestBody:
 *           $ref: '#/components/requestBodies/PublicationToAdd'
 *       responses:
 *           201:
 *               $ref: '#/components/responses/PublicationAdded'
 *           400:
 *               description: Invalid request body
 *           404:
 *               description: Platform code and/or video game id not found
 *           409:
 *               description: Publication already exists
 *           500:
 *               description: Internal server error
 */

/**
 * @swagger
 * /publication/{id}:
 *  delete:
 *      tags:
 *          - Publication
 *      description: Delete a publication
 *      parameters:
 *          - name: id
 *            description: The publication id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/PublicationDeleted'
 *          400:
 *              description: Id must be a number
 *          404:
 *              description: Publication not found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /publication/{id}:
 *  patch:
 *      tags:
 *          - Publication
 *      description: Update a publication
 *      parameters:
 *          - name: id
 *            description: The publication id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      requestBody:
 *          $ref: '#/components/requestBodies/PublicationToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/PublicationUpdated'
 *          400:
 *              description: Id must be a number and/or invalid request body
 *          404:
 *              description: Publication id and/or new platform code and/or new video game id not found
 *          409:
 *              description: Publication already exists with new platform code and/or new video game id
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /publication/{id}:
 *  get:
 *      tags:
 *          - Publication
 *      description: Get a publication
 *      parameters:
 *          - name: id
 *            description: The publication id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/PublicationFound'
 *          404:
 *              description: No publication found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /publication:
 *  get:
 *      tags:
 *          - Publication
 *      description: Get all publications
 *      responses:
 *          200:
 *              $ref: '#/components/responses/PublicationsFound'
 *          404:
 *              description: No publication found
 *          500:
 *              description: Internal server error
 */

const PublicationController = require('../controller/publication');
const Router = require("express-promise-router");
const router = Router();

// router.get("/", PublicationController.getPublications);
// router.get("/:id", PublicationController.getPublication);
router.get("/", PublicationController.getPublication);
router.post("/", PublicationController.createPublication);
router.patch("/:id", PublicationController.updatePublication);
router.delete("/:id", PublicationController.deletePublication);

module.exports = router;