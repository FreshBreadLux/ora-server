const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_API_KEY)

module.exports = router

router.post('/oneTime', (req, res, next) => {
  console.log('req.body: ', req.body)
  stripe.charges.create({
    amount: req.body.oneTimeAmount,
    currency: 'usd',
    description: 'One time donation',
    customer: req.body.user.data.stripeCustomerId
  }, (err, charge) => {
    if (err) console.error(err)
    else res.send(charge)
  })
})

router.post('/existingSubscription', (req, res, next) => {
  console.log('req.body: ', req.body)
  const { user, selectedOption } = req.body;
  let plan
  if (selectedOption === '25') plan = process.env.PLAN_25_ID
  else if (selectedOption === '100') plan = process.env.PLAN_100_ID
  else if (selectedOption === '200') plan = process.env.PLAN_200_ID
  stripe.subscriptions.create({
    customer: user.data.stripeCustomerId,
    items: [{plan}]
  }, (err, subscription) => {
    if (err) console.error(err)
    else res.send(subscription)
  })
})
