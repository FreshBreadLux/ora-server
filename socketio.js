module.exports = io => {
  io.on('connection', socket => {
    console.log(`connected socket: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`disconnected socket: ${socket.id}`)
    })
  })
}
