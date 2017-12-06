const User = require('./user')
const Prayer = require('./prayer')

/** Associations **/
User.hasMany(Prayer)
Prayer.belongsTo(User)
User.belongsToMany(Prayer, { through: 'Flagged' })
Prayer.belongsToMany(User, { through: 'Flagged' })

module.exports = {
  User,
  Prayer,
}
