var express = require('express')
var expressWs = require('express-ws')
var router = express.Router()
expressWs(router)

// let connections = []

router.ws('/ws', function (ws, req) {
  ws.send('你连接成功了')
  ws.on('message', function (msg) {
    ws.send('pong' + msg)
  })
})

// router.get('/ws', (req, res) => {
//   console.log('ok')
//   res.send('ok')
// })

module.exports = router
