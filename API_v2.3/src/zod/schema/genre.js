const { z } = require('zod');

module.exports.genreSchema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim()
});

module.exports.genreToGetSchema = z.object({
    id: z.coerce.number().optional()
});