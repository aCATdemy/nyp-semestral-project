const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const flashMessage = require('../helpers/messenger');
const User = require('../models/User');
const Video = require('../models/Video')
const sesemail = require('../helpers/awsses')
const Nexmo = require('nexmo');
const e = require('connect-flash');
const path = require('path')
const ensureAuthenticated = require('../helpers/auth');
const nexmo = new Nexmo({
  apiKey: '8922afa7',
  apiSecret: "vEzkAXUcV6m2WcnFjuKRA2W4"
});
function capitalizeFirstLetter(str) {

    // converting first letter to uppercase
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

    return capitalized;
}


router.get('/addComment', ensureAuthenticated, async (req, res) => {
    var sort = req.query.sort;

    var test2 = await Video.findAll({
        include: [{
            model: User
        }],
        where: {
            userId : req.user.id
        }
    })

    var test = []

    if(sort) {
        test = await Comment.findAll({ 
            where: {
                videoId : sort
            },
            include: [{
            model: User,
        }]})
    }


    // console.log(JSON.stringify(test, null, 2))
    // .then(async (comments) => {

        // for(let comment of comments) {
        //     var u = await User.findOne({
        //         where: {
        //             id: comment.userId
        //         }
        //     });

        //     comment.username = u.username;
        // }

    res.render('comment/addComment', {
        comments:test,
        videos: test2,
        title: 'Comment Manager | MyTube'
    });
    // });
});

// router.post('/addComment', async (req, res) => {
//     let datenow = new Date()
//     let comment = req.body.comment
//     let video = 1
//     let userId = req.user.id
//     let commenterEmail = req.user.email
//     let CapName = capitalizeFirstLetter(req.user.username)
//     Comment.create({userId, comment, videocommentedon: video})
//     // USE THIS FOR DEBUG
//     .then((comment) => { 
//         console.log(comment.toJSON())
//     })
//     sesemail.sendEmail(commenterEmail, req.user.username, comment, video, datenow)
//     // nexmo.message.sendSms(
//     //     'MyTubeNYP', '6597228782', `Hello, ${CapName}! Someone has commented on your video (1). \r\n\r\n${CapName} says: "${comment}"`,
//     //       (err, responseData) => {
//     //         if (err) {
//     //           console.log(err);
//     //         } else {
//     //           console.dir(responseData);
//     //         }
//     //       }
//     //    );
//     res.redirect('/comment/addComment');
// });

router.get('/editComment/:id', async (req, res) => {
    const test = await Comment.findOne({
        where: { id: req.params.id },
    })
    try {
        if (test && test.videoId) {
            const test2 = await Video.findOne({
                where: { id: test.videoId}
            })
            var comments = await Comment.findByPk(req.params.id)
            if (!comments) {
                commentvideoid = test.videoId
                commentvideouserid = test2.userId
                res.redirect()
                return;
            }
            if (req.user.id != comments.userId) {
                commentvideoid = test.videoId
                commentvideouserid = test2.userId
                res.redirect()
                return;
            }
            var thecomment = comments.comment
            res.render('comment/editComment', { comments, thecomment, title: 'Edit Comment | MyTube'});
            }
        else {
            res.sendFile(path.join(__dirname, '../404.html'));
        }
    }
    catch (e) {
        res.sendFile(path.join(__dirname, '../404.html'));
    }
    
    
})

router.post('/editComment/:id', async (req, res) => {
    const test = await Comment.findOne({
        where: { id: req.params.id },
    })
    const test2 = await Video.findOne({
        where: { id: test.videoId}
    })
    let { comment, videocommentedon } = req.body;
    await Comment.update(
        {
            comment
        },
        { where: { id: req.params.id } }
    )
        .then ((result) => {
            // console.log(test)
            commentvideoid = test.videoId
            commentvideouserid = test2.userId
            console.log(result[0] + ' comment updated');
            flashMessage(res, 'success', 'Comment updated successfully.');
            // res.redirect(req.get('referer'))
            res.redirect(`/video/showvideo/${commentvideoid}/${commentvideouserid}`)
        })
});

