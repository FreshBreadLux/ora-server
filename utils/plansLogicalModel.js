const stripe = require('stripe')(process.env.STRIPE_API_KEY)

class Plan {
  static findOrCreate(amount) {
    if (amount === 5000) return stripe.plans.retrieve(process.env.PLAN_50_ID)
    else if (amount === 7500) return stripe.plans.retrieve(process.env.PLAN_75_ID)
    else if (amount === 10000) return stripe.plans.retrieve(process.env.PLAN_100_ID)
    else if (amount === 15000) return stripe.plans.retrieve(process.env.PLAN_150_ID)
    else if (amount === 20000) return stripe.plans.retrieve(process.env.PLAN_200_ID)
    else if (amount === 30000) return stripe.plans.retrieve(process.env.PLAN_300_ID)
    return stripe.plans.create({
      amount,
      currency: 'usd',
      interval: 'month',
      product: process.env.ANGEL_INVESTOR_PRODUCT_ID
    })
  }
}

module.exports = Plan
