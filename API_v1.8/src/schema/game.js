const { z } = require('zod');

module.exports.gameToGetSchema = z.object({
    userId: z.coerce.number().int().optional(),
    publicationId: z.coerce.number().int().optional()
});