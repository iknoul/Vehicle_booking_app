const path = require('path'); 
const fs = require('fs');

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

// Common function to handle image uploads
const uploadImage = async (image, prefix = 'image') => {
  if (!image) return null;
  const { createReadStream, filename } = await image;
  const stream = createReadStream();
  const imageUrl = path.join(__dirname, 'uploads', `${prefix}_${Date.now()}_${filename}`);
  
  ensureDirectoryExistence(imageUrl);

  await new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(imageUrl);
    stream.pipe(writeStream);
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  return imageUrl;
};

module.exports = uploadImage;
