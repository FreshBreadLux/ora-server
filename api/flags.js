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

const mailOptions = {
  from: NODEMAILER_USER,
  to: NODEMAILER_USER,
  subject: 'New Flag in Ora',
  text: 'Someone has flagged a prayer in the Ora prayer network. Check the database for details and take appropriate action.'
}

router.post('/', (req, res, next) => {
  Flag.create(req.body)
  .then(newFlag => res.status(201).send(newFlag))
  .then(() => smtpTransport.sendMail(mailOptions, (err, resp) => {
    if (err) console.error(err)
    else console.log('Flag email sent: ', resp.message)
  }))
  .catch(console.error)
})
