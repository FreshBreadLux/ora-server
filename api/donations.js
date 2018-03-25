const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_API_KEY)

module.exports = router

router.post('/oneTime', (req, res, next) => {
  console.log('req.body: ', req.body)
  const token = req.body.token
  console.log('token received; ID: ', token.id)
  stripe.charges.create({
    amount: 1000,
    currency: 'usd',
    description: 'One time donation',
    source: token.id,
  }, (err, charge) => {
    if (err) console.error(err)
    else res.send(charge)
  })
})
