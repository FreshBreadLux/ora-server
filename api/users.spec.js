const { expect } = require('chai')
const request = require('supertest')
const db = require('../db')
const app  = require('../')
const User = db.models.user

describe('User api', () => {
  before('Await database sync', () => db.sync({force: true}))
  afterEach('Clear the tables', () => db.truncate({ cascade: true }))

  let users
  beforeEach('Build a user', async () => {
    users = await User.bulkCreate([
      {
        email: 'test1@email.com',
        password: '123'
      },
      {
        email: 'test2@email.com',
        password: '123'
      },
      {
        email: 'test3@email.com',
        password: '123'
      }
    ])
  })

  describe('GET /', () => {
    it('returns 400 if no email is specified', () => {
      return request(app).get('/api/users').expect(400)
    })
  })
})
