const db = require('./db')
const User = require('./db/models/user')

const updateConsecutive = async () => {
  try {
    await db.sync()
    console.log('db synced!')

    await User.update(
      { consecutiveDays: 0 },
      { where: { prayedToday: false } }
    )
    console.log('consecutiveDays reset to zero for users who have not prayed today')

    await User.increment(
      'consecutiveDays',
      { where: { prayedToday: true } }
    )
    console.log('consecutiveDays incremented for users who have prayed today')

    await User.update(
      { prayedToday: false },
      { where: {} }
    )
    console.log('prayedToday reset to false for all users')

    console.log('closing db')
    db.close()
    console.log('db closed!')
  } catch (err) {
    console.error(err)
  }
}

updateConsecutive()
