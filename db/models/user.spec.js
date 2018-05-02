const { expect } = require('chai')
const db = require('../index')
const User = db.models.user

describe('User model', () => {
  before('Await database sync', () => db.sync({force: true}))
  afterEach('Clear the tables', () => db.truncate({ cascade: true }))

  let user
  beforeEach('Build a user', () => {
    user = User.build({
      email: 'test@email.com',
      password: '123'
    })
  })

  it('Can save with email and password', async () => {
    await user.save()
  })

  it('Requires an email', async () => {
    delete user.dataValues.email
    try {
      await user.save()
      throw Error('We should not have been able to save the user without an email')
    } catch (error) {
      expect(error.message).to.match(/user.email cannot be null/)
    }
  })
})
