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
  const { userId, email, surveyResults } = req.body
  smtpTransport.sendMail({
    from: process.env.NODEMAILER_USER,
    to: process.env.NODEMAILER_USER,
    subject: 'New Survey Response',
    text: `User email ${email} just submitted the survey.${'\n'}
      UserId: ${userId}${'\n'}
      willingToTakeSurvey: ${surveyResults.willingToTakeSurvey}${'\n'}
      mobileContentBeneficial: ${surveyResults.mobileContentBeneficial}${'\n'}
      topicSelection: ${surveyResults.topicSelection}${'\n'}
      willingToPay: ${surveyResults.willingToPay}`
  }, (err, info) => {
    if (err) return next(err)
    res.status(200).send(info)
  })
})
