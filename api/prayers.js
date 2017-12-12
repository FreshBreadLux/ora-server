const router = require('express').Router()
const Prayer = require('../db/models/prayer')

module.exports = router

router.get('/', (req, res, next) => {
  res.json('Test Get Route for prayers')
})

router.get('/next', (req, res, next) => {
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
