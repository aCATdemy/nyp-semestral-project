const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Conversation = db.define('conversation',
    {
        conversation: { type: Sequelize.STRING(1000) },
    });

module.exports = Conversation;