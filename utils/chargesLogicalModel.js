const stripe = require('stripe')(process.env.STRIPE_API_KEY)

class Charge {
  static create(stripeCustomerId, amount) {
    return stripe.charges.create({
      amount,
      currency: 'usd',
      description: 'Single donation',
      customer: stripeCustomerId
    })
  }
}

module.exports = Charge
