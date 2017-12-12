const db = require('./db')
const { User, Prayer } = require('./db/models')

async function seed () {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123'}),
    User.create({email: 'murphy@email.com', password: '123'})
  ])

  const prayers = await Promise.all([
    Prayer.create({
      subject: 'My Mother',
      body: 'My mom is sick. We found out a few days ago, and we need to wait a few more days before they can do further testing. Please pray for her good health.',
      views: 0,
      closed: false
    }),
    Prayer.create({
      subject: 'I suffer from anxiety',
      body: 'I have been struggling with anxiety attacks, and they seem to be getting worse. I want to be able to lead a normal life. Please pray for me.',
      views: 0,
      closed: false
    }),
  ])

  console.log(`seeded ${users.length} users and ${prayers.length} prayers`)
  console.log(`seeded successfully`)
}

seed()
  .catch(err => {
    console.error(err.message)
    console.error(err.stack)
    process.exitCode = 1
  })
  .then(() => {
    console.log('closing db connection')
    db.close()
    console.log('db connection closed')
  })

console.log('seeding...')
