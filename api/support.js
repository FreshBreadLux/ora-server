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

router.post('/', (req, res, next) => {
  console.log('Hit the support post route: ', req.body)
  smtpTransport.sendMail({
    from: req.body.email,
    to: process.env.NODEMAILER_USER,
    subject: `Website Support Form: ${req.body.subject}`,
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
