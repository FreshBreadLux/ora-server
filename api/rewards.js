const router = require('express').Router()
const Reward = require('../db/models/reward')

module.exports = router

router.get('/', (req, res, next) => {
  Reward.findOne({ where: { date: req.query.date } })
  .then(dailyReward => {
    if (dailyReward) return res.send(dailyReward)
    else return res.send({ imageUrl: 'https://s3.us-east-2.amazonaws.com/ora-images/church-reflection.jpg', iconColor: '#000' })
  })
  .catch(next)
})
