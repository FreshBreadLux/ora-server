const router = require('express').Router()
const Flag = require('../db/models/flag')
const User = require('../db/models/user')

module.exports = router

router.post('/', (req, res, next) => {
  User.findById(req.body.flaggerId)
  .then(foundUser => foundUser.addFlagged(req.body.flaggedId))
  .then(newFlag => res.status(201).send(newFlag))
  .catch(console.error)
})
