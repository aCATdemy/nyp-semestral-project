const sequelize = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
// Create users table in MySQL Database
const Subscribers = db.define('subscriber',
    {
        subscribers: { type: Sequelize.INTEGER },
    });
module.exports = Subscribers;