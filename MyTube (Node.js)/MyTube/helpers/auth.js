const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/account/login');
};

module.exports = ensureAuthenticated;