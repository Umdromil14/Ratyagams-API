const { z } = require("zod");

module.exports.loginSchema = z.object({
    login: z.string().trim(),
    password: z.string().min(8).trim(),
});

module.exports.userSchema = z.object({
    username : z.string().trim().regex(/^((?!@).)*$/,{
        message : "Username cannot contain @"
    }),
    email : z.string().email().trim(),
    password : z.string().min(8,{
        message : "Password must contain at least 8 characters"
    }).trim().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]*).{8,}$/,{
        message : "Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters"
    }),
    firstname : z.string().trim().regex(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/,{
        message : "Firstname must contain only letters"
    }).optional().nullable(),
    lastname : z.string().trim().regex(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/,{
        message : "Lastname must contain only letters"
    }).optional().nullable(),
    isAdmin : z.boolean().optional(),
});

module.exports.updateMyAccountSchema = z.object({
    username : z.string().trim().optional(),
    email : z.string().email().trim().optional(),
    firstname : z.string().trim().optional().nullable(),
    lastname : z.string().trim().optional().nullable(),
});

module.exports.UserWithGamesSchema = z.object({
    username : z.string().trim(),
    email : z.string().email().trim(),
    password : z.string().min(8).trim(),
    firstname : z.string().trim().optional().nullable(),
    lastname : z.string().trim().optional().nullable(),
    isAdmin : z.boolean().optional(),
    publicationsId : z.coerce.number().array()
});