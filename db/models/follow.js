const Sequelize = require('sequelize')
const db = require('../db')

const Follow = db.define('follow', {
  newUpdates: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
})

module.exports = Follow
