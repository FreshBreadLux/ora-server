const Sequelize = require('sequelize')
const db = require('../db')

const Following = db.define('following', {})

module.exports = Following
