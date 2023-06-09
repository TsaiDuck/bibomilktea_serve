var createError = require('http-errors')
var express = require('express')
const expressWs = require('express-ws')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const cors = require('cors') //使用const cors=require(’cors‘)导入中间件
var history = require('connect-history-api-fallback')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var goodsRouter = require('./routes/goods')
var orderRouter = require('./routes/order')
var socketRouter = require('./routes/socket')
var materialRouter = require('./routes/material')

var app = express()
expressWs(app)
app.use(cors()) //在路由之前调用app.use(cors())配置中间件

// 跨域设置
app.all('*', function (req, res, next) {
  // res.setHeader('Access-Control-Allow-Credentials', true)
  // res.setHeader('Access-Control-Allow-Origin', req.get('Origin')) // 添加这一行代码，代理配置不成功
  res.setHeader('Access-Control-Allow-Origin', '*')

  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, OPTIONS, DELETE, PUT'
  )
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since'
  )
  next()
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// app.use(
//   history({
//     index: '/index.html'
//   })
// )

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// 路由
app.use('/', indexRouter)
app.use(usersRouter)
app.use(goodsRouter)
app.use(orderRouter)
app.use(socketRouter)
app.use(materialRouter)

// catch 404 and forward to error handler
app.use(function (req, res) {
  res.sendFile(path.resolve(__dirname, './public/404.html'))
})
// app.use(function (req, res, next) {
//   next(createError(404))
// })

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message
//   res.locals.error = req.app.get('env') === 'development' ? err : {}

//   // render the error page
//   res.status(err.status || 500)
//   res.render('error')
// })

module.exports = app
