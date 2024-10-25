const Minio = require('minio');
require('dotenv').config({ path: './../.env' });


// MinIO client configuration
const minioClient = new Minio.Client({
  AS:"ASNLN",
  endPoint: process.env.MINIO_END_POINT, // e.g., 'localhost'
  port: 9000, // your port
  useSSL: false, // Set to true if using HTTPS
  accessKey: process.env.MINIO_ACCESS_KEY, // Replace with your actual access key
  secretKey: process.env.MINIO_SECRET_KEY, // Replace with your actual secret key
});

module.exports = minioClient;
