const stripe = require('stripe')(process.env.STRIPE_API_KEY)

class Subscription {
  static update(subscriptionId, body) {
    return stripe.subscriptions.update(subscriptionId, body)
  }
}

export default Subscription
