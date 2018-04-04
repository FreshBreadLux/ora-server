const stripe = require('stripe')(process.env.STRIPE_API_KEY)

class Customer {
  static create(email, token) {
    return stripe.customers.create({
      email,
      source: token.id
    })
  }
}

module.exports = Customer
