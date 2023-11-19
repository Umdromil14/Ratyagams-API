const { z } = require('zod');

module.exports.publicationToGetSchema = z.object({
    publicationId: z.coerce.number().int().optional(),
    videoGameId: z.coerce.number().optional(),
    videoGameName: z.string().optional(),
    platformCode: z.string().toUpperCase().optional()
});