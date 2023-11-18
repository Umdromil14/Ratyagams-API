const { z } = require("zod");

module.exports.platformSchema = z.object({
    code: z.string().trim().toUpperCase(),
    description: z.string().trim()
});

module.exports.platformToUpdateSchema = z.object({
    code: z.string().trim().toUpperCase().optional(),
    description: z.string().trim().optional()
});

module.exports.platformWithVideoGamesSchema = z.object({
    code: z.string().toUpperCase().trim(),
    description: z.string().trim(),
    video_games: z.array(z.object({
        name: z.string().trim(),
        description: z.string().trim(),
        release_date: z.string().trim()
            .regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, {
                message: "Invalid date, expected format: YYYY-MM-DD"
            }),
        release_price: z.number().optional().nullable(),
        store_page_url: z.string().trim().url().optional().nullable()
    }))
});