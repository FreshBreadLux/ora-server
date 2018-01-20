const Sequelize = require('sequelize')
const db = require('../db')

const Flag = db.define('flag', {
  flaggerUserId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  flagCategory: {
    type: Sequelize.ENUM('spam', 'dangerous', 'inappropriate'),
    allowNull: false
  },
  prayerId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
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
  }
})

module.exports = Flag
