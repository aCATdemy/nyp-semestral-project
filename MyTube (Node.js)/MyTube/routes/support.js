const express = require('express');
const router = express.Router();

// Imports:
const flashMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Conversation = require('../models/Conversation');
const sendTicketOpenedEmail = require('../helpers/sendTicketOpenedEmail');
const sendTicketUpdatedEmail = require('../helpers/sendTicketUpdatedEmail');
const sendTicketAwaitingUserResponseEmail = require('../helpers/sendTicketAwaitingUserResponseEmail');


// User View START
// -+ [OK] Dashboard +-
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('support/dashboard', {
        title: 'Help & Support | MyTube'
    });
});

// -+ [OK] Ticket Creation +-
router.get('/ticket-creation', ensureAuthenticated, (req, res) => {
    res.render('support/ticket-creation', {
        title: 'Ticket Creation | MyTube'
    });
});

// -+ [OK] Ticket Creation (POST Request) +-
router.post('/ticket-creation', ensureAuthenticated, (req, res) => {
    let ticketSubject = req.body.ticketSubject;
    let ticketCategory = req.body.ticketCategory;
    let ticketMessage = req.body.ticketMessage;
    let ticketStatusId = 1;
    let userId = req.user.id;

    Ticket.create(
        {
            ticketSubject, ticketCategory, ticketMessage, ticketStatusId, userId
        }
    )
        .then((ticket) => {
            // Log transaction:
            console.log(ticket.toJSON());

            // Send email to administrator:
            sendTicketOpenedEmail.sendEmail(ticketSubject, req.user.username, ticketCategory, ticketMessage);

            flashMessage(res, 'success', 'Thank you for creating a support ticket. We will respond to your enquiries within 48 hours (excluding public holidays).');
            res.redirect('/support/history');
        });
});

// -+ [OK] History +-
router.get('/history', ensureAuthenticated, (req, res) => {
    Ticket.findAll({
        where: { userId: req.user.id },
        include: User,
        order: [['createdAt', 'DESC']],
    })
        .then((tickets) => {
            res.render('support/history', {
                tickets,
                title: 'My Ticket History | MyTube'
            });
        })
        .catch(err => console.log(err));
});

