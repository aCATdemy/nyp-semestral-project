const sequelize = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Videostatus = require('../models/VideoStatus')

// Create videos table in MySQL Database
const Video = db.define('video',
    {
        title: { type: Sequelize.STRING },
        description: { type: Sequelize.STRING(2000) },
        posterURL: { type: Sequelize.STRING },
        videoURL: { type: Sequelize.STRING },
    },{
        sequelize,
        paranoid:true
    });




statuslist = ["SHOWN", "HIDDEN"]


async function builddatabase() {
    Videostatus.sync().then(
        () =>
            Videostatus.findAndCountAll()
                .then(result => {
                    if (result.count < 1) {
                        statuslist.forEach((statusitem, index) => {
                            Videostatus.create({
                                id: index + 1,
                                statusname: statusitem
                            })
                        })
                    }
                })
    );
};

builddatabase()
module.exports = Video;