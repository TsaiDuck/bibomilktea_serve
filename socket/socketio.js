var socketio = {}
const socketIO = require('socket.io')
socketio.clients = []

//获取io
socketio.getSocketio = function (server) {
  const io = socketIO(server, {
    cors: {
      origin: '*'
    }
  })
  io.on('connection', (socket) => {
    if (
      socketio.clients.findIndex(
        (item) => item.handshake.address === socket.handshake.address
      ) == -1
    ) {
      socketio.clients.push(socket)
    }
    console.log(`user connected 当前连接数：${socketio.clients.length}`)
    socket.on('disconnect', () => {
      socketio.clients.splice(
        socketio.clients.findIndex(
          (item) => item.handshake.address === socket.handshake.address
        ),
        1
      )
      console.log(`user close 当前连接数：${socketio.clients.length}`)
    })
  })
}

module.exports = socketio
