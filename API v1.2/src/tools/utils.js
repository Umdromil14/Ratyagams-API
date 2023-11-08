/**
 * Check if the object respects the model
 * @param {Object} obj the object to check
 * @param {Object} model the model (key: name of the column, value: array of types authorized in string ())
 * @returns 
 */
module.exports.isValidObject = (obj, model) => {
    for (const key in model) {
        if (!obj[key]) {
            if (!model[key].includes("optional")) {
                return false;
            }
        } else if (!model[key].includes(typeof obj[key])) {
            return false;
        }
    }

    return true;
}

module.exports.isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9_.À-ú+-]+@[a-zA-ZÀ-ú0-9]+\.[a-zA-Z]+$/;
    return regex.test(email);
}