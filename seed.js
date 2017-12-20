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
      closed: false,
      userId: 1
    }),
    Prayer.create({
      subject: 'Big Test',
      body: 'I have been studying for my medical exams for almost a year now. For better or worse, the results of these exams will determine much of my future. Please pray that I remember what I have studied, that I remain calm, and that the will of God is carried out.',
      views: 0,
      closed: false,
      userId: 1
    }),
    Prayer.create({
      subject: 'Mission Trip',
      body: 'My young adult group is going on a mission trip to Mexico to build houses for families in need. Please pray that we have a safe and successful trip, and that everyone involved grows in virtue.',
      views: 0,
      closed: false,
      userId: 1
    }),
    Prayer.create({
      subject: 'I suffer from anxiety',
      body: 'I have been struggling with anxiety attacks, and they seem to be getting worse. I want to be able to lead a normal life. Please pray for me.',
      views: 0,
      closed: false,
      userId: 2,
    }),
    Prayer.create({
      subject: 'My Friend is Pregnant',
      body: 'My friend recently found out that she is pregnant, and has been considering an abortion. She is very overwhelmed, but she needs to understand that an abortion is not an option. Please pray that she will open her heart to God and to her baby.',
      views: 0,
      closed: false,
      userId: 2,
    }),
    Prayer.create({
      subject: 'The Conversion of My Husband',
      body: 'I have been trying to convince my husband to come into full communion with the Catholic Church for years now. He has seemed interested for a while, but I am getting worn out and I am starting to wonder if it will ever go anywhere. Please pray that God reaches out to him and convinces him to come home.',
      views: 0,
      closed: false,
      userId: 2,
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
