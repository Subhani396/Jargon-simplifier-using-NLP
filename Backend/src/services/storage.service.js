const { ImageKit } = require("@imagekit/nodejs/index.js");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

async function uploadFile(buffer) {
    const result = await imagekit.files.upload({
        file: buffer.toString('base64'),
        fileName: "image.jpg"
    })
    return result;
}

module.exports = uploadFile;