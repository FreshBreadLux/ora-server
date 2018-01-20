const Sequelize = require('sequelize')
const db = require('../db')

const Follow = db.define('follow', {
  followerUserId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  followerPushToken: {
    type: Sequelize.STRING,
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

module.exports = Follow
