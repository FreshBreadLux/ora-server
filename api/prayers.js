const router = require('express').Router()
const Prayer = require('../db/models/prayer')
const User = require('../db/models/user')
const Expo = require('expo-server-sdk')
let expo = new Expo()

module.exports = router

router.get('/next', (req, res, next) => {
  Prayer.findOne({
    order: [['views']],
    include: [{
      model: User,
      attributes: ['pushToken']
    }]
  })
  .then(prayer => {
    let views = prayer.views
    return prayer.update({
      views: views + 1
    })
  })
  .then(prayer => {
    res.send(prayer)
    if (prayer.user.pushToken) {
      return expo.sendPushNotificationAsync({
        to: prayer.user.pushToken,
        sound: 'default',
        body: `Someone is praying for your intention: ${prayer.subject}`,
        data: { ora: 'pro nobis' }
      })
    } else {
      return null
    }
  })
  .then(receipt => console.log(receipt))
  .catch(console.error)
})

router.post('/', (req, res, next) => {
  Prayer.create(req.body)
  .then(prayer => res.json(prayer))
  .catch(console.error)
})
