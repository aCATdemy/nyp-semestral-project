const mySQLDB = require('./DBConfig');

// Ticket:
const Ticket = require('../models/Ticket');
const Conversation = require('../models/Conversation');
// Ticket Status:
const TicketStatus = require('../models/TicketStatus');

// User:
const User = require('../models/User');
// Role Type:
const RoleType = require('../models/RoleType');

// Video:
const Video = require('../models/Video');
// Subscibers:
const Subscribers = require('../models/Subscribers');
// Video Status:
const Videostatus = require('../models/VideoStatus');

// Comment:
const Comment = require('../models/Comment');
// Like:
const Like = require('../models/Like');

// Post:
const Post = require('../models/Post');
const PostFile = require('../models/PostFile');
const Report = require('../models/Report');
const ReportCount = require('../models/ReportCount');
const PostComment = require('../models/PostComment');


const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            // User Management:
            RoleType.hasOne(User);
            User.belongsTo(RoleType);

            // Comment System:
            User.hasMany(Comment);
            Comment.belongsTo(User);

            // Support Ticket System:
            User.hasMany(Ticket);
            Ticket.belongsTo(User);
            User.hasMany(Conversation);
            Conversation.belongsTo(User);
            Ticket.hasMany(Conversation);
            Conversation.belongsTo(Ticket);
            TicketStatus.hasOne(Ticket);
            Ticket.belongsTo(TicketStatus);

            // Like Function:
            Video.hasMany(Like)
            Like.belongsTo(Video)

            // Video Management:
            User.hasMany(Video);
            Video.belongsTo(User);
            Video.hasMany(Comment);
            Comment.belongsTo(Video);

            // Subscribe Function:
            User.hasMany(Subscribers, { foreignKey: 'userId' });
            Subscribers.belongsTo(User, { foreignKey: 'userId' });
            // User.belongsToMany(Subscribers, { through: User_Subcriber });
            // Subscribers.belongsToMany(User, { through: User_Subcriber });

            // Video Status:
            Videostatus.hasOne(Video);
            Video.belongsTo(Videostatus);

            //Community Post:
            User.hasMany(Post);
            Post.belongsTo(User);

            Post.hasMany(PostFile);
            PostFile.belongsTo(Post);

            Post.hasMany(Report);
            Report.belongsTo(Post);
            
            User.hasMany(Report);
            Report.belongsTo(User);

            Post.hasOne(ReportCount);
            ReportCount.belongsTo(Post);

            Post.hasMany(PostComment);
            PostComment.belongsTo(Post);

            User.hasMany(PostComment);
            PostComment.belongsTo(User);

            mySQLDB.sync({
                force: drop
            });

            console.log('SYSTEM: Database connected successfully!');
        })
        .catch(err =>
            console.log(err));
};

module.exports = { setUpDB };