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
    if (dailyReward) {
      return res.send(dailyReward)
    } else {
      return Reward.findOne({
        where: { id: 1 },
        include: [{ model: Artist }]
      })
      .then(defaultReward => res.send(defaultReward))
    }
  })
  .catch(next)
})
