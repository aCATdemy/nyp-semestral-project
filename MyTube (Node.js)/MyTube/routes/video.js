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
const Like = require('../models/Like')
const sesemail = require('../helpers/awsses')
const Nexmo = require('nexmo');
const e = require('connect-flash');
const { Console } = require('console');
const sequelize = require('../config/DBConfig');
const { Op } = require("sequelize");
const path = require('path');
const Videostatus = require('../models/VideoStatus');
const sendEmail = require('../helpers/subscribeEmail');
const { SlowBuffer } = require('buffer');
const nexmo = new Nexmo({
    apiKey: '8922afa7',
    apiSecret: "vEzkAXUcV6m2WcnFjuKRA2W4"
});


function capitalizeFirstLetter(str) {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
}

router.get('/listVideos', ensureAuthenticated, (req, res) => {
    Video.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']],
        raw: true
    })
        .then((videos) => {
            // pass object to listVideos.handlebar
            res.render('video/listVideos', {
                videos,
                title: 'My Videos | MyTube'
            });
        })
        .catch(err => console.log(err));
});

router.get('/addVideo', ensureAuthenticated, (req, res) => {
    res.render('video/addVideo', {
        title: 'Video Upload | MyTube'
    });
});

router.post('/addVideo', ensureAuthenticated, (req, res) => {
    let title = req.body.title;
    let description = req.body.description.slice(0, 1999);
    let posterURL = req.body.posterURL;
    let videoURL = req.body.videoURL
    let status = 1

    // Multi-value components return array of strings or undefined
    let userId = req.user.id;

    Video.create(
        { title, description, userId, posterURL, videoURL, videostatusId: 1 }
    )
        .then((video) => {
            console.log(video.toJSON());
            res.redirect('/video/listVideos');
        })
        .catch(err => console.log(err))
});

router.post('/upload', ensureAuthenticated, (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/thumnnails/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/thumbnails/' + req.user.id, {
            recursive:
                true
        });
    }
    upload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ file: '/img/no-image.jpg', err: err });
        }
        else {
            try {
                res.json({
                    file: `/uploads/thumbnails/${req.user.id}/${req.file.filename}`
                });
            }
            catch {
                res.json({ file: null })
            }
        }
    });
});
router.get('/deleteThumbnail/:id', ensureAuthenticated, async (req, res) => {
    try {
        let video = await Video.findOne({ where: { id: req.params.id } })
        await video.update({ posterURL: null })
        res.redirect('back')
    }
    catch {
        flashMessage(res, 'error', 'Thumbnail not found');
        res.redirect('back')
    }
});

router.post('/uploadVideo', ensureAuthenticated, (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/video/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/video/' + req.user.id, {
            recursive:
                true
        });
    }
    videoUpload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ file: '/img/no-image.jpg', err: err });
        }
        else {
            res.json({
                file: `/uploads/video/${req.user.id}/${req.file.filename}`
            });
        }
    });
});

router.get('/editVideo/:id', ensureAuthenticated, (req, res) => {
    Video.findByPk(req.params.id)
        .then((video) => {
            if (!video) {
                flashMessage(res, 'error', 'Video not found');
                res.redirect('/video/listVideos');
                return;
            }
            if (req.user.id != video.userId && req.user.roletypeId != 2) {
                flashMessage(res, 'error', 'Unauthorised access');
                res.redirect('/video/listVideos');
                return;
            }
            res.render('video/editVideo', {
                video,
                title: video.title + ' | MyTube Video Editor'
            });
        })
        .catch(err => console.log(err));
});

router.post('/editVideo/:id', ensureAuthenticated, async (req, res) => {
    let title = req.body.title;
    let description = req.body.description.slice(0, 1999);
    let posterURL = req.body.posterURL;
    if (posterURL == null) {
        posterURL = await Video.findAll({ where: { id: req.params.id } });
    }
    Video.update(
        { title, description, posterURL },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' video updated');
            flashMessage(res, 'warning', 'Video Updated');
            res.redirect('/video/listVideos');
        })
        .catch(err => console.log(err));
});

