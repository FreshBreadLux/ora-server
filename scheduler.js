const db = require('./db')
const Prayer = require('./db/models/prayer')

const clearViews = () => {
  db.sync()
  .then(() => {
    Prayer.update(
      { dailyViews: 0 },
      { where: {} })
    .then(() => console.log('dailyViews reset to zero'))
    .catch(console.error)
  })
  .then(() => db.close())
}

clearViews()
