const router = require('express').Router()
const Update = require('../db/models/update')
const Expo = require('expo-server-sdk')
let expo = new Expo()

module.exports = router

router.post('/', (req, res, next) => {
  Update.create(req.body)
  .then(newUpdate => {
    return newUpdate.getPrayer()
  })
  .then(updatedPrayer => {
    updatedPrayer.getFollower()
    .then(arrOfFollowers => {
      return arrOfFollowers.map(user => ({
        to: user.pushToken,
        title: 'A prayer you are following was updated',
        body: `${updatedPrayer.subject}`,
        sound: 'default',
        data: {
          type: 'follow-update',
          body: `A prayer you are following was updated: ${updatedPrayer.subject}`
        },
        channelId: 'follow-update'
      }))
    })
    .then(messages => expo.sendPushNotificationsAsync(messages))
  })
  .then(() => res.status(200).send('Prayer successfully updated'))
  .catch(next)
})

router.delete('/:updateId', (req, res, next) => {
  Update.findById(req.params.updateId)
  .then(foundUpdate => foundUpdate.destroy())
  .then(() => res.status(201).send('Update delete'))
  .catch(next)
})
