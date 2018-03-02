const router = require('express').Router()
const Flag = require('../db/models/flag')
const nodemailer = require('nodemailer')

module.exports = router

const smtpTransport = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
})

router.post('/', (req, res, next) => {
  Flag.create(req.body)
  .then(newFlag => {
    res.status(201).send(newFlag)
    smtpTransport.sendMail({
      from: process.env.NODEMAILER_USER,
      to: process.env.NODEMAILER_USER,
      subject: 'New Flag in Ora',
      text: `User ${newFlag.flaggerId} just flagged prayer ${newFlag.flaggedId}. Check the data base for more details, and take appropriate action.`
    }, (err, info) => {
      if (err) console.error(err)
      else console.log('Flag email sent: ', info.response)
    })
  })
  .catch(console.error)
})
