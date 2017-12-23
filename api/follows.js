const router = require('express').Router()
const Prayer = require('../db/models/prayer')
const User = require('../db/models/user')
const Follow = require('../db/models/follow')

module.exports = router

router.post('/', (req, res, next) => {
  Follow.create(req.body)
  .then(newFollow => {
    res.status(201).send(newFollow)
  })
  .catch(console.error)
})
