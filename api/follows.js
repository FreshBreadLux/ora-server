const router = require('express').Router()
const Follow = require('../db/models/follow')

module.exports = router

router.post('/', (req, res, next) => {
  Follow.create(req.body)
  .then(newFollow => {
    res.status(201).send(newFollow)
  })
  .catch(console.error)
})

router.delete('/:followId', (req, res, next) => {
  Follow.findById(req.params.followId)
  .then(follow => follow.destroy())
  .then(() => res.status(201).send('Unfollow successful'))
  .catch(console.error)
})
