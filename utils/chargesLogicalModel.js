const stripe = require('stripe')(process.env.STRIPE_API_KEY)

class Charge {
  static create(customerId, amount) {
    return stripe.charges.create({
      amount,
      currency: 'usd',
      description: 'Single donation',
      customer: customerId
    })
  }
}

module.exports = Charge
