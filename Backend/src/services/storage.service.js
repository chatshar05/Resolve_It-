const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadImage(file){

  if(!file) return null;

  const result = await imagekit.upload({
    file: file.buffer.toString("base64"),
    fileName: "complaint_" + Date.now(),
    folder: "resolve-it/complaints"
  });

  return result.url;
}

module.exports = { uploadImage };