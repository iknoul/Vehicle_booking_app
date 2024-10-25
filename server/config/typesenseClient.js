const Typesense = require('typesense')
require('dotenv').config({ path: './../.env' });

const host = process.env.TYPESENSE_HOST
const apiKey = process.env.TYPESENSE_KEY
const port = process.env.TYPESENSE_PORT
const protocol = process.env.TYPESENSE_PROTOCOL


const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: host || 'yo4dqupe9r6w30sxp-1.a1.typesense.net',  // Replace with your server host
      port: port || '443',  // Replace with your server port
      protocol: protocol || 'https',  // Replace with your protocol
    },
  ],
  apiKey: apiKey || 'BIEYSy1biUdPOs4WHCIOHLBx43sZgtps',  // Replace with your actual API key
  connectionTimeoutSeconds: 2,
});

module.exports = typesenseClient;
