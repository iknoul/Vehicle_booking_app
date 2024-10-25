const https = require('https');

function fetchPincodeData(pincode) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            hostname: 'api.postalpincode.in',
            port: null,
            path: `/pincode/${pincode}`,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            const chunks = [];

            res.on('data', (chunk) => {
                chunks.push(chunk);
            });

            res.on('end', () => {
                const body = Buffer.concat(chunks).toString();
                resolve(body);
            });

            res.on('error', (err) => {
                reject(err);
            });
        });

        req.end();
    });
}

export default fetchPincodeData