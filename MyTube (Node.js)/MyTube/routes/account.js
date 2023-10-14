const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const moment = require('moment');
const ensureAuthenticated = require('../helpers/auth');
const RoleType = require('../models/RoleType')

router.get('/login', (req, res) => {
    res.render('account/login', {
        title: 'MyTube ID Login | MyTube'
    });
})

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    //let roletypeId = 1
    var redirectURL = "/";
    if (email && password) {
        User.findOne({ where: { email: email } })
            .then(user => {
                if (!user) {
                    flashMessage(res, 'error', 'User not found');
                    res.redirect('/account/register')


                }
                else if (user.roletypeId == 1) {
                    redirectURL = "/";

                    passport.authenticate('local', {
                        // Success redirect URL
                        successRedirect: redirectURL,
                        // Failure redirect URL
                        failureRedirect: '/account/login',
                        /* Setting the failureFlash option to true instructs Passport to flash
                        an error message using the message given by the strategy's verify callback.
                        When a failure occur passport passes the message object as error */
                        failureFlash: true
                    })(req, res, next);
                }


                else if (user.roletypeId == 2) {

                    passport.authenticate('local', {
                        // Success redirect URL
                        successRedirect: '/account/listUser',
                        // Failure redirect URL
                        failureRedirect: '/account/login',
                        failureFlash: true
                    })(req, res, next);
                }


                else {
                    passport.authenticate('local', {
                        // Success redirect URL
                        successRedirect: redirectURL,
                        // Failure redirect URL
                        failureRedirect: '/account/login',
                        failureFlash: true
                    })(req, res, next);
                }
            }).catch((err) => console.log(err))
    }

    else {
        passport.authenticate('local', {
            // Success redirect URL
            successRedirect: redirectURL,
            // Failure redirect URL
            failureRedirect: '/account/login',
            failureFlash: true
        })(req, res, next);
        // res.status(400).json({ message: "Role or Id not present" })
    }
});

router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); };
        res.redirect('/');
    });
});


router.get('/listProfiles', ensureAuthenticated, (req, res) => {
    User.findAll({
        where: { id: req.user.id }, // When this code is active, it only list out the currently logged-in user
        //order: [['dateCreated', 'DESC']],
        raw: true
    })
        .then((users) => {
            // pass object to listUser.handlebar
            res.render('account/listProfiles', { users });
        })
        .catch(err => console.log(err));
});


router.get('/profile', ensureAuthenticated, (req, res) => {
    res.render('account/profile', {
        title: 'User Profile | MyTube'
    });
})


router.get('/register', (req, res) => {
    res.render('account/register', {
        title: 'MyTube ID Registration | MyTube'
    });
})

router.get('/changePassword/:id', ensureAuthenticated, (req, res) => {
    User.findByPk(req.params.id)
        .then((users) => {
            if (!users) {
                flashMessage(res, 'error', 'User not found');
                res.redirect('/account/listUser');
                return;
            }

            res.render('account/changePassword', { users });
        })
        .catch(err => console.log(err));
})


router.post('/changePassword/:id', ensureAuthenticated, (req, res) => {
    let password = req.body.password;
    let password2 = req.body.password2;
    let isValid = true;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);


    if (password.length < 6) {
        flashMessage(res, 'error', 'Password must be at least 6 characters');
        isValid = false;
    }


     if (password.search(/[A-Z]/) < 0) {
        flashMessage(res, 'error', 'Password must have uppercase letter');
        isValid = false;
    }

    if (password.search(/[a-z]/) < 0) {
        flashMessage(res, 'error', 'Password must have lowercase letter');
        isValid = false;
    }

    if (password.search(/[?=.*?[#?!@$%^&*-]/) < 0) {
        flashMessage(res, 'error', 'Password must have special character');
        isValid = false;
    }

    if (password.search(/[0-9]/) < 0) {
        flashMessage(res, 'error', 'Password must have number');
        isValid = false;
    }

    if (password != password2) {
        flashMessage(res, 'error', 'Passwords do not match');
        isValid = false;
    }


    User.update(
        {
            password: hash
        },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' password updated');
            res.redirect('/account/listProfiles');
        })
        .catch(err => console.log(err));
});


