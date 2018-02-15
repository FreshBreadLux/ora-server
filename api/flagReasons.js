const router = require('express').Router()
const FlagReason = require('../db/models/flagreason')

module.exports = router

router.get('/', (req, res, next) => {
  FlagReason.findAll({ order: [['createdAt']] })
  .then(flagReasons => res.send(flagReasons))
  .catch(console.error)
})
