const router = require('express').Router()
const Follow = require('../db/models/follow')
const User = require('../db/models/user')
const Expo = require('expo-server-sdk')
let expo = new Expo()

module.exports = router

router.post('/', (req, res, next) => {
  User.findById(req.body.userId)
  .then(foundUser => {
    return Follow.create({
      followerUserId: foundUser.id,
      followerPushToken: foundUser.pushToken,
      prayerId: req.body.prayer.id,
      subject: req.body.prayer.subject,
      body: req.body.prayer.body,
      totalViews: req.body.prayer.totalViews,
      closed: req.body.prayer.closed,
    })
  })
  .then(newFollow => {
    let prayer = req.body.prayer
    res.status(201).send(newFollow)
    if (Expo.isExpoPushToken(prayer.user.pushToken)) {
      return expo.sendPushNotificationAsync({
        to: prayer.user.pushToken,
        sound: 'default',
        body: `Someone started following your prayer: ${prayer.subject}`,
        data: { ora: 'pro nobis' },
        badge: 1
      })
    } else {
      console.error(`${prayer.user.pushToken} is not valid`)
    }
  })
  .catch(console.error)
})

router.delete('/:followId', (req, res, next) => {
  Follow.findById(req.params.followId)
  .then(follow => follow.destroy())
  .then(() => res.status(201).send('Unfollow successful'))
  .catch(console.error)
})
