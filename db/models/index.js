const User = require('./user')
const Prayer = require('./prayer')
const Followings = require('./followings')

/** Associations **/
User.hasMany(Prayer)
Prayer.belongsTo(User)
User.belongsToMany(Prayer, { through: 'Flagged' })
Prayer.belongsToMany(User, { through: 'Flagged' })
User.belongsToMany(Prayer, { through: Followings })
Prayer.belongsToMany(User, { through: Followings })

module.exports = {
  User,
  Prayer,
}
