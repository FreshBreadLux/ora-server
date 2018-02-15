const router = require('express').Router()
const Flag = require('../db/models/flag')

module.exports = router

router.post('/', (req, res, next) => {
  Flag.create(req.body)
  .then(newFlag => res.status(201).send(newFlag))
  .catch(console.error)
})
