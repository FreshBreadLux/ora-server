const Sequelize = require('sequelize')
const db = require('../db')

const Follow = db.define('follow', {
  // Unused as of version 1.0.1; may be used in later versions
  newUpdates: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
})

module.exports = Follow