router.get('/deleteVideo/:id', ensureAuthenticated, async function (req, res) {
    try {
        let video = await Video.findByPk(req.params.id);
        if (!video) {
            flashMessage(res, 'error', 'Video not found');
            res.redirect('/video/listVideos');
            return;
        }
        // bypassing checks
        if (req.user.id != video.userId && req.user.roletypeId != 2) {
            flashMessage(res, 'error', 'Unauthorised access');
            res.redirect('/video/listVideos');
            return;
        }
        let result = await Video.destroy({ where: { id: video.id } });
        console.log(result + ' video deleted');
        flashMessage(res, 'error', 'Video Deleted');
        res.redirect('/video/listVideos');
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/showvideo/:id/:userid', async (req, res) => {
    const allcomments = await Comment.findAll({ where: { videocommentedon: req.params.id }, include: User })
    var thenonusercomments = []
    var theusercomments = []
    if (req.user?.id) {
        thenonusercomments = await Comment.findAll({
            where: {
                userId: {
                    [Op.ne]: req.user.id
                },
                videocommentedon: req.params.id
            },
            paranoid: false,
            include: User
        })
        theusercomments = await Comment.findAll({ where: { userId: req.user.id, videocommentedon: req.params.id }, include: User })
    }
    const video = await Video.findOne({
        where: { id: req.params.id },
        paranoid: false,
        include: [{
            model: User,
            include: [{
                model: Subscriber
            }]
        }, {
            model: Like
        }, {
            model: Videostatus
        }]
    })
    // where: { videocommentedon: video.id }, 
    if (!video) {
        flashMessage(res, 'error', 'Video doesnt exist');
        res.redirect('/');
        return;
    }
    let subcount = video.user.subscribers.length
    let subscriptionstatus = 0
    let notuser = null
    let videostatus = null
    // console.log(JSON.stringify(video, null, 2));
    try {
        if (req.user?.id != video.userId && video.videostatusId == 2 && req.user.roletypeId != 2) {
            flashMessage(res, 'error', 'Video hidden');
            res.redirect('back');
            return;
        }
        if (video.videostatusId == 1) {
            // this is shown
            videostatus = 1
        }
        else {
            videostatus = 0
        }
        for (var i of video.user.subscribers) {
            if (await i.subscribers == req.user.id) {
                subscriptionstatus = 1
                break
            }
            else {
                subscriptionstatus = 0
            }
        };
        isowner = 0
        if (await req.user.id == req.params.userid || await req.user.roletypeId == 2) {
            isowner = 1
        }
        else {
            isowner = 0
        }
    }
    catch {
        if (video.videostatusId == 2) {
            flashMessage(res, 'error', 'Video hidden');
            res.redirect('back');
            return;
        }
        isowner = 0
        notuser = 1
    }
    console.log(video.likes)

    let likecount = video.likes.length
    let likestatus = 'Like'
    try {
        for (var i of video.likes) {
            if (await i.likes == req.user.id) {
                likestatus = 'Unlike'
                break
            }
            else {
                likestatus = 'Like'
            }
        };
    }
    catch {
        likestatus = 'Like'
    }
    let title = video.title
    const videosuggestion = await Video.findAll({ where: { userId: video.userId, id: { [Op.ne]: req.params.id }, videostatusId: { [Op.ne]: 2 } } })
    const undelete = await Video.findAll({ where: { deletedAt: { [Op.ne]: null } }, paranoid: false })
    res.render('video/showVideo', { video, nonusercomments: thenonusercomments, usercomments: theusercomments, allcomments: allcomments, subscriptionstatus, likestatus, subcount, likecount, videosuggestion: videosuggestion, isowner, notuser, videostatus, undelete, title });

});

router.post('/showvideo/:id/:userid', ensureAuthenticated, async (req, res) => {
    var video = await Video.findOne({
        where: { id: req.params.id }, include: User
    })

    // console.log(JSON.stringify(video, null, 2));
    let comment = req.body.comment
    let realvideoid = video.id
    let userId = req.user.id
    let videoId = req.params.id
    Comment.create({ userId, comment, videocommentedon: realvideoid, videoId })

    let datenow = new Date()
    let thevideoname = video.title
    let commenterEmail = req.user.email
    let uservideoownerphone = '65' + video.user.telephone
    let videoowner = video.user.username
    let CapName = capitalizeFirstLetter(req.user.username)

    // sesemail.sendEmail(commenterEmail, req.user.username, comment, thevideoname, datenow)
    nexmo.message.sendSms(
        'MyTubeNYP', uservideoownerphone, `Dear ${videoowner},\n\n Someone has commented on your video "${thevideoname}". \r\n\r\n${CapName} says: "${comment}"`,
        (err, responseData) => {
            if (err) {
            console.log(err);
            } else {
            console.dir(responseData);
            }
        }
    );
    res.redirect('back');
});

// router.get('/addLike/:id', ensureAuthenticated, async (req, res) => {
//     const test = await User.findOne({
//         where: { id: req.user.id },
//     })
//     const test2 = await Video.findOne({
//         where: { id: req.params.id}
//     })
//     let theuserid=req.user.id
//     let thevideoid = req.params.id
//     Like.create({theuserid, thevideoid})
//     res.redirect(req.get('referer'))   
// });
router.post('/like/:id', ensureAuthenticated, async (req, res) => {
    Video.findOne({
        where: { id: req.params.id },
        include: [{
            model: Like,
        }]
    })
        .then(async () => {
            console.log(req.user.id)
            let likes = req.user.id
            let videoId = req.params.id
            await Like.create({ likes, videoId })
        })
        .catch(err =>
            console.log(err));
    console.log("Like executed")
    res.redirect('back')
});
router.post('/unlike/:id', ensureAuthenticated, async (req, res) => {
    Video.findOne({
        where: { id: req.params.id },
        include: [{
            model: Like,
        }]
    })
        .then(async () => {
            let likes = req.user.id
            let videoId = req.params.id
            await Like.destroy({
                where: {
                    likes: likes,
                    videoId: videoId
                }

            })
        })
        .catch(err =>
            console.log(err));
    console.log("Unlike executed")
    res.redirect('back')
});

router.post('/subscribe/:id', ensureAuthenticated, async (req, res) => {
    let user = await User.findOne({
        where: { id: req.params.id },
        include: [{
            model: Subscriber,
        }]
    });
    let subber = await User.findOne({
        where: { id: req.user.id },
        include: [{
            model: Subscriber,
        }]
    });


    let subscribers = req.user.id
    let userId = req.params.id
    const subexists = await Subscriber.findOne({ where: { userId: userId, subscribers: subscribers } });
    if (!subexists) {
        await Subscriber.create({ subscribers, userId })
        await user.update({ subcount: user.subcount + 1 })
        sendEmail.sendEmail(user.email, subber.username, user.username)
    }
    res.redirect('back')
});
router.post('/unsubscribe/:id', ensureAuthenticated, async (req, res) => {
    const user = await User.findOne({
        where: { id: req.params.id },
        include: [{
            model: Subscriber,
        }]
    })
    let subscribers = req.user.id
    let userId = req.params.id
    await Subscriber.destroy({
        where: {
            subscribers: subscribers,
            userId: userId
        }
    })
    await user.update({ subcount: user.subcount - 1 });
    res.redirect('back')
});

router.get('/hideVideo/:id', ensureAuthenticated, async function (req, res) {
    try {
        let video = await Video.findOne({
            where: { id: req.params.id },
            include: [{
                model: Videostatus,
            }]
        });
        if (!video) {
            flashMessage(res, 'error', 'Video not found');
            res.redirect('/video/listVideos');
            return;
        }


        if (req.user.id != video.userId && req.user.roletypeId != 2) {
            flashMessage(res, 'error', 'Unauthorised access');
            res.redirect('/video/listVideos');
            return;
        }
        if (video.videostatusId == 1) {
            // hide video
            await video.update({ videostatusId: 2 })
        }
        else {
            // unhide
            video.videostatusId = 1
            await video.update({ videostatusId: 1 })
        }



        res.redirect('back');
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/showChannel/:id', async (req, res) => {

    if (req.user?.roletypeId == 2 || req.user?.id == req.params.id) {
        let videos = await Video.findAll({ where: { userId: req.params.id }, include: [{ model: User, }] })
        let subscriptionstatus = 0
        let notuser = null
        let video = await Video.findOne({ where: { userId: req.params.id }, include: [{ model: User, }] })
        try {
            let subscriber = await Subscriber.findOne({ where: { userId: req.params.id, subscribers: req.user.id } })
            if (subscriber) {
                subscriptionstatus = 1
            }
            else {
                subscriptionstatus = 0
            }
            isowner = 0
            if (await req.user.id == req.params.userid || await req.user.roletypeId == 2) {
                isowner = 1
            }
            else {
                isowner = 0
            }
        }
        catch {
            isowner = 0
            notuser = 1
        }
        username = video.user.username
        let userid = video.user.id
        // pass object to listVideos.handlebar
        res.render('video/showChannel', {
            videos,
            username,
            subcount: video.user.subcount,
            isowner,
            subscriptionstatus,
            userid,
            notuser,
            title: `${username}'s channel`
        });

    }
    else {
        let videos = await Video.findAll({ where: { userId: req.params.id, videostatusId: { [Op.ne]: 2 } }, include: [{ model: User, }], })


        let subscriptionstatus = 0
        let notuser = null
        let video = await Video.findOne({ where: { userId: req.params.id }, include: [{ model: User, }] })
        try {
            let subscriber = await Subscriber.findOne({ where: { userId: req.params.id, subscribers: req.user.id } })
            if (subscriber) {
                subscriptionstatus = 1
            }
            else {
                subscriptionstatus = 0
            }
            isowner = 0
            if (await req.user.id == req.params.userid || await req.user.roletypeId == 2) {
                isowner = 1
            }
            else {
                isowner = 0
            }
        }
        catch {
            isowner = 0
            notuser = 1
        }

        username = video.user.username
        let userid = video.user.id
        // pass object to listVideos.handlebar
        res.render('video/showChannel', {
            videos,
            username,
            subcount: video.user.subcount,
            isowner,
            subscriptionstatus,
            userid,
            notuser,
            title: `${username}'s channel`
        });
    }
});


router.post('/undelete/:id', ensureAuthenticated, async (req, res) => {
    const video = await Video.findOne({
        where: { id: req.params.id },
        paranoid: false
    })
    await video.restore();
    flashMessage(res, 'success', 'Video Restored');
    res.redirect('back')


});


module.exports = router;