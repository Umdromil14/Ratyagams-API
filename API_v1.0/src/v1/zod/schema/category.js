const { z } = require('zod');

module.exports.categoryIdsSchema = z.object({
    genreId: z.coerce.number().int(),
    videoGameId: z.coerce.number().int()
});

module.exports.getCategorySchema = z.object({
    genreId: z.coerce.number().int().optional(),
    videoGameId: z.coerce.number().int().optional(),
    page : z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).optional()
});

module.exports.categorySchema = z.object({
    genre_id: z.number().int(),
    video_game_id: z.number().int()
});
