const router = require('express').Router()
const Prayer = require('../db/models/prayer')

module.exports = router

router.put('/next', (req, res, next) => {
  Prayer.findOne({
    order: [['views']]
  })
  .then(prayer => {
    let views = prayer.views
    return prayer.update({
      views: views + 1
    })
  })
  .then(prayer => res.send(prayer))
  .catch(console.error)
})

router.post('/', (req, res, next) => {
  Prayer.create(req.body)
  .then(prayer => res.json(prayer))
  .catch(console.error)
})
