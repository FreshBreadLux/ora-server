const Sequelize = require('sequelize')
const db = require('../db')

const Group = db.define('group', {
  // Unused as of version 1.0.1; may be used in later versions
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  unseenUpdates: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
})

module.exports = Group
