const { expect } = require('chai')
const request = require('supertest')
const db = require('../db')
const app  = require('../')
const User = db.models.user

describe('User api', () => {
  before('Await database sync', () => db.sync({force: true}))
  afterEach('Clear the tables', () => db.truncate({ cascade: true }))

  let users, user
  beforeEach('Build a user', async () => {
    users = await User.bulkCreate([
      {
        email: 'test1@email.com',
        password: 'one'
      },
      {
        email: 'test2@email.com',
        password: 'two'
      },
      {
        email: 'test3@email.com',
        password: 'three'
      }
    ], {
      returning: true
    })
  })

  describe('GET /', () => {
    it('returns 400 if no email is specified', async () => {
      await request(app).get('/api/users').expect(400)
    })
    it('return a scrubbed object if the user exists for the provided email', async () => {
      const res = await request(app).get(`/api/users?email=${users[0].email}`).expect(200)
      expect(res.body).to.be.an('object')
      expect(res.body.id).to.equal(users[0].id)
    })
  })
})
