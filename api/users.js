const router = require('express').Router()
const User = require('../db/models/user')
const Prayer = require('../db/models/prayer')
const jwt = require('jsonwebtoken')
const config = require('../config.json')

module.exports = router

function createToken(user) {
  return jwt.sign({email: user.email}, config.secret)
}

router.get('/:userId', (req, res, next) => {
  User.findById(req.params.userId)
  .then(foundUser => {
    const scrubbedUser = {
      email: foundUser.email,
      id: foundUser.id,
      totalPrayers: foundUser.totalPrayers,
    }
    res.status(201).send(scrubbedUser)
  })
  .catch(console.error)
})

router.get('/:userId/prayers', (req, res, next) => {
  Prayer.findAll({
    where: {
      userId: req.params.userId
    },
    order: [['createdAt', 'DESC']]
  })
  .then(prayers => res.status(201).send(prayers))
  .catch(console.error)
})

router.get('/:userId/follows', (req, res, next) => {
  User.findById(req.params.userId)
  .then(foundUser => foundUser.getFollowed({order: [['createdAt', 'DESC']]}))
  .then(follows => res.send(follows))
  .catch(console.error)
})

router.get('/:userId/views', (req, res, next) => {
  User.findById(req.params.userId)
  .then(foundUser => foundUser.getViewed())
  .then(views => {
    const prayerIdsOfViews = views.map(view => view.id)
    res.send(prayerIdsOfViews)
  })
  .catch(console.error)
})

router.post('/', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('You must send an email and password')
  }
  User.create(req.body)
  .then(user => {
    res.status(201).send({
      userId: user.id,
      jwToken: createToken(user),
    })
  })
  .catch(error => {
    console.error(error)
    res.status(401).send('That email already exists in our database')
  })
})

router.post('/sessions', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('You must send an email and password')
  }
  User.findOne({where: {email: req.body.email}})
  .then(foundUser => {
    if (!foundUser || !foundUser.correctPassword(req.body.password)) {
      res.status(401).send('The email or password is incorrect')
    } else {
      res.status(201).send({
        userId: foundUser.id,
        jwToken: createToken(foundUser)
      })
    }
  })
  .catch(console.error)
})
