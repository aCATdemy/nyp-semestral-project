const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const TicketStatus = db.define('ticketstatus', {
    ticketStatus: { type: Sequelize.STRING(8) }
});

module.exports = TicketStatus;