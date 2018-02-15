const router = require('express').Router()
const Flag = require('../db/models/flag')
const nodemailer = require('nodemailer')
const { NODEMAILER_USER, NODEMAILER_PASS } = require('../secrets')

module.exports = router

const smtpTransport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASS
  }
})

router.post('/', (req, res, next) => {
  console.log('Blah')
  Flag.create(req.body)
  .then(newFlag => res.status(201).send(newFlag))
  .catch(console.error)
})
