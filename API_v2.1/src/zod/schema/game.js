const { z } = require('zod');

module.exports.gameIdsSchema = z.object({
    userId: z.coerce.number().int(),
    publicationId: z.coerce.number().int()
});

module.exports.gameSchema = z.object({
    user_id: z.number().int(),
    publication_id: z.number().int(),
    is_owned: z.boolean().optional(),
    review_rating: z.number().int().min(0).max(5).optional().nullable(),
    review_comment: z.string().trim().optional().nullable(),
    review_date: z.coerce.date().max(new Date()).optional().nullable()
});