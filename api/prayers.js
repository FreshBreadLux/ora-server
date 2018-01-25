const router = require('express').Router()
const Op = require('sequelize').Op
const Prayer = require('../db/models/prayer')
const User = require('../db/models/user')
const Follow = require('../db/models/follow')
const Expo = require('expo-server-sdk')
let expo = new Expo()

module.exports = router

router.put('/next', (req, res, next) => {
  Prayer.findOne({
    where: {
      closed: false,
      userId: { [Op.ne]: req.body.userId }
    },
    order: [['dailyViews'], ['totalViews']],
    include: [{
      model: User,
      attributes: ['pushToken', 'id']
    }]
  })
  .then(prayer => {
    let dailyViews = prayer.dailyViews
    let totalViews = prayer.totalViews
    return prayer.update({
      dailyViews: dailyViews + 1,
      totalViews: totalViews + 1,
    })
  })
  .then(prayer => {
    res.send(prayer)
    if (Expo.isExpoPushToken(prayer.user.pushToken)) {
      return expo.sendPushNotificationAsync({
        to: prayer.user.pushToken,
        sound: 'default',
        body: `Someone is praying for your intention: ${prayer.subject}`,
        data: { ora: 'pro nobis' },
      })
    } else {
      console.error(`${prayer.user.pushToken} is not valid`)
    }
  })
  .then(() => {
    if (req.body.userId) {
      User.findById(req.body.userId)
      .then(foundUser => {
        let totalPrayers = foundUser.totalPrayers
        foundUser.update({
          totalPrayers: totalPrayers + 1
        })
      })
    }
  })
  .catch(console.error)
})

router.put('/update/:prayerId', (req, res, next) => {
  Prayer.findById(req.params.prayerId)
  .then(foundPrayer => foundPrayer.update(req.body))
  .then(updatedPrayer => {
    res.status(201).send(updatedPrayer)
    Follow.findAll({
      where: {
        prayerId: req.params.prayerId
      }
    })
    .then(arrOfFollows => {
      return arrOfFollows.map(follow => ({
        to: follow.followerPushToken,
        sound: 'default',
        body: `A prayer you are following was updated: ${updatedPrayer.subject}`,
        data: { ora: 'pro nobis' }
      }))
    })
    .then(messages => {
      return expo.sendPushNotificationsAsync(messages)
    })
  })
  .catch(console.error)
})

router.put('/close/:prayerId', (req, res, next) => {
  Prayer.findById(req.params.prayerId)
  .then(foundPrayer => foundPrayer.update(req.body))
  .then(closedPrayer => res.status(201).send(closedPrayer))
  .catch(console.error)
})

router.post('/', (req, res, next) => {
  Prayer.create(req.body)
  .then(prayer => res.json(prayer))
  .catch(console.error)
})
