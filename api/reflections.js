const router = require('express').Router()
const Reflection = require('../db/models/reflection')

module.exports = router

router.get('/', (req, res, next) => {
  console.log('GETTING DAILY REFLECTION FOR DATE:', req.query.date)
  Reflection.findOne({ where: { date: req.query.date } })
  .then(reflection => {
    if (reflection) return reflection
    else return res.send({ text: 'Our reflections are locally sourced and handpicked' })
  })
  .catch(next)
})
