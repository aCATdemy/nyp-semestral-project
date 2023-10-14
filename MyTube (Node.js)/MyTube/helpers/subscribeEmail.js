const AWS = require('aws-sdk');

const SES_CONFIG = {
	accessKeyId: 'AKIA2OAMIC7NBMOEYD55',
	secretAccessKey: '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',
	region: 'ap-southeast-1',
};

const AWS_SES = new AWS.SES(SES_CONFIG);

let sendEmail = (email, sub, subbedto) => {        // Parameters to pass it inside the brackets, make match the one passed in routes.
	let params = {
		Source: 'MyTube <mytube.nyp@gmail.com>',
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
						<h2>Someone has Subscribed to you!</h2>
						<p>Congratulations keep it up!</p>
						
                        <p>${sub} has subbed to ${subbedto}<- thats you!</p>
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
				Data: `${sub} has subscribed to you`
			}
		},
	};
	return AWS_SES.sendEmail(params).promise();
};

module.exports = {
	sendEmail,
};