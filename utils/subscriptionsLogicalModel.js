const stripe = require('stripe')(process.env.STRIPE_API_KEY)

class Subscription {
  static create(customerId, stripePlanId) {
    return stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: stripePlanId }]
    })
  }
  static updateBillingAnchor(subscriptionId, trialEnd) {
    return stripe.subscriptions.update(subscriptionId, {
      trial_end: trialEnd,
      prorate: false,
    })
  }
  static delete(subscriptionId) {
    return stripe.subscriptions.del(subscriptionId)
  }
}

module.exports = Subscription
