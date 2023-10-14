const express = require('express');
const router = express.Router();
const moment = require('moment');
const Video = require('../models/Video');
const ensureAuthenticated = require('../helpers/auth');
const flashMessage = require('../helpers/messenger');
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const upload = require('../helpers/imageUpload');
const videoUpload = require('../helpers/videoUpload')
const { title } = require('process');
const User = require('../models/User')
const Comment = require('../models/Comment');
const Subscriber = require('../models/Subscribers')
const sesemail = require('../helpers/awsses')
const Nexmo = require('nexmo');
const Subscribers = require('../models/Subscribers');
const e = require('connect-flash');
const sequelize = require('sequelize');
const { userInfo } = require('os');
const Op = sequelize.Op;

router.post('/searchResults', (req, res) => {
    let query = req.body.query;
    if (req.user?.roletypeId == 2) {
        Video.findAll({
            where: {
                title: { [Op.like]: `%${query}%` },
            },
            paranoid: false,
            order: [['createdAt', 'DESC']],
            raw: true
        })
            .then((videos) => {
                // pass object to results.handlebar
                res.render('video/searchResults', {
                    videos,
                });
            })
            .catch(err => console.log(err));
    }
    else {
        Video.findAll({
            where: {
                title: { [Op.like]: `%${query}%` },
                videostatusId: {
                    [Op.ne]: 2
                }
            },

            order: [['createdAt', 'DESC']],
            raw: true
        })
            .then((videos) => {
                // pass object to results.handlebar
                res.render('video/searchResults', {
                    videos,
                });
            })
            .catch(err => console.log(err));
    }
});


module.exports = router;