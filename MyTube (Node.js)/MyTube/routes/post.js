const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const moment = require('moment');
const upload = require('../helpers/postFileUpload');
const PostFile = require('../models/PostFile');
const flashMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');
const User = require('../models/User');
const { getUserById, getUserByUserName } = require("../services/post")
const fs = require('fs');
const Report = require('../models/Report');
const ReportCount = require('../models/ReportCount');
const PostComment = require('../models/PostComment');



// Post Homepage - display all the posts (for viewing only), can view without logging in
// router.get('/', async function (req, res) {
//     let posts = await Post.findAll({
//         where: {
//             deletedAt: null,
//         },
//         include: PostFile,
//         order: [['updatedAt', 'DESC'], [PostFile, 'id', 'ASC']],
//         nest: true,
//     });

//     posts = posts.map((post) => post.get({ plain: true }));

//     res.render('post/postHome', { posts });

// });


// Get post/create page
router.get('/create', ensureAuthenticated, (req, res) => {
    let user = req.user
    // let post = req.body.post

    res.render('post/addPost', { user });
});


//STANDARD POST
router.post('/create', ensureAuthenticated, async function (req, res) {
    // let { title, description, poll, polldesc } = req.body;

    console.log('Uploading..');

    let latestPost = await Post.findOne({
        order: [
            ['createdAt', 'DESC']
        ],
        attributes: ['id'],
        raw: true
    });

    console.log(latestPost);

    if (latestPost == undefined) {
        req.postId = 1;
    }
    else {
        req.postId = latestPost.id + 1;
    }

    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/post/' + req.postId)) {
        fs.mkdirSync('./public/uploads/post/' + req.postId, {
            recursive:
                true
        });
    }

    upload(req, res, async function (err) {

        if (err) {
            console.log(err);
        }
        else {
            let post = await Post.create({
                title: req.body.title,
                description: req.body.description,
                userId: req.user.id
            })

            const postId = await post.id;

            req.files.forEach(image => {
                PostFile.create({
                    imagepath: "/uploads/post/" + postId + "/" + image.filename,
                    postId
                });
            })
            flashMessage(res, 'success', 'Post created successfully!')
            res.json("Success");
        }
    });

});


// RETRIEVE POST
router.get('/:username/myPost', ensureAuthenticated, async function (req, res) {
    let posts = await Post.findAll({
        where: {
            deletedAt: null,
        },
        include: [PostFile, User],
        order: [['updatedAt', 'DESC'], [PostFile, 'id', 'ASC']],
        nest: true,
    });

    posts = posts.map((post) => post.get({ plain: true }));
    res.render('post/retrievePost', { posts, user: req.user });
});

// RETRIEVE INDIVIDUAL POST
router.get('/:username/myPost/:id', ensureAuthenticated, async function (req, res) {
    let post = await Post.findOne({
        where: {
            id:req.params.id,
            deletedAt: null,
        },
        include: [PostFile, User, {model:PostComment, include:[User]}],
        order: [['updatedAt', 'DESC'], [PostFile, 'id', 'ASC'], [PostComment, 'id', 'DESC']],
        nest: true,
        
    });

    post = post.get({ plain: true });
    console.log(post);
    res.render('post/fullPost', { post, user: req.user });
});

//post comment
router.post('/:id/comment', ensureAuthenticated, async function (req, res) {

    let comment = await PostComment.create({
        comment:req.body.comment,
        postId: req.params.id,
        userId: req.user.id
    })

    flashMessage(res, 'success', 'Succesfully Comment');
    res.redirect('back');
});

router.post('/comment/delete/:id', ensureAuthenticated, async function (req, res) {
    await PostComment.destroy({
        where:{
            id:req.params.id
        }
    })
    flashMessage(res, 'success', 'Comment Deleted.');
    res.redirect('back');
})

router.post('/comment/edit/:id', ensureAuthenticated, async function (req, res) {
    console.log(req.body.editcomment);
    await PostComment.update({
        comment:req.body.editcomment,
        edited:true
    },{
        where:{
            id:req.params.id
        }
    })
    flashMessage(res, 'success', 'Comment Edited.');
    res.redirect('back');
})


// REPORT POST
router.post('/:username/myPost/report/:id', ensureAuthenticated, async function (req, res) {
    console.log("Reporting");
    const postId = req.params.id;
    const content = req.body.report;
    let find = await Report.findOne({
        where: {
            postId,
            userId: req.user.id
        }
    })

    if (find) {
        flashMessage(res, 'error', 'You have already reported earlier.')
        res.json("success");
    }

    else {
        let report = await Report.create({
            content,
            postId,
            userId: req.user.id
        });

        let reportcount = await ReportCount.findOne({
            where: {
                postId
            }
        })

        if (reportcount) {
            console.log(content);
            if (content == "Sexual Content") {

                await ReportCount.increment({Sexual: 1}, { where: { id: reportcount.id } })
            }
            else if (content == "Violent Language") {
                console.log('violent here');
                await ReportCount.increment({Violent: 1}, { where: { id: reportcount.id } })

            }
            else if (content == "Spam or Misleading") {
                console.log('Spam here');
                await ReportCount.increment({Spam: 1}, { where: { id: reportcount.id } })
            }
        }

        else {
            console.log('!reportcount')
            if (content == "Sexual Content") {
                await ReportCount.create({
                    Sexual: 1,
                    Violent: 0,
                    Spam: 0,
                    postId
                })
            }
            else if (content == "Violent Language") {
                await ReportCount.create({
                    Sexual: 0,
                    Violent: 1,
                    Spam: 0,
                    postId

                })
            }
            else if (content == "Spam or Misleading") {
                await ReportCount.create({
                    Sexual: 0,
                    Violent: 0,
                    Spam: 1,
                    postId
                })
            }
        }

        flashMessage(res, 'success', 'Post reported successfully, our staff will review the post reported.')
        res.json("success");
    }
});


