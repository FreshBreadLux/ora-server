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
