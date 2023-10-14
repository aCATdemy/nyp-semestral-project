const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create users table in MySQL Database
const RoleType = db.define('roletype',
    {
        role: { type: Sequelize.STRING }
    });

module.exports = RoleType;