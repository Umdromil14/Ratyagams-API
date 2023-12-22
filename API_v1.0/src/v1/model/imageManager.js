const sharp = require("sharp");
const fs = require("fs");

/**
 * Saves an image to a png file
 * 
 * @param {Buffer} imageBuffer the image buffer to save
 * @param {string} imageName the name of the image to save
 * @param {string} destFolder the folder where the image will be saved
 * 
 * @returns {Promise<void>}
 */
module.exports.saveImageToPng = async (imageBuffer, imageName, destFolder) => {
    await sharp(imageBuffer)
        .png({
            quality: 80,
        })
        .resize(500, 500, {fit: "inside"})
        .toFile(`${destFolder}/${imageName}.png`);
};

/**
 * Deletes an image; if the image does not exist, nothing happens
 * 
 * @param {string} imageName the name of the image to delete 
 * @param {string} destFolder the folder where the image is located 
 * 
 * @returns {void}
 */
module.exports.deleteImage = (imageName, destFolder) => {
    if (fs.existsSync(`${destFolder}/${imageName}.png`)) {
        fs.unlinkSync(`${destFolder}/${imageName}.png`);
    }
}

/**
 * Modifies the name of an image; if the image does not exist, nothing happens
 * 
 * @param {string} imageName the name of the image to modify
 * @param {string} newImageName the new name of the image
 * @param {string} destFolder the folder where the image is located
 * 
 * @returns {void}
 */
module.exports.modifyImageName = (imageName, newImageName, destFolder) => {
    if (fs.existsSync(`${destFolder}/${imageName}.png`)) {
        fs.renameSync(`${destFolder}/${imageName}.png`, `${destFolder}/${newImageName}.png`);
    }
}