const Sequelize = require('sequelize')
const db = require('../db')

const Reflection = db.define('reflection', {
  text: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  }
})

module.exports = Reflection
