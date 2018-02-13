const Sequelize = require('sequelize')
const db = require('../db')

const Update = db.define('update', {
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

module.exports = Update
