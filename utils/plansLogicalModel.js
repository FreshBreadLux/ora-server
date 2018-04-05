const stripe = require('stripe')(process.env.STRIPE_API_KEY)

class Plan {
  static create(amount) {
    if (amount === 2500) return stripe.plans.retrieve(process.env.PLAN_25_ID)
    else if (amount === 10000) return stripe.plans.retrieve(process.env.PLAN_100_ID)
    else if (amount === 20000) return stripe.plans.retrieve(process.env.PLAN_200_ID)
    return stripe.plans.create({
      amount,
      currency: 'usd',
      interval: 'month',
      product: process.env.ANGEL_INVESTOR_PRODUCT_ID
    })
  }
}

module.exports = Plan
