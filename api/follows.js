const router = require('express').Router()
const User = require('../db/models/user')
const Prayer = require('../db/models/prayer')
const Expo = require('expo-server-sdk')
let expo = new Expo()

module.exports = router

router.post('/', (req, res, next) => {
  User.findById(req.body.userId)
  .then(foundUser => foundUser.addFollowed(req.body.currentPrayer.id))
  .then(newFollow => {
    let prayer = req.body.currentPrayer
    res.status(201).send(newFollow)
    if (Expo.isExpoPushToken(prayer.user.pushToken)) {
      return expo.sendPushNotificationAsync({
        to: prayer.user.pushToken,
        sound: 'default',
        body: `Someone started following your prayer: ${prayer.subject}`,
        data: {
          type: 'new-follow',
          body: `Someone started following your prayer: ${prayer.subject}`
        },
      })
    } else {
      console.error(`${prayer.user.pushToken} is not valid`)
    }
  })
  .then(() => {
    Prayer.findById(req.body.currentPrayer.id)
    .then(followedPrayer => {
      let totalFollows = followedPrayer.totalFollows
      followedPrayer.update({
        totalFollows: totalFollows + 1
      })
    })
  })
  .catch(next)
})

router.delete('/followedId/:followedId/followerId/:followerId', (req, res, next) => {
  Prayer.findById(req.params.followedId)
  .then(prayer => {
    prayer.removeFollower(req.params.followerId)
    let totalFollows = prayer.totalFollows
    prayer.update({ totalFollows: totalFollows - 1 })
  })
  .then(() => res.status(201).send('Unfollow successful'))
  .catch(next)
})

router.put('/notify/followedId/:followedId', async (req, res, next) => {
  try {
    const prayer = await Prayer.findOne({
      where: { id: req.params.followedId },
      include: [{model: User}]
    })
    if (Expo.isExpoPushToken(prayer.user.pushToken)) {
      await expo.sendPushNotificationAsync({
        to: prayer.user.pushToken,
        sound: 'default',
        body: `A follower is praying for your intention: ${prayer.subject}`,
        data: {
          type: 'follower-prayer',
          body: `A follower is praying for your intention: ${prayer.subject}`
        },
      })
      res.status(201).send(prayer)
    } else {
      console.error(`${prayer.user.pushToken} is not valid`)
      res.status(201).send(prayer)
    }
  } catch (err) {
    next(err)
  }
})
