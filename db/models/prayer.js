const Sequelize = require('sequelize')
const db = require('../db')

const Prayer = db.define('prayer', {
  subject: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  dailyViews: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  totalViews: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  totalFollows: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  closed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
})

module.exports = Prayer
