const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const User = require('../models/User');
const Post = require('../models/Post');
const PostFile = require('../models/PostFile');
const Subscriber = require('../models/Subscribers')
const { Op } = require("sequelize");

router.get('/', async (req, res) => {
	let posts = await Post.findAll({
		where: {
			deletedAt: null,
		},
		include: [PostFile, User],
		order: [['updatedAt', 'DESC'], [PostFile, 'id', 'ASC']],
		nest: true,
	})
	posts = posts.map((post) => post.get({ plain: true }));

	Video.findAll({
		order: [['createdAt', 'DESC']],
		include: [{
			model: User
		}],
		where: {
			videostatusId: {
				[Op.ne]: 2
			}
		}

	})
		.then(async (videos) => {
			// subcount.forEach(element => {
			// 	console.log(element)
			// });
			res.render('index', {
				videos,
				posts,
				user: req.user,
				title: 'MyTube – Upload & Share Videos™'
			});
		})
		.catch(err => console.log(err));

});

router.get('/:sort', async (req, res) => {
	if (req.params.sort) {
		if (req.params.sort == 1) {
			order = [{ model: User, }, 'subcount', 'DESC']
		}
		else if (req.params.sort == 2) {
			order = ['createdAt', 'DESC']
		}
		else if (req.params.sort == 3) {
			order = ['createdAt', 'ASC']
		}
		else {
			var order = ['createdAt', 'DESC']
		}
	}
	else {
		var order = ['createdAt', 'DESC']
	}
	let posts = await Post.findAll({
		where: {
			deletedAt: null,
		},
		include: [PostFile, User],
		order: [['updatedAt', 'DESC'], [PostFile, 'id', 'ASC']],
		nest: true,
	})
	posts = posts.map((post) => post.get({ plain: true }));

	Video.findAll({
		order: [order],
		include: [{
			model: User
		}],
		where: {
			videostatusId: {
				[Op.ne]: 2
			}
		}

	})
		.then(async (videos) => {
			// subcount.forEach(element => {
			// 	console.log(element)
			// });
			res.render('index', {
				videos,
				posts,
				user: req.user,
				title: 'MyTube – Upload & Share Videos™'
			});
		})
		.catch(err => console.log(err));

});

router.get('/terms-of-use', (req, res) => {
	res.render('terms-of-use', {
		title: 'Terms of Use | MyTube'
	});
});

router.get('/privacy-policy', (req, res) => {
	res.render('privacy-policy', {
		title: 'Privacy Policy | MyTube'
	});
});

module.exports = router;