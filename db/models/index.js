const User = require('./user')
const Prayer = require('./prayer')
const Follow = require('./follow')

/** Associations **/
User.hasMany(Prayer)
Prayer.belongsTo(User)
Follow.hasOne(User)
Follow.hasOne(Prayer)

module.exports = {
  User,
  Prayer,
  Follow
}