// UPDATE POST
router.get('/update/:id', ensureAuthenticated, async function (req, res) {
    let post = await Post.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: PostFile
        }, User]
    });
    if (req.user.username == post.user.username) {
        // if (!post) {
        //     // Go to a Error Page
        // }
        let user = req.user;
        post = JSON.parse(JSON.stringify(post));
        console.log('Retrieving...')
        console.log(post);
        console.log('Retrieving Complete...')
        res.render('post/UpdatePost', { post, user });
    }
    else {
        flashMessage(res, 'error', 'Not Allowed')
        res.redirect('/');
    }


});


router.post('/update/:id', ensureAuthenticated, async function (req, res) {
    let post = await Post.findOne({
        where: {
            id: req.params.id
        },
    });
    req.postId = post.id

    upload(req, res, async function (err) {
        let { title, description } = req.body;

        // // Creates user id directory for upload if not exist
        // if (!fs.existsSync('./public/uploads/post/' + req.postId)) {
        //     fs.mkdirSync('./public/uploads/post/' + req.postId, {
        //         recursive:
        //             true
        //     });
        // }

        if (err) {
            console.log(err);
        }
        else {
            if (req.files.length > 0) {
                let postfiles = [];

                const postId = req.params.id;

                req.files.forEach(image => {
                    postfiles.push(
                        {
                            imagepath: "/uploads/post/" + postId + "/" + image.filename,
                            postId: req.params.id
                        }
                    )
                });

                let post = await Post.update({
                    title: req.body.title,
                    description: req.body.description,
                    updatedAt: moment()
                },
                    {
                        where: {
                            id: req.params.id
                        }
                    }
                );

                PostFile.destroy({
                    where: {
                        postId: req.params.id
                    }
                })

                req.files.forEach(image => {
                    PostFile.create({
                        postId: req.params.id,
                        imagepath: "/uploads/post/" + postId + "/" + image.filename
                    });
                });

                flashMessage(res, 'success', 'Post updated successfully!')
                res.json("success");
            }
            else {

                let post = await Post.update({
                    title,
                    description,
                    createAt: moment()
                }, {
                    where: {
                        id: req.params.id
                    }
                })
                if (post) {
                    await PostFile.destroy({
                        where: {
                            postId: req.params.id
                        }
                    })
                }
                flashMessage(res, 'success', 'Post updated successfully!')
                res.json("success");
            }

        }
    });


    // res.redirect('/post');
});


// DELETE POST
router.post('/delete/:id', ensureAuthenticated, async function (req, res) {
    console.log('Deleting...')
    let post = await Post.update({
        deletedAt: moment()
    },
        {
            where: {
                id: req.params.id,
            }
        });
    console.log("deleted");
    flashMessage(res, 'success', 'Post deleted successfully!')
    res.redirect('/post/abc/myPost');
});


// ADMIN MANAGE REPORTS
router.get('/admin/manage', ensureAuthenticated, async function (req, res) {
    // let reports = await Report.findAll({
    //     where: {
    //         removedAt: null
    //     },
    //     include: [User, {
    //         model: Post, 
    //         include: [PostFile]
    //     }],
    //     order: [['updatedAt', 'ASC']],
    // });

    let reportedPosts = await ReportCount.findAll({
        include: [{ model: Post, include: [PostFile, User] }]
    })



    reportedPosts = reportedPosts.map((reportedPosts) => reportedPosts.get({ plain: true }));
    console.log(reportedPosts);
    res.render('post/adminPost', { reportedPosts, user: req.user });
});


// ADMIN REMOVE POST
router.post('/admin/remove/:postId', ensureAuthenticated, async function (req, res) {

    //remove report first
    let destory = await Report.destroy({
        where: {
            postId: req.params.postId,
        }
    });

    let destroy2 = await ReportCount.destroy({
        where: {
            postId: req.params.postId
        }
    })
    if (destory && destroy2) {
        //remove post
        await Post.update({
            deletedAt: moment()
        }, {
            where: {
                id: req.params.postId
            }
        })
    }

    flashMessage(res, 'error', 'Post removed');
    res.redirect('/post/admin/manage');
})
router.post('/admin/report/approve/:postId', ensureAuthenticated, async function (req, res) {
    //remove all reports
    let destory = await Report.destroy({
        where: {
            postId: req.params.postId,
        }
    });

    let destroy2 = await ReportCount.destroy({
        where: {
            postId: req.params.postId
        }
    })

    flashMessage(res, 'success', 'Post approved');
    res.redirect('/post/admin/manage');
})

module.exports = router;