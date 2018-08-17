const Sequelize = require('sequelize')
const db = require('../db')

const Artist = db.define('artist', {
  imageUrl: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  fullName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  bio: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

module.exports = Artist
