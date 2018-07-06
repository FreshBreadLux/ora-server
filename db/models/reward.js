const Sequelize = require('sequelize')
const db = require('../db')

const Reward = db.define('reward', {
  imageUrl: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  iconColor: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Reward
