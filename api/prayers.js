const router = require('express').Router()
const Op = require('sequelize').Op
const Prayer = require('../db/models/prayer')
const User = require('../db/models/user')
const Expo = require('expo-server-sdk')
let expo = new Expo()
const jwt = require('jsonwebtoken')
const config = require('../config.json')

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
    if (Expo.isExpoPushToken(prayer.user.pushToken)) {
      expo.sendPushNotificationAsync({
        to: updatedPrayer.user.pushToken,
        sound: 'default',
        body: `Someone is praying for your intention: ${updatedPrayer.subject}`,
        data: {
          type: 'new-view',
          body: `Someone is praying for your intention: ${updatedPrayer.subject}`
        },
      })
    } else {
      console.error(`${updatedPrayer.user.pushToken} is not valid`)
    }
    if (req.body.userId) {
      const foundUser = await User.findById(req.body.userId)
      const totalPrayers = foundUser.totalPrayers
      const updatedUser = await foundUser.update({
        totalPrayers: totalPrayers + 1,
        prayedToday: true
      })
      const scrubbedUser = {
        email: updatedUser.email,
        id: updatedUser.id,
        totalPrayers: updatedUser.totalPrayers,
      }
      res.send({newView, updatedPrayer, scrubbedUser})
    } else {
      res.send({newView, updatedPrayer})
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
        data: {
          type: 'follow-update',
          body: `A prayer you are following was updated: ${updatedPrayer.subject}`
        }
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
  try {
    jwt.verify(req.headers.token, config.secret)
    Prayer.create(req.body)
    .then(prayer => res.json(prayer))
    .catch(console.error)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})

router.delete('/:prayerId', (req, res, next) => {
  try {
    const verify = jwt.verify(req.headers.token, config.secret)
    Prayer.findById(req.params.prayerId)
    .then(prayer => {
      if (verify.id === prayer.userId) {
        prayer.destroy()
      } else {
        throw new Error('Token ID and user ID do not match')
      }
    })
    .then(() => res.status(201).send('Prayer deleted'))
    .catch(console.error)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})
