const { expect } = require('chai')
const db = require('../index')
const Flag = db.models.flag
const User = db.models.user
const Prayer = db.models.prayer
const Flagreason = db.models.flagreason

describe('Flag model', () => {
  before('Await database sync', () => db.sync({force: true}))
  afterEach('Clear the tables', () => db.truncate({ cascade: true }))

  it('Can associate a user, a prayer, and a reason', async () => {
    const flagreasonp = Flagreason.create({
      flagCategory: 'test'
    })
    const user = await User.create({
      email: 'test@email.com',
      password: '123',
    })
    const prayerp = Prayer.create({
      subject: 'Subject',
      body: 'Body',
      userId: user.id
    })
    const [prayer, flagreason] = await Promise.all([prayerp, flagreasonp])
    return Flag.create({
      flaggerId: user.id,
      flaggedId: prayer.id,
      flagreasonId: flagreason.id
    })
  })
})
