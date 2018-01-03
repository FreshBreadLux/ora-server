const User = require('./user')
const Prayer = require('./prayer')
const Follow = require('./follow')
const Flag = require('./flag')

/** Associations **/
User.hasMany(Prayer)
Prayer.belongsTo(User)

module.exports = {
  User,
  Prayer,
  Follow,
  Flag
}
