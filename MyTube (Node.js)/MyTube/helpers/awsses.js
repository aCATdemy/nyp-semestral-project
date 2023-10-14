const AWS = require('aws-sdk');

const SES_CONFIG = {
	accessKeyId: 'AKIA2OAMIC7NBMOEYD55',
	secretAccessKey: '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',
	region: 'ap-southeast-1',
};

const AWS_SES = new AWS.SES(SES_CONFIG);

let sendEmail = (recipientEmail, name, comment, videotitle, datenow) => {
	let params = {
		Source: 'MyTube NYP Official <mytube.nyp@gmail.com>',
		Destination: {
			ToAddresses: [
				recipientEmail
			],
		},
		ReplyToAddresses: [],
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: `
            
            <p style="text-align:center;"><img src=https://i.ibb.co/fnQ4gXf/Screenshot-2022-07-07-162446.png width="140"><a src="localhost://5000"></a></img></p>
            <br><h1 style="text-align:center;">Your comment has been successfully posted on the video "${videotitle}".</h1>
            <br><h3 style="text-align:center;">You comment, "${comment}" has been successfully uploaded on the website.</h3>
            <br>
            <br>
            <br><h5 style="text-align:center;">Copyright © 2022 MyTube, All rights reserved.
            <br>230 Victoria Street, #15-01 Bugis Junction Towers
            <br>Singapore 188024
            <br>This Email was intended for ${recipientEmail}. If you are not the receipient, please ignore this email.
            <br>Email Sent: ${datenow}</h5>
            `,
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: `Your comment has been successfully posted, ${name}!`,
			}
		},
	};
	return AWS_SES.sendEmail(params).promise();
};

let sendDeleteEmail = (recipientEmail, name, comment, videotitle, datenow) => {
	let params = {
		Source: 'MyTube NYP Official <mytube.nyp@gmail.com>',
		Destination: {
			ToAddresses: [
				recipientEmail
			],
		},
		ReplyToAddresses: [],
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: `
            
            <p style="text-align:center;"><img src=https://i.ibb.co/fnQ4gXf/Screenshot-2022-07-07-162446.png width="140"><a src="localhost://5000"></a></img></p>
            <br><h1 style="text-align:center;">Your comment was deleted on the video "${videotitle}".</h1>
            <br><h3 style="text-align:center;">You comment, "${comment}" was deleted on the website.</h3>
            <br>
            <br>
            <br><h5 style="text-align:center;">Copyright © 2022 MyTube, All rights reserved.
            <br>230 Victoria Street, #15-01 Bugis Junction Towers
            <br>Singapore 188024
            <br>This Email was intended for ${recipientEmail}. If you are not the receipient, please ignore this email.
            <br>Email Sent: ${datenow}</h5>
            `,
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: `NOTICE: Your comment has been deleted, ${name}!`,
			}
		},
	};
	return AWS_SES.sendEmail(params).promise();
};

// let sendTemplateEmail = (recipientEmail, rawcomment, rawusername) => {
// 	let params = {
// 		Source: 'My Tube <mytube.nyp@gmail.com>',
// 		Template: 'MyTemplate',
// 		Destination: {
// 			ToAddresses: [
// 				recipientEmail
// 			]
// 		},
// 		TemplateData: { "imageurl": "../public/images/logo.png", "comment": rawcomment, 'username': rawusername }
// 	};
// 	return AWS_SES.sendTemplatedEmail(params).promise();
// };


module.exports = {
	sendEmail, sendDeleteEmail
};