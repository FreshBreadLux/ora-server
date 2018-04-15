const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/prayers', require('./prayers'))
router.use('/follows', require('./follows'))
router.use('/flags', require('./flags'))
router.use('/updates', require('./updates'))
router.use('/flagReasons', require('./flagReasons'))
router.use('/formEmails', require('./formEmails'))
router.use('/donations', require('./donations'))
