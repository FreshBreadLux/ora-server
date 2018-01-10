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
      body: 'My mom was recently diagnosed with brain cancer.\n\nI\'m not sure how to process this. It\'s terrifying even to think about, and I\'m not sure how I can begin to pray about it. My mom is far away the most supportive and inspirational person in my life, and now I might lose her.\n\nThe doctors don\'t know what type of timeline she has left. She might live for years, or she might only have a few more weeks. I don\'t know how to find peace in a situation like this.\n\nPlease pray for my mother, and for me, and for the rest of my family.\nOur Father, Who art in heaven...\nHail Mary, full of grace...',
      views: 0,
      closed: false,
      userId: 1
    }),
    Prayer.create({
      subject: 'Medical Exams',
      body: 'I have been studying for my medical exams for over a year now. For better or worse, the results of these exams will determine much of my future. I\'ve dreamed of being a doctor since I was a little girl, and truly believe that God is calling me to this work. Please pray that I remember what I have studied, that I remain calm, and that the will of God is carried out.',
      views: 0,
      closed: false,
      userId: 1
    }),
    Prayer.create({
      subject: 'Mission Trip',
      body: 'I\'m taking the high school youth group on a mission trip to Mexico to build houses for impoverished families. This is a really powerful experience, as it is the first time that many of these kids will see true poverty. I also know that this is a wonderful opportunity for them to grow in relationship with God. Your prayers will go a long way in helping us to have a safe and spiritual trip.\n\nOur Father, Who art in heaven...\n\nThank you for your prayers!',
      views: 0,
      closed: false,
      userId: 1
    }),
    Prayer.create({
      subject: 'My Friend\'s Full Recovery',
      body: 'Last week my friend was in a terrible car crash. A drunk driver ran a red light and smashed into the side of his car. Both of my friend\'s legs and one of his arms were broken in the crash. Because of the severity of the injuries to his legs, we\'re not sure if he\'ll be able to walk again.\n\nIt\'s hard to believe that this has happened. My friend is such a good person, incredibly loving and generous with his time. He\'s very active and loves to volunteer to teach youth sports. The idea that he might never be able to do that again is mind boggling to me.\n\nAlthough it\'s unlikely, I believe that a full recovery is possible. Anything is possible with God. Please, please, pray for a full physical recovery, and also mental stability as he confronts this challenge.',
      views: 0,
      closed: false,
      userId: 2,
    }),
    Prayer.create({
      subject: 'My Friend is Pregnant',
      body: 'My friend recently found out that she is pregnant. She\'s working part time and attending school, and is terrified that she won\'t be able to support her baby. I think she is considering an abortion.\n\nI can\'t imagine what this must feel like for her. She must be scared, and sick, and lonely. And I know that the best thing for her right now is prayers. Please pray that she is able to find peace in this difficult situation. Please pray that God gives her the courage to open her life to her unborn baby.\n\nOur Father, Who art in heaven...\n\nHail Mary, full of grace...\n\nRemember, O most gracious Virgin Mary...\n\nThank you for your prayers. I trust that God will make this difficult situation into something truly beautiful.',
      views: 0,
      closed: false,
      userId: 2,
    }),
    Prayer.create({
      subject: 'The Conversion of My Husband',
      body: 'I have been trying to convince my husband of the truth-claims of Christianity. We were both atheists when we got married, but I converted a few years ago. He seemed interested for a while, but then grew apathetic.\n\nWhen I first converted, I had so much energy. I was glad to debate with him, and excited to tell him about my new relationship with Jesus. But after so much time, I\'ve started to get fatigued. Please pray that God reaches out to him and convinces him of the Truth.',
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
