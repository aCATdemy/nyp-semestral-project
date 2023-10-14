const AWS = require('aws-sdk');

const SES_CONFIG = {
	accessKeyId: 'AKIA2OAMIC7NBMOEYD55',
	secretAccessKey: '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',
	region: 'ap-southeast-1',
};

const AWS_SES = new AWS.SES(SES_CONFIG);

let sendEmail = (ticketSubject, email) => {
	let params = {
		Source: 'MyTube Support <mytube.nyp@gmail.com>',
		Destination: {
			ToAddresses: [
				email
			]
		},
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: `
					<div style="text-align: center;">
						<a href="localhost:5000">
							<img src=https://i.ibb.co/fnQ4gXf/Screenshot-2022-07-07-162446.png width="140">
						</a>
						<h2>YOUR TICKET HAS BEEN UPDATED</h2>
						<p>Please be informed of a reply to your support ticket.</p>
						<p>
							<span style="font-weight: bold;">Subject: </span>${ticketSubject}
						</p>
                        <p>For confidentiality reasons, please kindly login on our website to view the details.</p>
						<hr>
						<small>Copyright &copy; 2022 MyTube</small>
						<br>
						<small>230 Victoria Street, #15-01 Bugis Junction Towers</small>
						<br>
						<small>Singapore 188024</small>
						<hr>
						<small style="font-weight: bold;">WARNING: The information in this email is confidential and may be privileged or subject to copyright.</small>
					</div>
					`,
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: `TICKET UPDATED: ${ticketSubject}`
			}
		},
	};
	return AWS_SES.sendEmail(params).promise();
};

module.exports = {
	sendEmail,
};