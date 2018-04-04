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

// THE FUNCTION REGISTERNOTIFICATION HANDLES NOTIFICATION BATCHING
async function registerNotification(updatedPrayer) {
  const ONE_HOUR = 1000 * 60 * 2
  const prayerId = updatedPrayer.id
  if (notificationQueues[prayerId] && notificationQueues[prayerId].sentOne === true) {
    // IF A USER HAS RECENTLY RECEIVED ONE NOTIFICATION, CANCEL THE RESET AND
    // QUEUE ANOTHER TO BE SENT IN AN HOUR
    clearTimeout(notificationQueues[prayerId].cancelReset)
    notificationQueues[prayerId] = {
      number: 1,
      sentOne: false,
      cancel: null,
      pushNotification: {
        to: updatedPrayer.user.pushToken,
        sound: 'default',
        body: `Someone is praying for your intention: ${updatedPrayer.subject}`,
        data: {
          type: 'new-view',
          body: `Someone is praying for your intention: ${updatedPrayer.subject}`
        },
      }
    }
    const cancellationToken = setTimeout(async () => {
      await expo.sendPushNotificationAsync(notificationQueues[prayerId].pushNotification)
      notificationQueues[prayerId] = null
    }, ONE_HOUR)
    notificationQueues[prayerId].cancelNotification = cancellationToken
  } else if (notificationQueues[prayerId]) {
    // IF THERE IS ALREADY A QUEUE OF NOTIFICATIONS, COMBINE THEM AND SET A
    // NEW TIMER FOR THEM TO BE SENT
    clearTimeout(notificationQueues[prayerId].cancelNotification)
    notificationQueues[prayerId] = {
      ...notificationQueues[prayerId],
      number: notificationQueues[prayerId].number + 1,
      pushNotification: {
        to: updatedPrayer.user.pushToken,
        sound: 'default',
        body: `${notificationQueues[prayerId].number + 1} people are praying for your intention: ${updatedPrayer.subject}`,
        data: {
          type: 'new-view',
          body: `${notificationQueues[prayerId].number + 1} people are praying for your intention: ${updatedPrayer.subject}`
        },
      }
    }
    const cancellationToken = setTimeout(async () => {
      await expo.sendPushNotificationAsync(notificationQueues[prayerId].pushNotification)
      notificationQueues[prayerId] = null
    }, ONE_HOUR)
    notificationQueues[prayerId].cancelNotification = cancellationToken
  } else {
    // IF THIS IS THE FIRST NOTIFICATION IN AN HOUR, SEND IT, SET THE STATUS,
    // AND SET A TIMER TO RESET THE STATUS
    await expo.sendPushNotificationAsync({
      to: updatedPrayer.user.pushToken,
      sound: 'default',
      body: `Someone is praying for your intention: ${updatedPrayer.subject}`,
      data: {
        type: 'new-view',
        body: `Someone is praying for your intention: ${updatedPrayer.subject}`
      }
    })
    notificationQueues[prayerId] = { sentOne: true }
    const cancellationToken = setTimeout(() => {
      notificationQueues[prayerId] = null
    }, ONE_HOUR)
    notificationQueues[prayerId].cancelReset = cancellationToken
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
    if (Expo.isExpoPushToken(prayer.user.pushToken)) {
      registerNotification(updatedPrayer)
    } else {
      console.error(`${updatedPrayer.user.pushToken} is not valid`)
    }
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
      theme: updatedUser.theme,
      consecutiveDays: updatedUser.consecutiveDays,
      isAdmin: updatedUser.isAdmin,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      investmentTotal: foundUser.investmentTotal
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

router.post('/', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    Prayer.create(req.body)
    .then(prayer => res.json(prayer))
    .catch(next)
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
