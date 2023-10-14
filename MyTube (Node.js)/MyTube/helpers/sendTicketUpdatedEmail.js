const AWS = require('aws-sdk');

const SES_CONFIG = {
	accessKeyId: 'AKIA2OAMIC7NBMOEYD55',
	secretAccessKey: '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',
	region: 'ap-southeast-1',
};

const AWS_SES = new AWS.SES(SES_CONFIG);

let sendEmail = (ticketSubject, username, ticketCategory, ticketMessage, conversation) => {
	let params = {
		Source: 'MyTube Support <mytube.nyp@gmail.com>',
		Destination: {
			ToAddresses: [
				"mytube.nyp@gmail.com"
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
						<h2>TICKET UPDATED</h2>
						<p>Please be informed of an updated support ticket that requires your attention.</p>
						<p style="font-weight: bold;">Below are the details:</p>
                        <p>
							<span style="font-weight: bold;">Newest Reply: </span>${conversation}
						</p>
                        <br>
						<p>
							<span style="font-weight: bold;">Ticket Opened By: </span>${username}
						</p>
						<p>
							<span style="font-weight: bold;">Subject: </span>${ticketSubject}
						</p>
						<p>
							<span style="font-weight: bold;">Category: </span>${ticketCategory}
						</p>
						<p>
							<span style="font-weight: bold;">Original Message: </span>${ticketMessage}
						</p>
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