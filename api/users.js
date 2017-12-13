const router = require('express').Router()
const User = require('../db/models/user')
const jwt = require('jsonwebtoken')
const config = require('../config.json')

module.exports = router

function createIdToken(user) {
  return jwt.sign({email: user.email}, config.secret, {expiresIn: 3600})
}

function createAccessToken() {
  return jwt.sign({
    iss: config.issuer,
    aud: config.audience,
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    scope: 'full_access',
    jti: genJti(),
    alg: 'HS256'
  }, config.secret)
}

function genJti() {
  let jti = ''
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 16; i++) {
    jti += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return jti
}

router.get('/', (req, res, next) => {
  res.json('Test Get Route for users')
})

router.post('/', (req, res, next) => {
  User.create(req.body)
  .then(user => res.status(201).send({
    userId: user.id,
    id_token: createIdToken(user),
    access_token: createAccessToken()
  }))
  .catch(console.error)
})
