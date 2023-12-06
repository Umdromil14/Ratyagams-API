const { z } = require('zod');

module.exports.paginationSchema = z.object({
    page : z.coerce.number().int().positive().optional().default(1),
    limit : z.coerce.number().int().positive().optional().default(10),
});