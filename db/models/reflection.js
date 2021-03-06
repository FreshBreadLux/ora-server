const Sequelize = require('sequelize')
const db = require('../db')

const Reflection = db.define('reflection', {
  verse: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  verseSource: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fullText: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  fullSource: {
    type: Sequelize.STRING,
    allowNull: false
  },
  date: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
})

module.exports = Reflection
