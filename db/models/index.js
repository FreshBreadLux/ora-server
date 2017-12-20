const User = require('./user')
const Prayer = require('./prayer')

/** Associations **/
User.hasMany(Prayer)
Prayer.belongsTo(User)
User.belongsToMany(Prayer, { through: 'Flagged' })
Prayer.belongsToMany(User, { through: 'Flagged' })
User.belongsToMany(Prayer, { through: 'Following' })
Prayer.belongsToMany(User, { through: 'Following' })

module.exports = {
  User,
  Prayer,
}
