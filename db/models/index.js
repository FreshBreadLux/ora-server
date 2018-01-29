const User = require('./user')
const Prayer = require('./prayer')
const Flag = require('./flag')
const FlagReason = require('./flagreason')

/** Associations **/
User.hasMany(Prayer)
Prayer.belongsTo(User)
User.belongsToMany(Prayer, { through: 'follow', as: 'followed', foreignKey: 'followedId' })
Prayer.belongsToMany(User, { through: 'follow', as: 'follower', foreignKey: 'followerId' })
User.belongsToMany(Prayer, { through: Flag, as: 'flagged', foreignKey: 'flaggedId' })
Prayer.belongsToMany(User, { through: Flag, as: 'flagger', foreignKey: 'flaggerId' })
User.belongsToMany(Prayer, { through: 'view', as: 'viewed', foreignKey: 'viewedId' })
Prayer.belongsToMany(User, { through: 'view', as: 'viewer', foreignKey: 'viewerId' })
Flag.belongsTo(FlagReason)

module.exports = {
  User,
  Prayer,
  Flag,
  FlagReason
}
