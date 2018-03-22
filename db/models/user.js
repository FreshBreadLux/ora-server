const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  salt: {
    type: Sequelize.STRING
  },
  pushToken: {
    type: Sequelize.STRING
  },
  totalPrayers: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  consecutiveDays: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  prayedToday: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  theme: {
    type: Sequelize.STRING,
    defaultValue: 'Rome',
    allowNull: false
  },
  resetCode: {
    type: Sequelize.STRING
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  // Unused as of version 1.0.1; may be used in later versions
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING
  },
  city: {
    type: Sequelize.STRING
  },
  state: {
    type: Sequelize.STRING
  },
  zip: {
    type: Sequelize.STRING
  },
  phoneNumber: {
    type: Sequelize.INTEGER
  },
  age: {
    type: Sequelize.INTEGER
  },
  gender: {
    type: Sequelize.ENUM('Male', 'Female')
  },
  stripeOneTimeToken: {
    type: Sequelize.STRING
  },
  stripeCustomerId: {
    type: Sequelize.STRING
  },
  unseenLevelUp: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

module.exports = User

/**
 * instanceMethods
 */
User.prototype.correctPassword = function (candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt) === this.password
}

/**
 * classMethods
 */
User.generateSalt = function () {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function (plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

User.updateOrCreate = function (user, callback) {
  User.findOrCreate(user)
  .then(returnedUser => callback(null, returnedUser))
  .catch(console.error)
}

/**
 * hooks
 */
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password, user.salt)
  }
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
