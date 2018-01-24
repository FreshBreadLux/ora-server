const db = require('./db')
const Prayer = require('./db/models/prayer')

const clearViews = () => {
  db.sync()
  .then(() => {
    console.log('db synced!')
    Prayer.update(
      { dailyViews: 0 },
      { where: {} })
    .then(() => console.log('dailyViews reset to zero'))
    .catch(console.error)
  })
  .then(() => {
    console.log('closing db')
    db.close()
    console.log('db closed!')
  })
}

clearViews()
