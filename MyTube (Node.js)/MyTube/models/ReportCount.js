const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const ReportCount = db.define('reportcount', {
    Sexual:{
        type: Sequelize.INTEGER
    },
    Violent:{
        type: Sequelize.INTEGER
    },
    Spam:{
        type: Sequelize.INTEGER
    },
});


module.exports = ReportCount;
