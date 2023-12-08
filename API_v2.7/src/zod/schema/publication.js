const { z } = require("zod");

module.exports.publicationIdSchema = z.object({
    publicationId: z.coerce.number().int(),
});

module.exports.publicationSchema = z.object({
    platform_code: z.string().trim(),
    video_game_id: z.coerce.number().int(),
    release_date: z.coerce.date(),
    release_price: z.coerce.number().optional().nullable(),
    store_page_url: z.string().trim().url().optional().nullable(),
});

module.exports.publicationToGetSchema = z.object({
    publicationId: z.coerce.number().int().optional(),
    videoGameId: z.coerce.number().optional(),
    videoGameName: z.string().optional(),
    platformCode: z.string().toUpperCase().optional(),
    getOwnGames: z
        .enum(["true", "false", "True", "False"])
        .transform((value) => value.toLowerCase() === "true")
        .optional(),
    alphabetical: z
        .enum(["true", "false", "True", "False"])
        .transform((value) => value.toLowerCase() === "true")
        .optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(50).optional(),
});
