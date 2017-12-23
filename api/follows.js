const router = require('express').Router()
const Prayer = require('../db/models/prayer')
const User = require('../db/models/user')
const Follow = require('../db/models/follow')

module.exports = router

router.post('/', (req, res, next) => {
  Follow.create()
  .then(newFollow => {
    newFollow.addPrayer(req.body.prayerId)
    newFollow.addUser(req.body.userId)
    res.status(201).send(newFollow)
  })
  .catch(console.error)
})
