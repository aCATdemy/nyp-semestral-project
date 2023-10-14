const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create users table in MySQL Database
const Comment = db.define('comment',
    {
        comment: { type: Sequelize.STRING(2000) },
        videocommentedon: { type: Sequelize.INTEGER },
    });
module.exports = Comment;