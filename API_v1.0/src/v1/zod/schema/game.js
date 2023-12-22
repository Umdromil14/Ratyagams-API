const { z } = require('zod');

module.exports.gameToGetSchema = z.object({
    userId: z.coerce.number().int(),
    publicationId: z.coerce.number().int(),
    videoGameId: z.coerce.number().int().optional(),
    page : z.coerce.number().int().min(1).optional(),
    limit : z.coerce.number().int().min(1).max(50).optional()
});

module.exports.gameSchema = z.object({
    user_id: z.number().int(),
    publication_id: z.number().int(),
    is_owned: z.boolean().optional(),
    review_rating: z.number().int().min(0).max(5).optional().nullable(),
    review_comment: z.string().trim().max(5000).optional().nullable(),
    review_date: z.coerce.date().max(new Date()).optional().nullable()
});