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
  static findAll(customerId, limit) {
    return stripe.charges.list({
      customer: customerId,
      limit
    })
  }
}

module.exports = Charge
