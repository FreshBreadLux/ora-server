const users = {}

module.exports = io => {
  io.on('connection', socket => {
    console.log(`connected socket: ${socket.id}`)

    socket.on('verify-user', userId => {
      console.log('userId: ', userId)
      users[userId] = {socketId: socket.id}
      console.log('users: ', users)
    })

    socket.on('new-view', prayer => {
      console.log('prayer: ', prayer)
      if (users[prayer.userId]) {
        console.log('socketId of recipient: ', users[prayer.userId].socketId)
        socket.to(users[prayer.userId].socketId).emit('private-message', 'Hey, I just met you')
      }
    })

    socket.on('disconnect', () => {
      console.log(`disconnected socket: ${socket.id}`)
    })
  })
}
