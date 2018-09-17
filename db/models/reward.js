const Sequelize = require('sequelize')
const db = require('../db')

const Reward = db.define('reward', {
  imageUrl: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  date: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  fullText: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  fullSource: {
    type: Sequelize.STRING,
    allowNull: false
  },
  iconColor: {
    type: Sequelize.STRING,
    allowNull: false
  },
  thumbnailUrl: {
    type: Sequelize.TEXT,
  }
})

module.exports = Reward
