/**
 * Validates whether an object matches a given model structure
 *
 * @param {Object} object The object to validate
 * @param {Object} model The model structure to compare against; key: defines if this key must be present in the object, value: array of types authorized for the value of this key (add "optional" to the array if the key is optional)
 * @param {boolean} [atLeastOneOptionalKey=false] A flag indicating if at least one optional key must be present; defaults to `false`
 *
 * @returns {boolean} Returns `true` if the object is valid according to the model; otherwise, `false`
 *
 * @example
 * // Example 1: Valid object
 * const model = {
 *     type_id: ["number"],
 *     video_game_id: ["number"],
 *     rating: ["number", "optional"],
 *     is_new: ["boolean", "number", "optional"]
 * };
 *
 * const objectToValidate = {
 *     type_id: 1,
 *     video_game_id: 2,
 *     is_new: 3,
 * };
 *
 * const isValid = isValidObject(objectToValidate, model, true);
 * // isValid = true
 * 
 * @example
 * // Example 2: Invalid object
 * const model = {
 *     type_id: ["number"],
 *     video_game_id: ["number"],
 *     rating: ["number", "optional"],
 *     is_new: ["boolean", "number", "optional"]
 * };
 *
 * const objectToValidate = {
 *     type_id: "1",
 *     video_game_code: "hallo",
 * };
 *
 * const isValid = isValidObject(objectToValidate, model, true);
 * // isValid = false (type_id is not a number, video_game_id is missing, one optional key is missing)
 */
module.exports.isValidObject = (object, model, atLeastOneOptionalKey = false) => {
    let optionalKeys = 0;

    for (const key in model) {
        if (!object[key]) {
            if (!model[key].includes("optional")) {
                return false;
            }
        } else if (!model[key].includes(typeof object[key])) {
            return false;
        } else if (model[key].includes("optional")) {
            optionalKeys++;
        }
    }

    if (atLeastOneOptionalKey && optionalKeys === 0) {
        return false;
    }

    return true;
}

module.exports.isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9_.À-ú+-]+@[a-zA-ZÀ-ú0-9]+\.[a-zA-Z]+$/;
    return regex.test(email);
}