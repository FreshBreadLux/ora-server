const User = require('./user')
const Prayer = require('./prayer')
const Flag = require('./flag')
const Follow = require('./follow')
const FlagReason = require('./flagreason')
const Update = require('./update')

/** Associations **/
User.hasMany(Prayer)
Prayer.belongsTo(User)
User.belongsToMany(Prayer, { through: Follow, as: 'followed', foreignKey: 'followerId' })
Prayer.belongsToMany(User, { through: Follow, as: 'follower', foreignKey: 'followedId' })
User.belongsToMany(Prayer, { through: Flag, as: 'flagged', foreignKey: 'flaggerId' })
Prayer.belongsToMany(User, { through: Flag, as: 'flagger', foreignKey: 'flaggedId' })
User.belongsToMany(Prayer, { through: 'view', as: 'viewed', foreignKey: 'viewerId' })
Prayer.belongsToMany(User, { through: 'view', as: 'viewer', foreignKey: 'viewedId' })
Flag.belongsTo(FlagReason)
Prayer.hasMany(Update)
Update.belongsTo(Prayer)

module.exports = {
  User,
  Prayer,
  Flag,
  FlagReason,
  Update
}
