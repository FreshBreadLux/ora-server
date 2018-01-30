const User = require('./user')
const Prayer = require('./prayer')
const Flag = require('./flag')
const FlagReason = require('./flagreason')

/** Associations **/
User.hasMany(Prayer)
Prayer.belongsTo(User)
User.belongsToMany(Prayer, { through: 'follow', as: 'followed', foreignKey: 'followerId' })
Prayer.belongsToMany(User, { through: 'follow', as: 'follower', foreignKey: 'followedId' })
User.belongsToMany(Prayer, { through: Flag, as: 'flagged', foreignKey: 'flaggerId' })
Prayer.belongsToMany(User, { through: Flag, as: 'flagger', foreignKey: 'flaggedId' })
User.belongsToMany(Prayer, { through: 'view', as: 'viewed', foreignKey: 'viewerId' })
Prayer.belongsToMany(User, { through: 'view', as: 'viewer', foreignKey: 'viewedId' })
Flag.belongsTo(FlagReason)

module.exports = {
  User,
  Prayer,
  Flag,
  FlagReason
}
