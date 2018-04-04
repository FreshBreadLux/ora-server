const stripe = require('stripe')(process.env.STRIPE_API_KEY)

class Subscription {
  static create(body) {

  }
  static updateBillingAnchor(subscriptionId, trialEnd) {
    return stripe.subscriptions.update(subscriptionId, {
      trial_end: trialEnd,
      prorate: false,
    })
  }
}

module.exports = Subscription
