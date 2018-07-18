const leaveCurrentRoom = (socket, io) => {
  if (socket.currentRoom) {
    io.to(socket.currentRoom).emit('peer disconnected', socket.id)
    socket.leave(socket.currentRoom)
    socket.currentRoom = null
  }
}

const joinRoom = (socket, roomName) => {
  console.log(`${socket.id} joined room: ${roomName}`)
  socket.join(roomName)
  socket.currentRoom = roomName
  socket.to(roomName).emit('peer connected', socket.id)
}

const setupSocketIO = server => {
  const io = require('socket.io')(server)

  io.on('connection', socket => {
    console.log('a user connected')

    socket.on('disconnect', () => {
      console.log('user disconnected')
      leaveCurrentRoom(socket, io)
    })

    socket.on('join', name => {
      if (typeof name === 'string' && name.length > 0) {
        leaveCurrentRoom(socket, io)
        joinRoom(socket, name)
      }
    })

    socket.on('message', message => {
      if (!message) {
        return
      }

      const to = io.to(message.to)
      if (!to) {
        return
      }

      message.from = socket.id
      to.emit('message', message)
    })
  })
}

export default setupSocketIO
