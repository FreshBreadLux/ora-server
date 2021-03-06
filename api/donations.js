const router = require('express').Router()
const User = require('../db/models/user')
const Subscription = require('../utils/subscriptionsLogicalModel')
const Plan = require('../utils/plansLogicalModel')
const Customer = require('../utils/customersLogicalModel')
const Charge = require('../utils/chargesLogicalModel')
const jwt = require('jsonwebtoken')

module.exports = router

router.post('/customers', (req, res, next) => {
  console.log('HIT POST /CUSTOMERS WITH REQ.BODY:', req.body)
  const { email, token } = req.body
  Customer.create(email, token)
  .then(customer => {
    console.log('Created Customer:', customer)
    res.send(customer)
  })
  .catch(next)
})

router.post('/charges', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    User.findById(req.body.userId)
    .then(user => Charge.create(user.stripeCustomerId, req.body.amount))
    .then(charge => res.send(charge))
    .catch(next)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})

router.post('/subscriptions', (req, res, next) => {
  console.log('HIT POST /SUBSCRIPTIONS WITH REQ.BODY:', req.body)
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    const { userId, amount } = req.body
    Plan.findOrCreate(amount)
    .then(plan => {
      return User.findById(userId)
      .then(user => {
        console.log('FOUND USER:', user)
        user.update({ angelInvestor: true })
        return Subscription.create(user.stripeCustomerId, plan.id)
      })
    })
    .then(subscription => res.send(subscription))
    .catch(next)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})

router.put('/subscriptions/:subscriptionId', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    Plan.findOrCreate(req.body.amount)
    .then(plan => Subscription.updatePlan(req.params.subscriptionId, plan.id))
    .then(updatedSubscription => res.send(updatedSubscription))
    .catch(next)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})

router.get('/subscriptions', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    User.findById(req.query.userId)
    .then(foundUser => Customer.findById(foundUser.stripeCustomerId))
    .then(stripeCustomer => res.send(stripeCustomer.subscriptions))
    .catch(next)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})

router.delete('/subscriptions/:subscriptionId', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    Subscription.delete(req.params.subscriptionId)
    .then(result => {
      res.send(result)
      User.findOne({ where: {
        stripeCustomerId: result.customer
      }})
      .then(user => user.update({ angelInvestor: false }))
    })
    .catch(next)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})

router.get('/charges', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    User.findById(req.query.userId)
    .then(foundUser => Charge.findAll(foundUser.stripeCustomerId, req.query.limit))
    .then(charges => res.send(charges))
    .catch(next)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})

router.post('/webhook', (req, res, next) => {
  console.log('HIT STRIPE WEBHOOK WITH REQ.BODY:', req.body)
  const { amount, customer } = req.body.data.object
  User.findOne({where: {stripeCustomerId: customer}})
  .then(user => user.update({investmentTotal: user.investmentTotal + amount}))
  .then(updatedUser => {
    console.log('updatedUser: ', updatedUser)
    res.sendStatus(200)
  })
  .catch(next)
})

router.put('/subscriptions/:subscriptionId/billingAnchor', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    const { billingDate } = req.body, { subscriptionId } = req.params
    Subscription.updateBillingAnchor(subscriptionId, billingDate)
    .then(updatedSubscription => res.send(updatedSubscription))
    .catch(next)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})
