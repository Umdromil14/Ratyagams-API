const { z } = require('zod');

module.exports.publicationIdSchema = z.object({
    publicationId: z.coerce.number().int()
});

module.exports.publicationSchema = z.object({
    publication_id: z.coerce.number().int(),
    platform_code: z.string().trim(),
    video_game_id: z.coerce.number().int(),
    release_date: z.coerce.date(),
    release_price: z.coerce.number().optional().nullable(),
    store_page_url: z.string().trim().url().optional().nullable()
});

module.exports.publicationToGetSchema = z.object({
    publicationId: z.coerce.number().int().optional(),
    videoGameId: z.coerce.number().optional(),
    videoGameName: z.string().optional(),
    platformCode: z.string().toUpperCase().optional()
});