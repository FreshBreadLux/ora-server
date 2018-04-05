const router = require('express').Router()
const User = require('../db/models/user')
const Subscription = require('../utils/subscriptionsLogicalModel')
const Plan = require('../utils/plansLogicalModel')
const Customer = require('../utils/customersLogicalModel')
const Charge = require('../utils/chargesLogicalModel')
const stripe = require('stripe')(process.env.STRIPE_API_KEY)
const jwt = require('jsonwebtoken')

module.exports = router

router.post('/customer', (req, res, next) => {
  const { email, token } = req.body
  Customer.create(email, token)
  .then(customer => res.send(customer))
  .catch(next)
})

router.post('/charge', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    Charge.create(req.body.customerId, req.body.amount)
    .then(charge => res.send(charge))
    .catch(next)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})

router.post('/subscription', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    const { userId, amount } = req.body
    Plan.findOrCreate(amount)
    .then(plan => {
      return User.findById(userId)
      .then(user => {
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

router.get('/subscription/forUser/:userId', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    User.findById(req.params.userId)
    .then(foundUser => stripe.customers.retrieve(foundUser.stripeCustomerId))
    .then(stripeCustomer => res.send(stripeCustomer.subscriptions))
    .catch(next)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})

router.post('/updateSubscription/forUser/:userId', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    const { subscriptionId, updatePlanAmount } = req.body
    stripe.subscriptions.del(subscriptionId)
    .then(() => stripe.plans.create({
      amount: updatePlanAmount,
      currency: 'usd',
      interval: 'month',
      product: process.env.ANGEL_INVESTOR_PRODUCT_ID
    }))
    .then(plan => {
      return User.findById(req.params.userId)
      .then(user => {
        return stripe.subscriptions.create({
          customer: user.stripeCustomerId,
          items: [{ plan: plan.id }]
        })
      })
    })
    .then(subscription => res.send(subscription))
    .catch(next)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})

router.delete('/subscription/:subscriptionId', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    Subscription.delete(req.params.subscriptionId)
    .then(result => res.send(result))
    .catch(next)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})

router.get('/chargeHistory/forUser/:userId/limit/:limit', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    User.findById(req.params.userId)
    .then(foundUser => stripe.charges.list({
      customer: foundUser.stripeCustomerId,
      limit: +req.params.limit
    }))
    .then(charges => res.send(charges))
    .catch(next)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})

router.post('/buyCoffee', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    User.findById(req.body.userId)
    .then(user => stripe.charges.create({
      amount: 300,
      currency: 'usd',
      description: 'One time donation',
      customer: user.stripeCustomerId
    }))
    .then(charge => {
      console.log('buyCoffee charge: ', charge)
      res.send(charge)
    })
    .catch(next)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})

router.post('/webhook', (req, res, next) => {
  const { amount, customer } = req.body.data.object
  User.findOne({where: {stripeCustomerId: customer}})
  .then(user => user.update({investmentTotal: user.investmentTotal + amount}))
  .then(updatedUser => {
    console.log('updatedUser: ', updatedUser)
    res.send(200)
  })
  .catch(next)
})

router.put('/subscription/:subscriptionId/billingAnchor', (req, res, next) => {
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
