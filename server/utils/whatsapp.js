const request = require('request')
require('dotenv').config();

const WHATSAPP_URL = (process.env.WHATSAPP_URL)
const WHATSAPP_TOKEN = (process.env.WHATSAPP_TOKEN)
exports.sendMsg = (to, message)=>{
	const o = "jhl"
	const options = {
		method: 'POST',
		url: WHATSAPP_URL,
		headers: { 'content-type': ' application/x-www-form-urlencoded' },
		form: {
			token: WHATSAPP_TOKEN,
			to: `+91 ${to}`,
			body: message,o
		},
	}
	request(options, function (error, response, body) {
		if (error) throw new Error(error)
	})
}