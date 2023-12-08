const { z } = require("zod");

module.exports.getVideoGameSchema = z.object({
    id : z.coerce.number().int().optional(),
    name : z.string().optional(),
    page : z.coerce.number().int().optional(),
    limit : z.coerce.number().int().optional(),
});

module.exports.videoGameSchema = z.object({
    name : z.string().trim().min(1,{
        message : "Name must be at least 1 character long"
    }),
    description : z.string().trim(),
});