// -+ [OK] View Ticket +-
router.get('/view-ticket/:id', ensureAuthenticated, (req, res) => {
    Conversation.findAll({
        where: { ticketId: req.params.id },
        include: User,
        order: [['createdAt', 'DESC']],
    })
        .then((conversations) => {
            Ticket.findByPk(req.params.id)
                .then((tickets) => {
                    if (!tickets) {
                        flashMessage(res, 'error', 'ERROR: The support ticket that you are looking for does not exist.');
                        res.redirect('/support/history');
                        return;
                    }
                    if (req.user.id != tickets.userId) {
                        flashMessage(res, 'error', 'ERROR: You do not have the necessary permissions to view this support ticket.');
                        res.redirect('/support/dashboard');
                        return;
                    }

                    res.render('support/view-ticket', {
                        tickets, conversations,
                        title: tickets.ticketSubject + ' | MyTube'
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

// -+ [OK] View Ticket (Add Reply POST Request) +-
router.post('/view-ticket/:id', ensureAuthenticated, (req, res) => {
    Ticket.findByPk(req.params.id)
        .then((ticketInDB) => {
            if (!ticketInDB) {
                flashMessage(res, 'error', 'ERROR: The support ticket that you are updating does not exist.');
                res.redirect('/support/history');
                return;
            }
            let conversation = req.body.conversation;
            let ticketStatusId = 3;
            let ticketId = req.params.id;
            let userId = req.user.id;

            Ticket.findByPk(req.params.id)
                .then((tickets) => {
                    if (tickets.ticketStatusId == 4) {
                        flashMessage(res, 'error', 'ERROR: This support ticket has already been marked as solved and no replies can be added.');
                        res.redirect('/support/dashboard');
                        return;
                    }

                    Conversation.create(
                        {
                            userId, conversation, ticketId
                        }
                    )

                    Ticket.update(
                        { ticketStatusId },
                        { where: { id: req.params.id } }
                    )
                        .then(() => {
                            // Send email to administrator:
                            sendTicketUpdatedEmail.sendEmail(tickets.ticketSubject, req.user.username, tickets.ticketCategory, tickets.ticketMessage, conversation);

                            flashMessage(res, 'success', 'You have successfully added a reply to support ticket #' + ticketId + '. We will get back to you within 48 hours (excluding public holidays).');
                            res.redirect('/support/history');
                        })
                        .catch(err => console.log(err));
                })
        })
});

// -+ [OK] View Ticket (Mark as Solved POST Request) +-
router.post('/mark-solved/:id', ensureAuthenticated, (req, res) => {
    Ticket.findByPk(req.params.id)
        .then((ticketInDB) => {
            if (!ticketInDB) {
                flashMessage(res, 'error', 'ERROR: The support ticket that you are updating does not exist.');
                res.redirect('/support/history');
                return;
            }
            let ticketStatusId = 4;
            let ticketId = req.params.id;

            Ticket.findByPk(req.params.id)
                .then((tickets) => {
                    if (tickets.ticketStatusId == 4) {
                        flashMessage(res, 'error', 'ERROR: This support ticket has already been marked as solved.');
                        res.redirect('/support/dashboard');
                        return;
                    }

                    Ticket.update(
                        { ticketStatusId },
                        { where: { id: req.params.id } }
                    )
                        .then(() => {
                            flashMessage(res, 'success', 'You have successfully marked support ticket #' + ticketId + ' as solved.');
                            res.redirect('/support/history');
                        })
                        .catch(err => console.log(err));
                })
        })
});

// -+ [OK] View Ticket (Delete Ticket POST Request) +-
router.post('/delete-ticket/:id', ensureAuthenticated, async function (req, res) {
    try {
        let ticket = await Ticket.findByPk(req.params.id);
        if (!ticket) {
            flashMessage(res, 'error', 'ERROR: The support ticket that you are trying to delete does not exist.');
            res.redirect('/support/history');
            return;
        }
        if (req.user.id != ticket.userId) {
            flashMessage(res, 'error', 'ERROR: You do not have the necessary permissions to delete this support ticket.');
            res.redirect('/support/history');
            return;
        }

        let result = await Ticket.destroy({ where: { id: ticket.id } });
        console.log(result + ' support ticket is deleted successfully.');

        flashMessage(res, 'success', 'You have successfully deleted the corresponding support ticket.');
        res.redirect('/support/history');
    }
    catch (err) {
        console.log(err);
    }
});
// User View END


// Admin View START
// -+ [OK] Ticket Overview +-
router.get('/admin/ticket-overview', ensureAuthenticated, (req, res) => {
    var adminCheck = req.user.roletypeId
    if (adminCheck == 2) {
        Ticket.findAll({
            include: User,
            order: [['id', 'DESC']],
        })
            .then((tickets) => {
                res.render('support/admin/ticket-overview', {
                    tickets,
                    title: 'Ticket Overview | MyTube'
                });
            })
            .catch(err => console.log(err));
    } else {
        flashMessage(res, 'error', 'ERROR: You do not have the necessary permissions to view this page.');
        res.redirect('/');
        return;
    }
});

// -+ [OK] View Ticket +-
router.get('/admin/view-ticket/:id', ensureAuthenticated, (req, res) => {
    var adminCheck = req.user.roletypeId
    if (adminCheck == 2) {
        Conversation.findAll({
            where: { ticketId: req.params.id },
            include: User,
            order: [['createdAt', 'DESC']],
        })
            .then((conversations) => {
                Ticket.findByPk(req.params.id)
                    .then((tickets) => {
                        if (!tickets) {
                            flashMessage(res, 'error', 'ERROR: The support ticket that you are looking for does not exist.');
                            res.redirect('/support/admin/ticket-overview');
                            return;
                        }

                        res.render('support/admin/view-ticket', {
                            tickets, conversations,
                            title: tickets.ticketSubject + ' | MyTube'
                        });
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    } else {
        flashMessage(res, 'error', 'ERROR: You do not have the necessary permissions to view this page.');
        res.redirect('/');
        return;
    }
});

// -+ [OK] View Ticket (Add Reply POST Request) +-
router.post('/admin/view-ticket/:id', ensureAuthenticated, async (req, res) => {
    var adminCheck = req.user.roletypeId
    if (adminCheck == 2) {
        let conversation = req.body.conversation;
        let ticketStatusId = 2;

        let getCreatorEmail = null;
        try {
            getCreatorEmail = await Ticket.findOne({
                where: { id: req.params.id },
                include: User
            })
        }
        catch {
            flashMessage(res, 'error', 'ERROR: The support ticket that you are updating does not exist.');
            res.redirect('/support/admin/ticket-overview');
            return;
        }
        let creatorEmail = getCreatorEmail.user.email;

        let ticketId = req.params.id;
        let userId = req.user.id;

        Ticket.findByPk(req.params.id)
            .then((tickets) => {
                if (tickets.ticketStatusId == 4) {
                    flashMessage(res, 'error', 'ERROR: This support ticket has already been marked as solved and no replies can be added.');
                    res.redirect('/support/admin/ticket-overview');
                    return;
                }

                Conversation.create(
                    {
                        userId, conversation, ticketId
                    }
                )

                Ticket.update(
                    { ticketStatusId },
                    { where: { id: req.params.id } }
                )
                    .then(() => {
                        // Send email to ticket creator:
                        sendTicketAwaitingUserResponseEmail.sendEmail(tickets.ticketSubject, creatorEmail);

                        console.log('Ticket #' + ticketId + ' has been updated successfully.');
                        res.redirect('/support/admin/ticket-overview');
                    })
                    .catch(err => console.log(err))
            })
    } else {
        flashMessage(res, 'error', 'ERROR: You do not have the necessary permissions to view this page.');
        res.redirect('/');
        return;
    }
});

// -+ [OK] View Ticket (Mark as Solved POST Request) +-
router.post('/admin/mark-solved/:id', ensureAuthenticated, (req, res) => {
    var adminCheck = req.user.roletypeId
    if (adminCheck == 2) {
        Ticket.findByPk(req.params.id)
            .then((ticketInDB) => {
                if (!ticketInDB) {
                    flashMessage(res, 'error', 'ERROR: The support ticket that you are updating does not exist.');
                    res.redirect('/support/history');
                    return;
                }
                let ticketStatusId = 4;
                let ticketId = req.params.id;

                Ticket.findByPk(req.params.id)
                    .then((tickets) => {
                        if (tickets.ticketStatusId == 4) {
                            flashMessage(res, 'error', 'ERROR: This support ticket has already been marked as solved.');
                            res.redirect('/support/admin/ticket-overview');
                            return;
                        }
                        Ticket.update(
                            { ticketStatusId },
                            { where: { id: req.params.id } }
                        )
                            .then(() => {
                                flashMessage(res, 'success', 'You have successfully marked support ticket #' + ticketId + ' as solved.');
                                res.redirect('/support/admin/ticket-overview');
                            })
                            .catch(err => console.log(err));
                    })
            })
    } else {
        flashMessage(res, 'error', 'ERROR: You do not have the necessary permissions to view this page.');
        res.redirect('/');
        return;
    }
});
// Admin View END

module.exports = router;