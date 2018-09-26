const router = require('express').Router()
const Op = require('sequelize').Op
const Prayer = require('../db/models/prayer')
const User = require('../db/models/user')
const Update = require('../db/models/update')
const Expo = require('expo-server-sdk')
let expo = new Expo()
const jwt = require('jsonwebtoken')

module.exports = router

const notificationQueues = {}

/*
  registrationNotification handles notification batching. Rather than immediately send a
  notifiation, it places the notification object into a global object called notificationQueues
  using the user's ID as the key. It starts a setTimeout to send the notification after the user's
  notification interval has expired. If another notification is triggered during that timespan,
  the notifications are combined into a single notification.
*/
function registerNotification(updatedPrayer) {
  const notificationInterval = 1000 * 60 * updatedPrayer.user.notificationInterval
  const prayerId = updatedPrayer.id
  if (notificationQueues[prayerId]) {
    /*
      If there is already a queue of notifications, consolidate the notifications into one
      notification that totals the number of people praying and generalizes the message.
    */
    notificationQueues[prayerId] = {
      ...notificationQueues[prayerId],
      number: notificationQueues[prayerId].number + 1,
      pushNotification: {
        to: updatedPrayer.user.pushToken,
        title: `${notificationQueues[prayerId].number + 1} people are praying for you`,
        body: `${updatedPrayer.subject}`,
        sound: 'default',
        data: {
          type: 'general-prayer',
          body: `${notificationQueues[prayerId].number + 1} people are praying for the requests you've submitted`
        },
        channelId: 'general-prayer'
      }
    }
  } else {
    /*
      If this is the first notification within the notification interval, place it in the queue and
      start a setTimeout for the user's notification interval.
    */
    notificationQueues[prayerId] = {
      number: 1,
      pushNotification: {
        to: updatedPrayer.user.pushToken,
        title: 'Somone is praying for you',
        body: `${updatedPrayer.subject}`,
        sound: 'default',
        data: {
          type: 'general-prayer',
          body: `Someone is praying for your intention: ${updatedPrayer.subject}`
        },
        channelId: 'general-prayer'
      }
    }
    setTimeout(async () => {
      await expo.sendPushNotificationAsync(notificationQueues[prayerId].pushNotification)
      notificationQueues[prayerId] = null
    }, notificationInterval)
  }
}

router.put('/next', async (req, res, next) => {
  try {
    const prayer = await Prayer.findOne({
      where: {
        closed: false,
        userId: { [Op.ne]: req.body.userId },
        id: { [Op.notIn]: req.body.views }
      },
      include: [{
        model: User,
        attributes: ['pushToken', 'id']
      }, {
        model: Update
      }],
      order: [
        ['totalViews'],
        [{model: Update}, 'createdAt']
      ]
    })
    if (!prayer) return res.status(404).send()
    const newView = await prayer.addViewer(req.body.userId)
    const totalViews = prayer.totalViews
    const updatedPrayer = await prayer.update({
      totalViews: totalViews + 1,
    })
    if (Expo.isExpoPushToken(prayer.user.pushToken) && prayer.user.notificationsEnabled) {
      registerNotification(updatedPrayer)
    } else {
      console.error('the recipient has not enabled push notifications')
    }
    const foundUser = await User.findById(req.body.userId)
    const totalPrayers = foundUser.totalPrayers
    const updatedUser = await foundUser.update({
      totalPrayers: totalPrayers + 1,
      prayedToday: true,
    })
    const scrubbedUser = {
      email: updatedUser.email,
      id: updatedUser.id,
      totalPrayers: updatedUser.totalPrayers,
      theme: updatedUser.theme,
      consecutiveDays: updatedUser.consecutiveDays,
      prayedToday: updatedUser.prayedToday,
      isAdmin: updatedUser.isAdmin,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      investmentTotal: updatedUser.investmentTotal,
      oraMissionary: updatedUser.oraMissionary,
      city: updatedUser.city,
      state: updatedUser.state,
      address: updatedUser.address,
      imageUrl: updatedUser.imageUrl,
      age: updatedUser.age,
      gender: updatedUser.gender,
      notificationInterval: updatedUser.notificationInterval,
      notificationsEnabled: updatedPrayer.notificationsEnabled,
    }
    res.send({newView, updatedPrayer, scrubbedUser})
  } catch (err) {
    next(err)
  }
})

router.put('/edit/:prayerId', (req, res, next) => {
  Prayer.findById(req.params.prayerId)
  .then(foundPrayer => foundPrayer.update(req.body))
  .then(updatedPrayer => res.status(201).send(updatedPrayer))
  .catch(next)
})

router.put('/close/:prayerId', (req, res, next) => {
  Prayer.findById(req.params.prayerId)
  .then(foundPrayer => foundPrayer.update(req.body))
  .then(closedPrayer => res.status(201).send(closedPrayer))
  .catch(next)
})

router.post('/', async (req, res, next) => {
  console.log('req.body:', req.body)
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    const prayer = await Prayer.create(req.body)
    res.json(prayer)
    const user = await User.findById(req.body.userId)
    const totalSubmitted = user.totalSubmitted
    user.update({ totalSubmitted: totalSubmitted + 1 })
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})

router.delete('/:prayerId', (req, res, next) => {
  try {
    const verify = jwt.verify(req.headers.token, process.env.SECRET)
    Prayer.findById(req.params.prayerId)
    .then(prayer => {
      if (verify.id === prayer.userId) {
        prayer.destroy()
      } else {
        throw new Error('Token ID and user ID do not match')
      }
    })
    .then(() => res.status(201).send('Prayer deleted'))
    .catch(next)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})
