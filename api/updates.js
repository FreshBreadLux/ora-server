const router = require('express').Router()
const Update = require('../db/models/update')
const Follow = require('../db/models/follow')
const Expo = require('expo-server-sdk')
let expo = new Expo()

module.exports = router

router.post('/', async (req, res, next) => {
  try {
    const newUpdate = await Update.create(req.body)
    const updatedPrayer = await newUpdate.getPrayer()
    const followers = updatedPrayer.getFollower()
    const messages = followers.map(async user => {
      console.log('user.follow.dataValues:', user.follow.dataValues)
      const { followerId, followedId } = user.follow.dataValues
      const foundFollow = await Follow.findOne({
        where: { followerId, followedId }
      })
      const unseenUpdates = foundFollow.unseenUpdates
      const updatedFollow = await foundFollow.update({
        unseenUpdates: unseenUpdates + 1
      })
      console.log('updatedFollow:', updatedFollow)
      if (Expo.isExpoPushToken(user.pushToken) && user.notificationsEnabled) {
        return {
          to: user.pushToken,
          title: 'A prayer you are following was updated',
          body: `${updatedPrayer.subject}`,
          sound: 'default',
          data: {
            type: 'follow-update',
            body: `A prayer you are following was updated: ${updatedPrayer.subject}`
          },
          channelId: 'follow-update'
        }
      } else {
        console.log('The recipient has not enabled push notifications')
      }
    })
    expo.sendPushNotificationsAsync(messages)
    res.status(200).send('Prayer sucessfully updated')
  } catch (error) {
    next(error)
  }
})

router.delete('/:updateId', (req, res, next) => {
  Update.findById(req.params.updateId)
  .then(foundUpdate => foundUpdate.destroy())
  .then(() => res.status(201).send('Update delete'))
  .catch(next)
})
