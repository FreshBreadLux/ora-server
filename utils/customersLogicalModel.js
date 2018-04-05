const stripe = require('stripe')(process.env.STRIPE_API_KEY)

class Customer {
  static create(email, token) {
    return stripe.customers.create({
      email,
      source: token.id
    })
  }
  static findById(customerId) {
    return stripe.customers.retrieve(customerId)
  }
}

module.exports = Customer
