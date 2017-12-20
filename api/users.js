const router = require('express').Router()
const User = require('../db/models/user')
const jwt = require('jsonwebtoken')
const config = require('../config.json')

module.exports = router

function createToken(user) {
  return jwt.sign({email: user.email}, config.secret)
}

router.get('/', (req, res, next) => {
  res.json('Test Get Route for users')
})

router.post('/', (req, res, next) => {
  User.create(req.body)
  .then(user => res.status(201).send({
    userId: user.id,
    jwToken: createToken(user),
  }))
  .catch(console.error)
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
