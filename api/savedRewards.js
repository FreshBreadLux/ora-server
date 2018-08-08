const router = require('express').Router()
const User = require('../db/models/user')

module.exports = router

router.post('/', (req, res, next) => {
  User.findById(req.body.userId)
  .then(foundUser => foundUser.addSaved(req.body.reward.id))
  .then(newSavedReward => res.status(201).send(newSavedReward))
  .catch(next)
})
