const Sequelize = require('sequelize')
const db = require('../db')

const FlagReason = db.define('flagreason', {
  flagCategory: {
    type: Sequelize.STRING,
    allowNull: false
  },
})

module.exports = FlagReason
