const router = require('express').Router()
const User = require('../db/models/user')
const Prayer = require('../db/models/prayer')
const Update = require('../db/models/update')
const jwt = require('jsonwebtoken')
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

function createToken(user) {
  return jwt.sign({id: user.id}, process.env.SECRET)
}

function generateResetCode() {
  let resetCode = ''
  const numbers = '0123456789'
  for (let i = 0; i < 6; i++) {
    resetCode += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }
  return resetCode
}

router.get('/:userId', (req, res, next) => {
  User.findById(req.params.userId)
  .then(foundUser => {
    const scrubbedUser = {
      email: foundUser.email,
      id: foundUser.id,
      totalPrayers: foundUser.totalPrayers,
      theme: foundUser.theme,
      consecutiveDays: foundUser.consecutiveDays,
      isAdmin: foundUser.isAdmin
    }
    res.status(201).send(scrubbedUser)
  })
  .catch(console.error)
})

router.put('/sendResetCode', async (req, res, next) => {
  if (!req.body.email) res.status(400).send('You must send an email')
  const foundUser = await User.findOne({where: {email: req.body.email}})
  if (!foundUser) {
    res.status(401).send('That email is incorrect')
  } else {
    const resetCode = generateResetCode()
    const updatedUser = await foundUser.update({resetCode})
    await smtpTransport.sendMail({
      from: process.env.NODEMAILER_USER,
      to: updatedUser.email,
      subject: 'Reset Your Password for Ora',
      text: `Use code ${resetCode} to reset your password in Ora. This code will expire after one hour.`
    }, (err, info) => {
      if (err) console.error(err)
      else console.log(`Reset code sent to ${updatedUser.email}; info: `, info)
    })
    res.send('Reset code successfully sent')
  }
})

router.put('/resetPassword', async (req, res, next) => {
  if (!req.body.resetCode || !req.body.password) res.status(400).send('You must send a reset code and password')
  const foundUser = await User.findOne({where: {resetCode: req.body.resetCode}})
  if (!foundUser) {
    res.status(401).send('That reset code is incorrect')
  } else {
    await foundUser.update({
      resetCode: null,
      password: req.body.password
    })
    res.send('Password successfully reset')
  }
})

router.put('/:userId', (req, res, next) => {
  User.findById(req.params.userId)
  .then(foundUser => foundUser.update(req.body))
  .then(updatedUser => res.send(updatedUser))
  .catch(console.error)
})

router.get('/:userId/prayers', (req, res, next) => {
  Prayer.findAll({
    where: {
      userId: req.params.userId
    },
    include: [{ model: Update }],
    order: [
      ['createdAt', 'DESC'],
      [{model: Update}, 'createdAt']
    ]
  })
  .then(prayers => res.status(201).send(prayers))
  .catch(console.error)
})

router.get('/:userId/follows', (req, res, next) => {
  User.findById(req.params.userId)
  .then(foundUser => foundUser.getFollowed({
    include: [Update],
    order: [
      ['createdAt', 'DESC'],
      [{model: Update}, 'createdAt']
    ]
  }))
  .then(follows => res.send(follows))
  .catch(console.error)
})

router.get('/:userId/views', (req, res, next) => {
  User.findById(req.params.userId)
  .then(foundUser => foundUser.getViewed())
  .then(views => {
    const prayerIdsOfViews = views.map(view => view.id)
    res.send(prayerIdsOfViews)
  })
  .catch(console.error)
})

router.post('/', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('You must send an email and password')
  }
  User.create(req.body)
  .then(user => {
    res.status(201).send({
      userId: user.id,
      jwToken: createToken(user),
    })
  })
  .catch(error => {
    if (error.errors[0].message === 'Validation isEmail on email failed') {
      return res.status(405).send()
    }
    if (error.errors[0].message === 'email must be unique') {
      return res.status(406).send()
    }
    console.error('error.errors[0].message: ', error.errors[0].message)
  })
})

router.post('/sessions', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('You must send an email and password')
  }
  User.findOne({where: {email: req.body.email}})
  .then(foundUser => {
    if (!foundUser || !foundUser.correctPassword(req.body.password)) {
      res.status(401).send('The email or password is incorrect')
    } else {
      res.status(201).send({
        userId: foundUser.id,
        jwToken: createToken(foundUser)
      })
    }
  })
  .catch(console.error)
})
