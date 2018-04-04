const router = require('express').Router()
const User = require('../db/models/user')
const Subscription = require('../utils/subscriptionsLogicalModel')
const stripe = require('stripe')(process.env.STRIPE_API_KEY)
const jwt = require('jsonwebtoken')

module.exports = router

router.post('/oneTime', (req, res, next) => {
  stripe.charges.create({
    amount: req.body.oneTimeAmount,
    currency: 'usd',
    description: 'One time donation',
    customer: req.body.user.data.stripeCustomerId
  })
  .then(charge => res.send(charge))
  .catch(console.error)
})

router.post('/existingSubscription', (req, res, next) => {
  const { user, selectedOption } = req.body
  let plan
  if (selectedOption === '25') plan = process.env.PLAN_25_ID
  else if (selectedOption === '100') plan = process.env.PLAN_100_ID
  else if (selectedOption === '200') plan = process.env.PLAN_200_ID
  stripe.subscriptions.create({
    customer: user.data.stripeCustomerId,
    items: [{plan}]
  })
  .then(subscription => res.send(subscription))
  .catch(console.error)
})

router.post('/customSubscription', (req, res, next) => {
  const { user, customAmount } = req.body
  stripe.plans.create({
    amount: customAmount,
    currency: 'usd',
    interval: 'month',
    product: process.env.ANGEL_INVESTOR_PRODUCT_ID
  })
  .then(plan => {
    return stripe.subscriptions.create({
      customer: user.data.stripeCustomerId,
      items: [{plan: plan.id}]
    })
  })
  .then(subscription => res.send(subscription))
  .catch(console.error)
})

router.get('/subscription/forUser/:userId', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    User.findById(req.params.userId)
    .then(foundUser => stripe.customers.retrieve(foundUser.stripeCustomerId))
    .then(stripeCustomer => res.send(stripeCustomer.subscriptions))
    .catch(console.error)
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
    .catch(console.error)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})

router.delete('/subscription/:subscriptionId', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    stripe.subscriptions.del(req.params.subscriptionId)
    .then(result => res.send(result))
    .catch(console.error)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})

router.post('/subscription', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    const { userId, amount } = req.body
    stripe.plans.create({
      amount: amount,
      currency: 'usd',
      interval: 'month',
      product: process.env.ANGEL_INVESTOR_PRODUCT_ID
    })
    .then(plan => {
      return User.findById(userId)
      .then(user => {
        return stripe.subscriptions.create({
          customer: user.stripeCustomerId,
          items: [{ plan: plan.id }]
        })
      })
    })
    .then(subscription => res.send(subscription))
    .catch(console.error)
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
    .catch(console.error)
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
    .catch(console.error)
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
  .catch(console.error)
})

router.put('/subscription/:subscriptionId', (req, res, next) => {
  try {
    jwt.verify(req.headers.token, process.env.SECRET)
    const { billingDate } = req.body, { subscriptionId } = req.params
    Subscription.updateBillingAnchor(subscriptionId, billingDate)
    .then(updatedSubscription => res.send(updatedSubscription))
    .catch(console.error)
  } catch (error) {
    console.error(error)
    res.status(400).send('You do not have sufficient authorization')
  }
})
