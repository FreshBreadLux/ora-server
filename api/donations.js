const router = require('express').Router()

module.exports = router

router.post('/oneTime', (req, res, next) => {
  console.log('req.body: ', req.body)
})
