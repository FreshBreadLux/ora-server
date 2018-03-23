const router = require('express').Router()
const stripe = require('stripe')('sk_test_LR90mKCpaBvsj7u0D8Zwx6ET')

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
