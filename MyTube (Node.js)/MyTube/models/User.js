const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const RoleType = require('../models/RoleType');

// Create users table in MySQL Database
const User = db.define('user',
    {
        username: { type: Sequelize.STRING },
        email: { type: Sequelize.STRING },
        password: { type: Sequelize.STRING },
        subcount: { type: Sequelize.INTEGER, defaultValue: 0 },
        telephone: { type: Sequelize.INTEGER },
        roletypeid: { type: Sequelize.INTEGER },
    });


// Values to be populated into 'ticketstatuses' table:
userRoleType = ["user", "admin"]

/*
    Values mapping in 'ticketstatuses' table:
    --> 1 (user)
    --> 2 (admin)
*/

// Function to populate value for 'ticketstatuses' table:
async function populateRoleDB() {
    RoleType.sync().then(() => RoleType.findAndCountAll()
        .then(result => {
            if (result.count == 0) {
                userRoleType.forEach((userRoleItem, index) => {
                    RoleType.create({
                        id: index + 1,
                        role: userRoleItem
                    })
                })
            }
        })
    )
}

// Call function to populate value for 'ticketstatuses' table:
populateRoleDB()

module.exports = User;