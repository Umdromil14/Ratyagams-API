const sharp = require("sharp");
const fs = require("fs");

/**
 * 
 * @param {Buffer} imageBuffer the image buffer to save
 * @param {string} imageName the name of the image to save
 * @param {string} destFolder the folder where the image will be saved
 * 
 * @returns {Promise} a promise that resolves when the image is saved
 */
module.exports.saveImageToPng = (imageBuffer, imageName, destFolder) => {
    return sharp(imageBuffer)
        .png({
            quality: 80,
        })
        .resize(500, 500, {fit: "inside"})
        .toFile(`${destFolder}/${imageName}.png`);
};

/**
 * 
 * @param {string} imageName the name of the image to delete 
 * @param {string} destFolder the folder where the image is located 
 */
module.exports.deleteImage = (imageName, destFolder) => {
    try {
        fs.unlinkSync(`${destFolder}/${imageName}.png`);
    } catch (err) {
        console.error(err);
    }
}