// Date formatting using Moment:
const moment = require('moment');
const formatDate = function (date, targetFormat) {
    return moment(date).format(targetFormat);
};
const replaceCommas = function (value) {
    return value ? value.replace(/,/g, ' | ') : 'None';
};

// Checkbox check:
const checkboxCheck = function (value, checkboxValue) {
    return (value.search(checkboxValue) >= 0) ? 'checked' : '';
};

// Radio check:
const radioCheck = function (value, radioValue) {
    return (value == radioValue) ? 'checked' : '';
};

// Check if ticket is solved:
const ticketSolved = function (value, status, options) {
    return (value == status) ? options.fn(ticketSolved) : options.inverse(ticketSolved);
}

// Check if ticket is solved:
const ticketPending = function (value, status, options) {
    return (value == status) ? options.fn(ticketPending) : options.inverse(ticketPending);
}

// Check if ticket is solved:
const ticketAwaitingUserReply = function (value, status, options) {
    return (value == status) ? options.fn(ticketAwaitingUserReply) : options.inverse(ticketAwaitingUserReply);
}
// Comparism Operators
const math = Handlebars.registerHelper("when", function (operand_1, operator, operand_2, options) {
    var operators = {
        'eq': function (l, r) { return l == r; },
        'noteq': function (l, r) { return l != r; },
        'gt': function (l, r) { return Number(l) > Number(r); },
        'or': function (l, r) { return l || r; },
        'and': function (l, r) { return l && r; },
        '%': function (l, r) { return (l % r) === 0; }
    }
        , result = operators[operator](operand_1, operand_2);

    if (result) return options.fn(this);
    else return options.inverse(this);
});

module.exports = {
    formatDate,
    replaceCommas,
    checkboxCheck,
    radioCheck,
    ticketSolved,
    ticketPending,
    ticketAwaitingUserReply,
    math,
};