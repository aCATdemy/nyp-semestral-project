const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const TicketStatus = require('../models/TicketStatus');

const Ticket = db.define('ticket', {
    ticketSubject: { type: Sequelize.STRING(256) },
    ticketCategory: { type: Sequelize.STRING },
    ticketMessage: { type: Sequelize.STRING(1000) },
    ticketStatusId: { type: Sequelize.INTEGER }
});


// Values to be populated into 'ticketstatuses' table:
ticketStatusType = ["open", "awaiting", "pending", "solved"]

/*
    Values mapping in 'ticketstatuses' table:
    --> 1 (open)
    --> 2 (awaiting)
    --> 3 (pending)
    --> 4 (solved)
*/

// Function to populate value for 'ticketstatuses' table:
async function populateDB() {
    TicketStatus.sync().then(() => TicketStatus.findAndCountAll()
        .then(result => {
            if (result.count == 0) {
                ticketStatusType.forEach((ticketStatusItem, index) => {
                    TicketStatus.create({
                        id: index + 1,
                        ticketStatus: ticketStatusItem
                    })
                })
            }
        })
    )
}

// Call function to populate value for 'ticketstatuses' table:
populateDB()

module.exports = Ticket;