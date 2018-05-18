const stripe = require('stripe')(process.env.STRIPE_API_KEY)

class Plan {
  static findOrCreate(amount) {
    return stripe.plans.create({
      amount,
      currency: 'usd',
      interval: 'month',
      product: process.env.ANGEL_INVESTOR_PRODUCT_ID
    })
  }
}

module.exports = Plan
