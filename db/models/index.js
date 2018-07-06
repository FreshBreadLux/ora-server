const User = require('./user')
const Prayer = require('./prayer')
const Flag = require('./flag')
const Follow = require('./follow')
const FlagReason = require('./flagreason')
const Update = require('./update')
const Reflection = require('./reflection')
const Reward = require('./reward')
const Share = require('./share')
const Group = require('./group')

/** Associations **/
// Users authoring prayers
User.hasMany(Prayer)
Prayer.belongsTo(User)
// Users following prayers
User.belongsToMany(Prayer, { through: Follow, as: 'followed', foreignKey: 'followerId' })
Prayer.belongsToMany(User, { through: Follow, as: 'follower', foreignKey: 'followedId' })
// Users flagging prayers
User.belongsToMany(Prayer, { through: Flag, as: 'flagged', foreignKey: 'flaggerId' })
Prayer.belongsToMany(User, { through: Flag, as: 'flagger', foreignKey: 'flaggedId' })
// Users viewing prayers
User.belongsToMany(Prayer, { through: 'view', as: 'viewed', foreignKey: 'viewerId' })
Prayer.belongsToMany(User, { through: 'view', as: 'viewer', foreignKey: 'viewedId' })
// Categories for flagged prayers
Flag.belongsTo(FlagReason)
// Prayers getting updates
Prayer.hasMany(Update)
Update.belongsTo(Prayer)
// Users saving rewards
User.belongsToMany(Reward, { through: 'savedReward', as: 'saved', foreignKey: 'saverId' })
Reward.belongsToMany(User, { through: 'savedReward', as: 'saver', foreignKey: 'savedId' })

/** Associations for version 2 **/
// User sharing private prayers with other users
User.belongsToMany(Prayer, { through: Share, as: 'sharedPrayer', foreignKey: 'sharedWithId' })
Prayer.belongsToMany(User, { through: Share, as: 'sharedWith', foreignKey: 'sharedPrayerId' })
// Users sharing prayers in groups
Prayer.belongsToMany(Group, { through: 'groupPrayer', as: 'group', foreignKey: 'prayerId' })
Group.belongsToMany(Prayer, { through: 'groupPrayer', as: 'prayer', foreignKey: 'groupId'})
// Users forming groups
User.belongsToMany(Group, { through: 'groupLeadership', as: 'leaderGroup', foreignKey: 'leaderId'})
Group.belongsToMany(User, { through: 'groupLeadership', as: 'leader', foreignKey: 'groupId'})
// Users joining groups
User.belongsToMany(Group, { through: 'groupMembership', as: 'memberGroup', foreignKey: 'memberId'})
Group.belongsToMany(User, { through: 'groupMembership', as: 'member', foreignKey: 'groupId'})

module.exports = {
  User,
  Prayer,
  Flag,
  FlagReason,
  Update,
  Reflection,
  Reward,
  Share,
  Group
}
