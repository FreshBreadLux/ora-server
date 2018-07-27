const router = require('express').Router()
const Reward = require('../db/models/reward')

module.exports = router

router.get('/', (req, res, next) => {
  Reward.findOne({ where: { date: req.query.date } })
  .then(dailyReward => {
    if (dailyReward) return res.send(dailyReward)
    else return res.send({ imageUrl: 'https://images.unsplash.com/photo-1504870712357-65ea720d6078?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d91ffea4f802668c524df165caf52704&auto=format&fit=crop&w=2800&q=80', iconColor: '#000' })
  })
  .catch(next)
})
