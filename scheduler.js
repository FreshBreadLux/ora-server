const db = require('./db')
const Prayer = require('./db/models/prayer')

const clearViews = () => {
  db.sync()
  .then(() => {
    console.log('db synced!')
    return Prayer.update(
      { dailyViews: 0 },
      { where: {} })
    })
  .then(() => console.log('dailyViews reset to zero'))
  .then(() => {
    console.log('closing db')
    db.close()
    console.log('db closed!')
  })
  .catch(console.error)
}

clearViews()