router.post('/register', async function (req, res) {
    let { username, email, telephone, password, password2 } = req.body;

    let isValid = true;
    if (password.length < 6) {
        flashMessage(res, 'error', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (password.search(/[A-Z]/) < 0) {
        flashMessage(res, 'error', 'Password must have uppercase letter');
        isValid = false;
    }

    if (password.search(/[a-z]/) < 0) {
        flashMessage(res, 'error', 'Password must have lowercase letter');
        isValid = false;
    }

    if (password.search(/[?=.*?[#?!@$%^&*-]/) < 0) {
        flashMessage(res, 'error', 'Password must have special character');
        isValid = false;
    }

    if (password.search(/[0-9]/) < 0) {
        flashMessage(res, 'error', 'Password must have number');
        isValid = false;
    }

    if (password != password2) {
        flashMessage(res, 'error', 'Passwords do not match');
        isValid = false;
    }
    if (!isValid) {
        res.render('account/register', {
            username, email, telephone
        });
        return;
    }

    try {
        // If all is well, checks if user is already registered
        let user = await User.findOne({ where: { email: email } });
        if (user) {
            // If user is found, that means email has already been registered
            flashMessage(res, 'error', email + ' alreay registered');
            res.render('account/register', {
                username, email, telephone,
            });
        }
        else {
            // Create new user record 
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            // Use hashed password
            let user = await User.create({ username, email, telephone, password: hash });
            flashMessage(res, 'success', email + ' registered successfully');
            res.redirect('/account/login');
        }
    }
    catch (err) {
        console.log(err);
    }
});


// Admin User Management
router.get('/listUser', ensureAuthenticated, (req, res) => {

    
    
    User.findAll({
        // where: { id: req.user.id }, // When this code is active, it only list out the currently logged-in user
        //order: [['dateCreated', 'DESC']],
        raw: true
    })
        .then((users) => {
            // pass object to listUser.handlebar
            res.render('account/listUser', { users });
        })
        .catch(err => console.log(err));
});

router.get('/addUser', ensureAuthenticated, (req, res) => {
    res.render('account/addUser');
});

router.post('/addUser', ensureAuthenticated, async function (req, res) {
    let username = req.body.username;
    let roletypeid = req.body.roletypeid;
    let email = req.body.email;
    let telephone = req.body.telephone;
    let dateCreated = moment(req.body.dateCreated, 'DD/MM/YYYY');
    let password = req.body.password;
    let password2 = req.body.password2;
    let userId = req.user.id;

    let isValid = true;
    if (password.length < 6) {
        flashMessage(res, 'error', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (password != password2) {
        flashMessage(res, 'error', 'Passwords do not match');
        isValid = false;
    }

    if (!isValid) {
        res.render('account/addUser', {
            username, email, telephone,
        });
        return;
    }

    try {
        // If all is well, checks if user already exists
        let user = await User.findOne({ where: { email: email } });
        if (user) {
            // If user is found, that means the user has already been created before
            flashMessage(res, 'error', email + ' already exists');
            res.render('account/addUser', {
                username, email, telephone,
            });
        }
        else {
            // Create new user record 
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            // Use hashed password
            let user = await User.create({ username, roletypeid, email, telephone, password: hash, userId });
            flashMessage(res, 'success', email + ' is successfully created');
            res.redirect('/account/listUser');
        }
    }
    catch (err) {
        console.log(err);
    }

    // User.create(
    //     {
    //         username, email, dateCreated, password
    //     }
    // )
    //     .then((user) => {
    //         console.log(user.toJSON());
    //         res.redirect('/account/addUser');
    //     })
    //     .catch(err => console.log(err))
});

router.get('/editUser/:id', ensureAuthenticated, (req, res) => {
    User.findByPk(req.params.id)
        .then((users) => {
            if (!users) {
                flashMessage(res, 'error', 'User not found');
                res.redirect('/account/listUser');
                return;
            }

            res.render('account/editUser', { users });
        })
        .catch(err => console.log(err));
});


router.get('/editProfiles/:id', ensureAuthenticated, (req, res) => {
    User.findByPk(req.params.id)
        .then((users) => {
            if (!users) {
                flashMessage(res, 'error', 'User not found');
                res.redirect('/account/listProfiles');
                return;
            }

            res.render('account/editProfiles', { users });
        })
        .catch(err => console.log(err));
});


router.post('/editProfiles/:id', ensureAuthenticated, (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let telephone = req.body.telephone
    let dateCreated = moment(req.body.dateCreated, 'DD/MM/YYYY');
    let userId = req.user.id;

    User.update(
        {
            username, email, telephone, userId
        },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' users updated');
            res.redirect('/account/listProfiles');
        })
        .catch(err => console.log(err));
});


router.post('/editUser/:id', ensureAuthenticated, (req, res) => {
    let username = req.body.username;
    let email = req.body.email
    let telephone = req.body.telephone
    let dateCreated = moment(req.body.dateCreated, 'DD/MM/YYYY');
    let userId = req.user.id;

    User.update(
        {
            username, email, telephone, userId
        },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' users updated');
            res.redirect('/account/listUser');
        })
        .catch(err => console.log(err));
});

router.get('/deleteUser/:id', ensureAuthenticated, async function
    (req, res) {
    try {
        let users = await User.findByPk(req.params.id);
        if (!users) {
            flashMessage(res, 'error', 'User not found');
            res.redirect('/account/listUser');
            return;
        }

        let result = await User.destroy({ where: { id: users.id } });
        console.log(result + ' user deleted');
        res.redirect('/account/listUser');
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/password-recovery', (req, res) => {
    res.render('account/password-recovery', {
        title: 'Recover MyTube ID Password | MyTube'
    });
})

module.exports = router;