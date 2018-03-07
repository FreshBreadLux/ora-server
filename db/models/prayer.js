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
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  // Unused as of version 1.0.1; may be used in later versions
  unseenViews: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  unseenFollows: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
})

module.exports = Prayer
