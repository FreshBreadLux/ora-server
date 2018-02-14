const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/prayers', require('./prayers'))
router.use('/follows', require('./follows'))
router.use('/flags', require('./flags'))
router.use('/updates', require('./updates'))
