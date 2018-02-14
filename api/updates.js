const router = require('express').Router()
const Update = require('../db/models/update')
const User = require('../db/models/user')
const Prayer = require('../db/models/prayer')
const Expo = require('expo-server-sdk')
let expo = new Expo()

module.exports = router

router.post('/', (req, res, next) => {
  Update.create(req.body)
  .then(newUpdate => res.send(newUpdate))
  .catch(console.error)
})

router.delete('/:updateId', (req, res, next) => {
  Update.findById(req.params.updateId)
  .then(foundUpdate => foundUpdate.destroy())
  .then(() => res.status(201).send('Update delete'))
  .catch(console.error)
})
