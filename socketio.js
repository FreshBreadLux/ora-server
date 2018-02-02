module.exports = io => {
  io.on('connection', socket => {
    console.log(`connected socket: ${socket.id}`)

    socket.on('new-view', message => {
      console.log('message: ', message)
    })

    socket.on('disconnect', () => {
      console.log(`disconnected socket: ${socket.id}`)
    })
  })
}