router.get('/deleteComment/:id', async (req, res) => {
    // const testt = await Comment.findOne({where: {id: req.params.id}})
    // console.log(testt)
    // const test = await User.findAll({ where: {id: testt.userId}})
    
    try {
    const comments = await Comment.findOne({
        where: {id: req.params.id},
        include: User
    })      
    const test2 = await Video.findOne({ where: { id: comments.videoId}})
    if (!comments) {
        commentvideoid = comments.videoId
        commentvideouserid = test2.userId
        res.redirect()
        return;
    }
    if (req.user.id != comments.userId) {
        commentvideoid = comments.videoId
        commentvideouserid = test2.userId
        res.redirect()
        return;
    }
    commentvideoid = comments.videoId
    commentvideouserid = test2.userId
    
    let commenterEmail = comments.user.email
    let comment = comments.comment
    let thevideoname = test2.title
    let datenow = new Date()
    // sesemail.sendDeleteEmail(commenterEmail, comments.user.username, comment, thevideoname, datenow)
    
    let result = Comment.destroy({ where: { id: comments.id } });
    flashMessage(res, 'success', 'Comment deleted successfully.');
    console.log(result + ' comment deleted!! :)');
    res.redirect(`/video/showvideo/${commentvideoid}/${commentvideouserid}`)
    }
    catch (e) {
        res.sendFile(path.join(__dirname, '../404.html'));
    }   
    })

router.get('/SuperiordeleteComment/:id', async (req, res) => {
    const comments = await Comment.findOne({
        where: {id: req.params.id},
        include: User
    })
    
    if (!comments) {
        res.redirect(req.get('referer'))
        return;
    }
    var test2 = await Video.findOne({ where: { id: comments.videoId}})
    if (req.user && test2 && test2.userId == req.user.id) {
        let commenterEmail = comments.user.email
        let comment = comments.comment
        let thevideoname = test2.title
        let datenow = new Date()
        sesemail.sendDeleteEmail(commenterEmail, comments.user.username, comment, thevideoname, datenow)

        let result = Comment.destroy({ where: { id: comments.id } });
        flashMessage(res, 'success', 'Comment deleted successfully.');
        console.log(result + ' comment deleted!! :)');
        res.redirect(req.get('referer'))    
    }
    res.sendFile(path.join(__dirname, '../404.html'));
})


router.get('/masterComment', ensureAuthenticated, async  (req, res)  => {
    var sort = req.query.sort;

    var test2 = await Video.findAll({
        include: [{
            model: User
        }]
    })

    var test = []

    if(sort) {
        test = await Comment.findAll({ 
            where: {
                videoId : sort
            },
            include: [{
            model: User,
        }]})
    }

    var admincheck = req.user.roletypeId == 2

    // console.log(JSON.stringify(test, null, 2))
    // .then(async (comments) => {

        // for(let comment of comments) {
        //     var u = await User.findOne({
        //         where: {
        //             id: comment.userId
        //         }
        //     });

        //     comment.username = u.username;
        // }

    if (admincheck) {
        res.render('comment/adminaddComment', {
            comments:test,
            videos: test2,
            title: 'Comment Management | MyTube'
        });
    }
    else {
        flashMessage(res, 'error', 'Unauthorised access');
        res.redirect('/');
    }
    // });
});

router.get('/adminSuperiordeleteComment/:id', async (req, res) => {
    const comments = await Comment.findOne({
        where: {id: req.params.id},
        include: User
    })
    
    if (!comments) {
        res.redirect(req.get('referer'))
        return;
    }
    // if (req.user.id != comments.userId) {
    //     flashMessage(res, 'error', 'Unauthorised access');
    //     res.redirect(req.get('referer'))
    //     return;
    // }
    // console.log(test)
    // let commenterEmail = comments.user.email
    // let commenterUsername = comments.user.username
    // let comment = comments.comment
    // console.log(comments.comment)
    // let thevideoname = comments.video.title
    // let datenow = new Date()
    // sesemail.sendEmail(commenterEmail, commenterUsername, comment, thevideoname, datenow)
    var test2 = await Video.findOne({ where: { id: comments.videoId}})
    if (req.user && test2 && req.user.roletypeId == 2) {
        
        let commenterEmail = comments.user.email
        let comment = comments.comment
        let thevideoname = test2.title
        let datenow = new Date()
        sesemail.sendDeleteEmail(commenterEmail, comments.user.username, comment, thevideoname, datenow)
        
        let result = Comment.destroy({ where: { id: comments.id } });
        flashMessage(res, 'success', 'Comment deleted successfully.');
        console.log(result + ' comment deleted!! :)');
        res.redirect(req.get('referer'))    
    }
    res.sendFile(path.join(__dirname, '../404.html'));
    
})

module.exports = router;