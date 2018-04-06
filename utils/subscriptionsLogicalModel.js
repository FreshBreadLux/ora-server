const stripe = require('stripe')(process.env.STRIPE_API_KEY)

class Subscription {
  static create(customerId, planId) {
    return stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: planId }]
    })
  }
  static updatePlan(subscriptionId, planId) {
    return stripe.subscriptions.retrieve(subscriptionId)
    .then(subscription => {
      return stripe.subscriptions.update(subscriptionId, {
        items: [{ id: subscription.items.data[0].id, plan: planId }]
      })
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
