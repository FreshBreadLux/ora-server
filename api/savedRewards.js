const router = require('express').Router()
const User = require('../db/models/user')

module.exports = router

router.post('/', (req, res, next) => {
  User.findById(req.body.userId)
  .then(foundUser => foundUser.addSaved(req.body.dailyReward.id))
  .then(newSavedReward => res.status(201).send(newSavedReward))
  .catch(next)
})

router.delete('/savedId/:savedId/saverId/:saverId', (req, res, next) => {
  User.findById(req.params.saverId)
  .then(user => {
    user.removeSaved(req.params.savedId)
  })
  .then(() => res.status(201).send('Saved reward successfully deleted'))
  .catch(next)
})
