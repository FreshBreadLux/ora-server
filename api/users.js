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
      console.log('FOUND USER: ', user)
      if (user) return res.send({id: user.id, stripeCustomerId: !!user.stripeCustomerId})
      else return res.send({user: 'email does not exist'})
    })
    .catch(error => {
      console.log('ERROR: ', error)
      return res.send({user: 'there was an error'})
    })
  } else {
    return res.send({user: 'please send a valid email'})
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
    .catch(console.error)
  } else {
    return res.send({user: 'please send a valid userId'})
  }
})

router.put('/sendResetCode', async (req, res, next) => {
  if (!req.body.email) return res.status(400).send('You must send an email')
  const foundUser = await User.findOne({where: {email: req.body.email}})
  if (!foundUser) {
    return res.status(401).send('That email is incorrect')
  } else {
    const resetCode = generateResetCode()
    const updatedUser = await foundUser.update({resetCode})
    await smtpTransport.sendMail({
      from: process.env.NODEMAILER_USER,
      to: updatedUser.email,
      subject: 'Reset Your Password for Ora',
      text: `Use code ${resetCode} to reset your password in Ora.`
    }, (err, info) => {
      if (err) console.error(err)
      else console.log(`Reset code sent to ${updatedUser.email}; info: `, info)
    })
    return res.send('Reset code successfully sent')
  }
})

router.put('/resetPassword', async (req, res, next) => {
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
})

router.put('/:userId', (req, res, next) => {
  if (req.params.userId && req.params.userId !== 'null') {
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
    .catch(console.error)
  } else {
    return res.send('You must send a valid userId')
  }
})

router.get('/:userId/prayers', (req, res, next) => {
  console.log('GETTING PRAYERS WITH USERID: ', req.params.userId)
  console.log('This is what null looks like: ', null)
  if (req.params.userId && req.params.userId !== 'null') {
    console.log('MADE IT PAST THE CONDITIONAL LOGIC IN PRAYERS WITH USERID: ', req.params.userId)
    console.log('req.params.userId === null: ', req.params.userId === null)
    console.log('req.params.userId === (the string) null: ', req.params.userId === 'null')
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
  } else {
    return res.send('You must include a valid userId')
  }
})

router.get('/:userId/follows', (req, res, next) => {
  console.log('GETTING FOLLOWS WITH USERID: ', req.params.userId)
  console.log('This is what null looks like: ', null)
  if (req.params.userId && req.params.userId !== 'null') {
    console.log('MADE IT PAST THE CONDITIONAL LOGIC IN FOLLOWS WITH USERID: ', req.params.userId)
    console.log('req.params.userId === null: ', req.params.userId === null)
    console.log('req.params.userId === (the string) null: ', req.params.userId === 'null')
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
  } else {
    return res.send('You must include a valid userId')
  }
})

router.get('/:userId/views', (req, res, next) => {
  if (req.params.userId && req.params.userId !== 'null') {
    User.findById(req.params.userId)
    .then(foundUser => foundUser.getViewed())
    .then(views => {
      const prayerIdsOfViews = views.map(view => view.id)
      return res.send(prayerIdsOfViews)
    })
    .catch(console.error)
  } else {
    res.send('You must include a valid userId')
  }
})

router.post('/', (req, res, next) => {
  console.log('HIT POST API/USERS')
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('You must send an email and password')
  }
  console.log('NOTICE: ', req.body.email, 'is signing up!')
  User.create({
    email: req.body.email,
    password: req.body.password,
    pushToken: req.body.pushToken,
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
    console.error('error.errors[0].message: ', error.errors[0].message)
  })
})

router.post('/sessions', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('You must send an email and password')
  }
  User.findOne({where: {email: req.body.email}})
  .then(foundUser => {
    if (!foundUser || !foundUser.correctPassword(req.body.password)) {
      return res.status(401).send('The email or password is incorrect')
    } else {
      return res.status(201).send({
        userId: foundUser.id,
        jwToken: createToken(foundUser)
      })
    }
  })
  .catch(console.error)
})
