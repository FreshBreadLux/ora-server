const User = require('./user')
const Prayer = require('./prayer')
const Flag = require('./flag')
const FlagReason = require('./flagreason')

/** Associations **/
User.hasMany(Prayer)
Prayer.belongsTo(User)
User.belongsToMany(Prayer, { through: 'follow' })
Prayer.belongsToMany(User, { through: 'follow' })
User.belongsToMany(Prayer, { through: Flag })
Prayer.belongsToMany(User, { through: Flag })
User.belongsToMany(Prayer, { through: 'view' })
Prayer.belongsToMany(User, { through: 'view' })
Flag.belongsTo(FlagReason)

module.exports = {
  User,
  Prayer,
  Flag,
  FlagReason
}
