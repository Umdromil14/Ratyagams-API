const sharp = require("sharp");

module.exports.saveImageToPng = (imageBuffer, imageName, destFolder) => {
    return sharp(imageBuffer)
        .png()
        .toFile(`${destFolder}/${imageName}.png`);
};

module.exports.saveImageToJpeg = (imageBuffer, imageName, destFolder) => {
    return sharp(imageBuffer)
        .jpeg()
        .toFile(`${destFolder}/${imageName}.jpeg`);
};
