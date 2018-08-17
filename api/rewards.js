const router = require('express').Router()
const Reward = require('../db/models/reward')
const Artist = require('../db/models/artist')

module.exports = router

router.get('/', (req, res, next) => {
  Reward.findOne({
    where: { date: req.query.date },
    include: [{ model: Artist }]
  })
  .then(dailyReward => {
    if (dailyReward) return res.send(dailyReward)
    else return res.send({ imageUrl: 'https://s3.us-east-2.amazonaws.com/ora-images/church-reflection.jpg', iconColor: '#fff' })
  })
  .catch(next)
})
