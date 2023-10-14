const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create users table in MySQL Database
const Like = db.define('like',
    {
        likes: { type: Sequelize.INTEGER },
    });
module.exports = Like; 