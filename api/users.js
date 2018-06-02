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

router.get('/', (req, res, next) => {
  console.log('QUERYING WITH EMAIL: ', req.query.email)
  if (req.query.email) {
    User.findOne({ where: { email: req.query.email }})
    .then(user => {
      if (user) return res.send({id: user.id, stripeCustomerId: !!user.stripeCustomerId})
      else return res.send({user: 'email does not exist'})
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return res.status(500).send({user: 'there was an error'})
    })
  } else {
    return res.status(400).send('You must include a valid email')
  }
})

router.get('/:userId', (req, res, next) => {
  console.log('GET USER WITH USERID: ', req.params.userId)
  if (req.params.userId) {
    User.findById(req.params.userId)
    .then(foundUser => {
      const scrubbedUser = {
        email: foundUser.email,
        id: foundUser.id,
        totalPrayers: foundUser.totalPrayers,
        theme: foundUser.theme,
        consecutiveDays: foundUser.consecutiveDays,
        isAdmin: foundUser.isAdmin,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        investmentTotal: foundUser.investmentTotal,
        oraMissionary: foundUser.oraMissionary,
        city: foundUser.city,
        state: foundUser.state,
        address: foundUser.address,
      }
      return res.status(201).send(scrubbedUser)
    })
    .catch(next)
  } else {
    return res.status(400).send('You must include a valid userId')
  }
})

router.put('/sendResetCode', async (req, res, next) => {
  try {
    if (!req.body.email) return res.status(400).send('You must send an email')
    const foundUser = await User.findOne({where: {email: req.body.email}})
    if (!foundUser) {
      return res.status(401).send('That email is incorrect')
    } else {
      const resetCode = generateResetCode()
      const updatedUser = await foundUser.update({resetCode})
      smtpTransport.sendMail({
        from: process.env.NODEMAILER_USER,
        to: updatedUser.email,
        subject: 'Reset Your Password for Ora',
        text: `Use code ${resetCode} to reset your password in Ora.`
      }, (err, info) => {
        if (err) return next(err)
        console.log(`Reset code sent to ${updatedUser.email}; info: `, info)
        return res.send('Reset code successfully sent')
      })
    }
  } catch (error) {
    next(error)
  }
})

router.put('/resetPassword', async (req, res, next) => {
  try {
    if (!req.body.resetCode || !req.body.password) return res.status(400).send('You must send a reset code and password')
    const foundUser = await User.findOne({where: {resetCode: req.body.resetCode}})
    if (!foundUser) {
      return res.status(401).send('That reset code is incorrect')
    } else {
      await foundUser.update({
        resetCode: null,
        password: req.body.password
      })
      return res.send('Password successfully reset')
    }
  } catch (error) {
    next(error)
  }
})

router.put('/:userId', (req, res, next) => {
  console.log('HIT PUT USERS/:USERID')
  console.log('REQ.BODY: ', req.body)
  if (req.params.userId) {
    User.findById(req.params.userId)
    .then(foundUser => foundUser.update(req.body))
    .then(updatedUser => {
      const scrubbedUser = {
        email: updatedUser.email,
        id: updatedUser.id,
        totalPrayers: updatedUser.totalPrayers,
        theme: updatedUser.theme,
        consecutiveDays: updatedUser.consecutiveDays,
        isAdmin: updatedUser.isAdmin,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        investmentTotal: updatedUser.investmentTotal,
        oraMissionary: updatedUser.oraMissionary,
        city: updatedUser.city,
        state: updatedUser.state,
        address: updatedUser.address
      }
      return res.status(201).send(scrubbedUser)
    })
    .catch(next)
  } else {
    return res.status(400).send('You must include a valid userId')
  }
})

router.get('/:userId/prayers', (req, res, next) => {
  console.log('GETTING PRAYERS WITH USERID: ', req.params.userId)
  console.log('req.params.userId === null: ', req.params.userId === null)
  console.log('req.params.userId === (the string) null: ', req.params.userId === 'null')
  if (req.params.userId) {
    console.log('MADE IT PAST THE CONDITIONAL LOGIC IN PRAYERS WITH USERID: ', req.params.userId)
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
    .then(prayers => res.send(prayers))
    .catch(next)
  } else {
    return res.status(400).send('You must include a valid userId')
  }
})

router.get('/:userId/follows', (req, res, next) => {
  console.log('GETTING FOLLOWS WITH USERID: ', req.params.userId)
  console.log('req.params.userId === null: ', req.params.userId === null)
  console.log('req.params.userId === (the string) null: ', req.params.userId === 'null')
  if (req.params.userId) {
    console.log('MADE IT PAST THE CONDITIONAL LOGIC IN FOLLOWS WITH USERID: ', req.params.userId)
    User.findById(req.params.userId)
    .then(foundUser => foundUser.getFollowed({
      include: [Update],
      order: [
        ['createdAt', 'DESC'],
        [{model: Update}, 'createdAt']
      ]
    }))
    .then(follows => res.send(follows))
    .catch(next)
  } else {
    return res.status(400).send('You must include a valid userId')
  }
})

router.get('/:userId/views', (req, res, next) => {
  if (req.params.userId) {
    User.findById(req.params.userId)
    .then(foundUser => foundUser.getViewed())
    .then(views => {
      const prayerIdsOfViews = views.map(view => view.id)
      return res.send(prayerIdsOfViews)
    })
    .catch(next)
  } else {
    return res.status(400).send('You must include a valid userId')
  }
})

router.post('/', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('You must send an email and password')
  }
  console.log('NOTICE: ', req.body.email, 'is signing up!')
  User.create({
    email: req.body.email,
    password: req.body.password,
    pushToken: req.body.pushToken,
    stripeCustomerId: req.body.stripeCustomerId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    totalPrayers: 0,
    totalSubmitted: 0,
    consecutiveDays: 0,
    prayedToday: false,
    theme: 'Rome',
    isAdmin: false,
    angelInvestor: false,
    oraMissionary: false,
    notificationInterval: 30
  })
  .then(user => {
    console.log('created user:', user)
    return res.status(201).send({
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
    return next(error)
  })
})

router.post('/sessions', (req, res, next) => {
  console.log('POSTING TO /SESSIONS WITH EMAIL:', req.body.email)
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('You must send an email and password')
  }
  User.findOne({where: {email: req.body.email}})
  .then(foundUser => {
    if (!foundUser || !foundUser.correctPassword(req.body.password)) {
      return res.status(401).send('The email or password is incorrect')
    } else {
      console.log('Found user:', foundUser)
      return res.status(201).send({
        userId: foundUser.id,
        jwToken: createToken(foundUser)
      })
    }
  })
  .catch(next)
})
