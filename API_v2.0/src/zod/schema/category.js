const { z } = require('zod');

module.exports.categoryIdsSchema = z.object({
    typeId: z.coerce.number().int(),
    videoGameId: z.coerce.number().int()
});

module.exports.categorySchema = z.object({
    type_id: z.number().int(),
    video_game_id: z.number().int()
});