const router = require('express').Router()
const Follow = require('../db/models/follow')
const User = require('../db/models/user')

module.exports = router

router.post('/', (req, res, next) => {
  User.findById(req.body.userId)
  .then(foundUser => {
    return Follow.create({
      followerUserId: foundUser.id,
      followerPushToken: foundUser.pushToken,
      prayerId: req.body.prayer.id,
      subject: req.body.prayer.subject,
      body: req.body.prayer.body,
      totalViews: req.body.prayer.totalViews,
      closed: req.body.prayer.closed,
    })
  })
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
