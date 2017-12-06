const router = require('express').Router()
const Prayer = require('../db/models/prayer')

module.exports = router

router.get('/', (req, res, next) => {
  res.json('Test Get Route for prayers')
})
