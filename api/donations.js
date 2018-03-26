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
