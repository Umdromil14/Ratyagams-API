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
    genresIds: z
        .string()
        .regex(/^[0-9]+(,[0-9]+)*$/, {
            message:
                "Invalid genresIds must be a list of numbers separated by a comma",
        })
        .transform((value) => value.split(",").map((id) => parseInt(id)))
        .optional(),
    getOwnGames: z
        .enum(["true", "false", "True", "False"])
        .transform((value) => value.toLowerCase() === "true")
        .optional(),
    getLastGames: z
        .enum(["true", "false", "True", "False"])
        .transform((value) => value.toLowerCase() === "true")
        .optional(),
    getVideoGamesInfo: z
        .enum(["true", "false", "True", "False"])
        .transform((value) => value.toLowerCase() === "true")
        .optional(),
    alphabetical: z
        .enum(["true", "false", "True", "False"])
        .transform((value) => value.toLowerCase() === "true")
        .optional(),
    sortByDate: z
        .enum(["true", "false", "True", "False"])
        .transform((value) => value.toLowerCase() === "true")
        .optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
});