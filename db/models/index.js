const User = require('./user')
const Prayer = require('./prayer')
const Flag = require('./flag')
const FlagReason = require('./flagreason')

/** Associations **/
User.hasMany(Prayer)
Prayer.belongsTo(User)
User.belongsToMany(Prayer, { through: 'follow', as: 'followed' })
Prayer.belongsToMany(User, { through: 'follow', as: 'follower' })
User.belongsToMany(Prayer, { through: Flag, as: 'flagged' })
Prayer.belongsToMany(User, { through: Flag, as: 'flagger' })
User.belongsToMany(Prayer, { through: 'view', as: 'viewed' })
Prayer.belongsToMany(User, { through: 'view', as: 'viewer' })
Flag.belongsTo(FlagReason)

module.exports = {
  User,
  Prayer,
  Flag,
  FlagReason
}
