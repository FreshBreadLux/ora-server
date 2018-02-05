const router = require('express').Router()
const User = require('../db/models/user')
const Prayer = require('../db/models/prayer')
const Expo = require('expo-server-sdk')
let expo = new Expo()

module.exports = router

router.post('/', (req, res, next) => {
  User.findById(req.body.userId)
  .then(foundUser => foundUser.addFollowed(req.body.prayer.id))
  .then(newFollow => {
    let prayer = req.body.prayer
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
    Prayer.findById(req.body.prayer.id)
    .then(followedPrayer => {
      let totalFollows = followedPrayer.totalFollows
      followedPrayer.update({
        totalFollows: totalFollows + 1
      })
    })
  })
  .catch(console.error)
})

router.delete('/followedId/:followedId/followerId/:followerId', (req, res, next) => {
  Prayer.findById(req.params.followedId)
  .then(prayer => {
    prayer.removeFollower(req.params.followerId)
    let totalFollows = prayer.totalFollows
    prayer.update({ totalFollows: totalFollows - 1 })
  })
  .then(() => res.status(201).send('Unfollow successful'))
  .catch(console.error)
})
