const { z } = require("zod");

module.exports.loginSchema = z.object({
    login: z.string().trim(),
    password : z.string().trim(),
});

module.exports.userSchema = z.object({
    username : z.string().trim().regex(/^((?!@).)*$/,{
        message : "Username cannot contain @"
    }).min(3, {
        message : "Username must contain at least 3 characters"
    }).max(20, {
        message : "Username must contain at most 20 characters"
    }),
    email : z.string().email().trim().regex(/^((?!\+).)*$/,{
        message : "Email cannot contain +"
    }),
    password : z.string().min(8,{
        message : "Password must contain at least 8 characters"
    }).trim().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]*).{8,}$/,{
        message : "Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters"
    }),
    firstname : z.string().trim().regex(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/,{
        message : "Firstname must contain only letters"
    }).optional().nullable().default(null),
    lastname : z.string().trim().regex(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/,{
        message : "Lastname must contain only letters"
    }).optional().nullable().default(null),
    is_admin : z.boolean().optional().default(false),
});

module.exports.updateUserSchema = z.object({
    username : z.string().trim().regex(/^((?!@).)*$/,{
        message : "Username cannot contain @"
    }).min(3,{
        message : "Username must contain at least 3 characters"
    }).max(20,{
        message : "Username must contain at most 20 characters"
    }).optional(),
    email : z.string().email().trim().regex(/^((?!\+).)*$/,{
        message : "Email cannot contain +"
    }).optional(),
    password : z.string().min(8,{
        message : "Password must contain at least 8 characters"
    }).trim().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]*).{8,}$/,{
        message : "Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters"
    }).optional(),
    firstname : z.string().trim().regex(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/,{
        message : "Firstname must contain only letters"
    }).optional().nullable(),
    lastname : z.string().trim().regex(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/,{
        message : "Lastname must contain only letters"
    }).optional().nullable(),
    is_admin : z.boolean().optional(),
});

module.exports.updateMyAccountSchema = z.object({
    username : z.string().trim().regex(/^((?!@).)*$/,{
        message : "Username cannot contain @"
    }).optional(),
    email : z.string().email().trim().optional(),
    firstname : z.string().trim().regex(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/,{
        message : "Firstname must contain only letters"
    }).optional().nullable(),
    lastname : z.string().trim().regex(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/,{
        message : "Lastname must contain only letters"
    }).optional().nullable(),
});

module.exports.userWithGamesSchema = z.object({
    username : z.string().trim().regex(/^((?!@).)*$/,{
        message : "Username cannot contain @"
    }).min(3,{
        message : "Username must contain at least 3 characters"
    }).max(20,{
        message : "Username must contain at most 20 characters"
    }),
    email : z.string().email().trim(),
    password : z.string().min(8,{
        message : "Password must contain at least 8 characters"
    }).trim().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]*).{8,}$/,{
        message : "Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters"
    }),
    firstname : z.string().trim().regex(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/,{
        message : "Firstname must contain only letters"
    }).optional().nullable().default(null),
    lastname : z.string().trim().regex(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/,{
        message : "Lastname must contain only letters"
    }).optional().nullable().default(null),
    is_admin : z.boolean().optional().default(false),
    publications_ids : z.coerce.number().array().nonempty()
});