const router = require('express').Router()
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

router.post('/forms', (req, res, next) => {
  smtpTransport.sendMail({
    from: req.body.email,
    to: process.env.NODEMAILER_USER,
    subject: `Website ${req.query.form} form: ${req.body.subject}`,
    text: req.body.body
  }, (err, info) => {
    if (err) {
      console.error(err)
      res.status(300).send('There was an error sending your message')
    }
    else {
      console.log('Message sent: ', info)
      res.send('Thank you! Your message has been sent')
    }
  })
})

router.post('/donorSignup', (req, res, next) => {
  smtpTransport.sendMail({
    id: 3,
    to: req.body.email,
    attr: { FIRSTNAME: req.body.firstName }
  }, (err, info) => {
    if (err) {
      console.error('error: ', err)
      console.log('There was an error sending the template')
      res.status(300).send('There was an error sending your message')
    }
    else {
      console.log('Message sent: ', info)
      res.send('Thank you! Your message has been sent')
    }
  })
})
