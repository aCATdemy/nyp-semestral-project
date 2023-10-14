const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Report = db.define('report', {
    content:{
        type: Sequelize.STRING
    },
    removedAt: {
        type: Sequelize.DATE
    }
});


module.exports = Report;
