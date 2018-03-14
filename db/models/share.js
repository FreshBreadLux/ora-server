const Sequelize = require('sequelize')
const db = require('../db')

const Share = db.define('share', {
  // Unused as of version 1.0.1; may be used in later versions
  unseenUpdates: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
})

module.exports = Share
