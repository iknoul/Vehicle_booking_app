import https from 'https';

function fetchPincodeData(pincode: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const options: https.RequestOptions = {
            method: 'GET',
            hostname: 'api.postalpincode.in',
            port: undefined,
            path: `/pincode/${pincode}`,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            const chunks: Buffer[] = [];

            res.on('data', (chunk: Buffer) => {
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

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
}

export default fetchPincodeData;
