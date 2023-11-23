const { z } = require('zod');

module.exports.typeSchema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim()
});

module.exports.getTypeSchema = z.object({
    id: z.coerce.number().optional()
});