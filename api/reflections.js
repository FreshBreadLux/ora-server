const router = require('express').Router()
const Reflection = require('../db/models/reflection')

module.exports = router

router.get('/', (req, res, next) => {
  Reflection.findOne({ where: { date: req.query.date } })
  .then(dailyReflection => {
    if (dailyReflection) return res.send(dailyReflection)
    else return res.send({ verse: 'Our reflections are locally sourced and handpicked' })
  })
  .catch(next)
})
