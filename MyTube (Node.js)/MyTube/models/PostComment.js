const Sequelize = require('sequelize');

const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const PostComment = db.define('postcomment', {
    comment: {
        type: Sequelize.STRING
    },
    edited:{
        type: Sequelize.BOOLEAN
    }
});

module.exports = PostComment;
