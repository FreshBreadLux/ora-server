const router = require('express').Router()
const Op = require('sequelize').Op
const Prayer = require('../db/models/prayer')
const User = require('../db/models/user')
const Expo = require('expo-server-sdk')
let expo = new Expo()

module.exports = router

router.put('/next', (req, res, next) => {
  Prayer.findOne({
    where: {
      userId: { [Op.ne]: req.body.userId }
    },
    order: [['views']],
    include: [{
      model: User,
      attributes: ['pushToken', 'id']
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
    if (Expo.isExpoPushToken(prayer.user.pushToken)) {
      return expo.sendPushNotificationAsync({
        to: prayer.user.pushToken,
        sound: 'default',
        body: `Someone is praying for your intention: ${prayer.subject}`,
        data: { ora: 'pro nobis' }
      })
    } else {
      console.error(`${prayer.user.pushToken} is not valid`)
    }
  })
  .catch(console.error)
})

router.post('/', (req, res, next) => {
  Prayer.create(req.body)
  .then(prayer => res.json(prayer))
  .catch(console.error)
})
