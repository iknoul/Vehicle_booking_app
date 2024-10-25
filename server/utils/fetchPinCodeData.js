const https = require('https');

exports.fetchPinCodeData = (pincode) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            hostname: 'api.postalpincode.in',
            port: null,
            path: `/pincode/${pincode}`,  // Make sure this path is correct
            headers: {
                'Content-Type': 'application/json',
            },
        };

        console.log('Sending request to: ', options.hostname + options.path);  // Log the URL being requested

        const req = https.request(options, (res) => {
            const chunks = [];

            res.on('data', (chunk) => {
                chunks.push(chunk);
            });

            res.on('end', () => {
                const body = Buffer.concat(chunks).toString();
                // console.log('Received response:', body);  // Log the full response body
                resolve(body);
            });

            res.on('error', (err) => {
                console.error('Error occurred during API request:', err);  // Log any error
                reject(err);
            });
        });

        req.on('error', (e) => {
            console.error(`Request failed: ${e.message}`);  // Log request error if request fails to be sent
            reject(e);
        });

        req.end();
    });
};
