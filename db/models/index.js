const User = require('./user')
const Prayer = require('./prayer')
const Follow = require('./follow')

/** Associations **/
User.hasMany(Prayer)
Prayer.belongsTo(User)
User.belongsToMany(Follow)
Prayer.belongsToMany(Follow)

module.exports = {
  User,
  Prayer,
  Follow
}
