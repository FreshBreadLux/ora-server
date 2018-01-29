const User = require('./user')
const Prayer = require('./prayer')
const Follow = require('./follow')
const Flag = require('./flag')

/** Associations **/
User.hasMany(Prayer)
Prayer.belongsTo(User)

// game plan

// associations

// user has many prayer (as author)
// user belongs to many prayer through Follow, as follow
// prayer belongs to many user through Follow, as follower
// user belongs to many prayer (and v.v.) through Flag, as reporter

// tables:

// user: id, name, etc
// prayer: id, author_id, text
// followers: follower_id, prayer_id
// flags: prayer_id, reporter_id, reason

module.exports = {
  User,
  Prayer,
  Follow,
  Flag
}
