const { z } = require('zod');

module.exports.genreSchema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim()
});

module.exports.genreToGetSchema = z.object({
    id: z.coerce.number().optional(),
    alphabetical: z
        .enum(["true", "false", "True", "False"])
        .transform((value) => value.toLowerCase() === "true")
        .optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(50).optional()
});