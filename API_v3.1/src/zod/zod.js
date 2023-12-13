const { z } = require("zod");

/**
 * Validate the object if it matches the zod schema
 *
 * @param {Object} object the object to validate
 * @param {z.ZodObject} schema the zod schema
 *
 * @returns {Object} the validated object
 *
 * @throws {Error} if the object doesn't match the schema
 */
module.exports.validateObject = (object, schema) => {
    const result = schema.safeParse(object);
    if (!result.success) {
        throw new Error(
            result.error.issues
                .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
                .join("; ")
        );
    }
    return result.data;
};
