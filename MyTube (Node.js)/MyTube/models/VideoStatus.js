const sequelize = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Video = require('./Video');

// (async () => {
//     // await sequelize.sync({ force: true });
//     // Code here

//     const status1 = await Videostatus.create({ videostatus: "Shown" }); module.exports = Videostatus;
//     await status1.save();
//     const status2 = await Videostatus.create({ videostatus: "Hidden" }); module.exports = Videostatus;
//     await status2.save();
//     const status3 = await Videostatus.create({ videostatus: "Deleted" }); module.exports = Videostatus;
//     await status3.save();
// })();


const Videostatus = db.define('videostatus',
    {
        statusname: { type: Sequelize.STRING },
        // key: { type: Sequelize.INTEGER }
    });






module.exports = Videostatus;
