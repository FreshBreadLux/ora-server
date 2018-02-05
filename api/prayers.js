const router = require('express').Router()
const Op = require('sequelize').Op
const Prayer = require('../db/models/prayer')
const User = require('../db/models/user')
const Expo = require('expo-server-sdk')
let expo = new Expo()

module.exports = router

router.put('/next', async (req, res, next) => {
  try {
    const prayer =
    req.body.userId
    ? await Prayer.findOne({
      where: {
        closed: false,
        userId: { [Op.ne]: req.body.userId },
        id: { [Op.notIn]: req.body.views }
      },
      order: [['totalViews']],
      include: [{
        model: User,
        attributes: ['pushToken', 'id']
      }]
    })
    : await Prayer.findOne({
      where: {
        closed: false,
      },
      order: [['totalViews']],
      include: [{
        model: User,
        attributes: ['pushToken', 'id']
      }]
    })
    if (!prayer) return res.status(404).send()
    const newView =
    req.body.userId
    ? await prayer.addViewer(req.body.userId)
    : null
    const totalViews = prayer.totalViews
    const updatedPrayer = await prayer.update({
      totalViews: totalViews + 1,
    })
    res.send({newView, updatedPrayer})
    if (Expo.isExpoPushToken(prayer.user.pushToken)) {
      expo.sendPushNotificationAsync({
        to: updatedPrayer.user.pushToken,
        sound: 'default',
        body: `Someone is praying for your intention: ${updatedPrayer.subject}`,
        data: { body: `Someone is praying for your intention: ${updatedPrayer.subject}` },
      })
    } else {
      console.error(`${updatedPrayer.user.pushToken} is not valid`)
    }
    if (req.body.userId) {
      User.findById(req.body.userId)
      .then(foundUser => {
        const totalPrayers = foundUser.totalPrayers
        foundUser.update({
          totalPrayers: totalPrayers + 1,
          prayedToday: true
        })
      })
    }
  } catch (err) {
    console.error(err)
  }
})

router.put('/update/:prayerId', (req, res, next) => {
  Prayer.findById(req.params.prayerId)
  .then(foundPrayer => foundPrayer.update(req.body))
  .then(updatedPrayer => {
    res.status(201).send(updatedPrayer)
    updatedPrayer.getFollower()
    .then(arrOfFollowers => {
      return arrOfFollowers.map(user => ({
        to: user.pushToken,
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

router.delete('/:prayerId', (req, res, next) => {
  Prayer.findById(req.params.prayerId)
  .then(prayer => prayer.destroy())
  .then(() => res.status(201).send('Prayer deleted'))
  .catch(console.error)
})
