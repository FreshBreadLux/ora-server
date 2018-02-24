const db = require('./db')
const { User, Prayer, FlagReason } = require('./db/models')

async function seed () {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123', isAdmin: true}),
    User.create({email: 'murphy@email.com', password: '123', isAdmin: true})
  ])

  const flagReasons = await Promise.all([
    FlagReason.create({flagCategory: 'Spam'}),
    FlagReason.create({flagCategory: 'Dangerous'}),
    FlagReason.create({flagCategory: 'Inappropriate'})
  ])

  const prayers = await Promise.all([
    Prayer.create({
      subject: 'My Friend\'s Full Recovery',
      body: 'One of my friends was seriously injured last summer while he was spending a weekend at the lake with some friends and family. They were taking turns jumping off of a large rock into the lake, and when my friend jumped in he hit something beneath the surface. His injuries were incredibly severe, including a broken back.\n\nThe road to recovery has been very long and very difficult. It’s not only physically taxing, but also very mentally and emotionally strenuous as well. He’s been recovering for months now, and still has a long way to go.\n\nI know that he would really appreciate your prayers. Please spend some time praying for his health: physical, mental, and spiritual. ',
      views: 0,
      closed: false,
      userId: 1,
    }),
    Prayer.create({
      subject: 'Feeling Grateful',
      body: 'Please take a moment to pray for the Ora beta testers.\n\nChristian community is a powerful thing, and it\'s comforting to remember that there are people across the country praying for us. Let\'s pray for more projects like this, that encourage our generation to develop habits of devotion.\n\nLord, please open my heart to these prayer requests. Help me to see You in each of the authors. Give me a spirit of empathy that draws me into a closer relationship with You, and pour out Your grace into the hearts of all those that have asked for Your help.\n\nOur Father, Who art in heaven...\n\nAmen',
      views: 0,
      closed: false,
      userId: 2,
    }),
  ])

  console.log(`seeded ${users.length} users, ${prayers.length} prayers, and ${flagReasons.length} flagReasons`)
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
