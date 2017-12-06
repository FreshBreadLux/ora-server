const router = require('express').Router()
const User = require('../db/models/user')

module.exports = router

router.get('/', (req, res, next) => {
  res.json('Test Get Route for users')
})
