const DB = require('../db/connection')
var express = require('express')
var router = express.Router()
const ws = require('../socket/socketio')

// 添加订单
router.post('/api/addorder', function (req, res) {
  const order = req.body
  const now = new Date()
  let order_id = `${now.getFullYear()}${
    now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
  }${now.getDate() < 10 ? '0' + now.getDate() : now.getDate()}`
  let order_dayId = 1
  DB(
    `select order_id from bibo_milktea.order where order_id like "${order_id}%"`,
    (err, result) => {
      if (err) {
        console.log(err)
        res.send({
          meta: {
            status: 501,
            message: '数据库发生问题'
          }
        })
        return
      } else {
        if (result.length == 0) {
          order_id = order_id + '0001'
        } else {
          const orderNum =
            Number(result[result.length - 1].order_id.slice(8)) + 1
          order_dayId = orderNum
          if (orderNum < 10) {
            order_id = order_id + '000' + orderNum
          } else if (orderNum < 100) {
            order_id = order_id + '00' + orderNum
          } else {
            order_id = order_id + '0' + orderNum
          }
        }
      }
      order.order_time = new Date().toLocaleString()
      order.order_id = order_id
      let sql =
        "INSERT INTO `bibo_milktea`.`order` (`order_id`, `order_userid`, `order_time`, `order_price`, `order_info`,`order_state`,`order_take_way`,`order_count`,`order_dayId`) VALUES ('" +
        order.order_id +
        "', '" +
        order.order_user_id +
        "', '" +
        order.order_time +
        "', '" +
        order.order_price +
        "', '" +
        order.order_info +
        "', '" +
        order.order_state +
        "', '" +
        order.order_take_way +
        "', '" +
        order.order_count +
        "', " +
        order_dayId +
        ');'
      DB(sql, (err2) => {
        if (err2) {
          console.log(err2)
          res.send({
            meta: {
              status: 501,
              message: '数据库发生问题'
            }
          })
          return
        }
      })
      for (let i = 0; i < order.cart.length; i++) {
        sql =
          "INSERT INTO `bibo_milktea`.`shopcart` (`order_id`, `user_id`, `good_id`, `good_count`, `good_size`, `good_ice`, `good_sugar`, `good_etc`, `good_price`, `good_name`, `good_img`) VALUES ('" +
          order.order_id +
          "', '" +
          order.order_user_id +
          "', '" +
          order.cart[i].good_id +
          "', '" +
          order.cart[i].count +
          "', '" +
          order.cart[i].size +
          "', '" +
          order.cart[i].ice +
          "', '" +
          order.cart[i].sugar +
          "', '" +
          order.cart[i].etc
            .map((item) => {
              return item[0]
            })
            .join('/') +
          "', '" +
          order.cart[i].good_price +
          "', '" +
          order.cart[i].good_name +
          "', '" +
          order.cart[i].good_img +
          "');"
        DB(sql, (err3) => {
          if (err3) {
            console.log(err3)
            res.send({
              meta: {
                status: 501,
                message: '数据库发生问题'
              }
            })
            return
          }
        })
      }
      console.log('add order ok')
      ws.clients.forEach((socket) => {
        socket.emit('newOrder', '新订单')
      })
      res.send({
        meta: {
          status: 200,
          msg: 'ok'
        }
      })
    }
  )
})

// 根据用户id获取订单
router.get('/api/get/order/id', (req, res) => {
  const user_id = req.query.user_id
  let sql = `SELECT * FROM bibo_milktea.order where order_userid = ${user_id}`
  DB(sql, (err, result) => {
    if (err) {
      res.send({
        meta: {
          status: 501,
          msg: '数据库错误'
        }
      })
      return
    } else {
      res.send({
        meta: {
          status: 200,
          msg: 'ok'
        },
        data: result
      })
    }
  })
})

// 修改订单状态
router.get('/api/update/order', (req, res) => {
  const order_id = req.query.order_id
  const order_state = req.query.order_state
  let sql =
    "UPDATE `bibo_milktea`.`order` SET `order_state` = '" +
    order_state +
    "' WHERE (`order_id` = '" +
    order_id +
    "');"
  DB(sql, (err, result) => {
    if (err) {
      res.send({
        meta: {
          status: 501,
          msg: '数据库错误'
        }
      })
      return
    } else {
      res.send({
        meta: {
          status: 200,
          msg: 'ok'
        }
      })
    }
  })
})

// 查看今日订单
router.get('/api/today/order', (req, res) => {
  const now = new Date()
  let order_id = `${now.getFullYear()}${
    now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
  }${now.getDate() < 10 ? '0' + now.getDate() : now.getDate()}`

  DB(
    `select * from bibo_milktea.order where order_id like "${order_id}%"`,
    (err, result) => {
      if (err) {
        console.log(err)
        res.send({
          meta: {
            status: 501,
            message: '数据库发生问题'
          }
        })
        return
      } else {
        res.send({
          meta: {
            status: 200,
            message: 'ok'
          },
          data: result
        })
      }
    }
  )
})

// 获取当前还有多少制作中的订单
router.get('/api/now/order', (req, res) => {
  const now = new Date()
  let order_id = `${now.getFullYear()}${
    now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
  }${now.getDate() < 10 ? '0' + now.getDate() : now.getDate()}`
  if (req.query.day_id) {
    const dayID = Number(req.query.day_id.slice(8))
    DB(
      `SELECT order_count FROM bibo_milktea.order where order_id like '${order_id}%' and order_dayId < ${dayID}  and (order_state = '已下单' || order_state ='制作中')`,
      (err, result) => {
        if (err) {
          console.log(err)
          res.send({
            meta: {
              status: 501,
              message: '数据库发生问题'
            }
          })
          return
        } else {
          const resultArr = result.map((item) => item.order_count)
          const resultObj = {
            sumOrder: resultArr.length,
            sumCount: resultArr.reduce((a, b) => a + b, 0)
          }
          res.send({
            meta: {
              status: 200,
              message: 'ok'
            },
            data: resultObj
          })
        }
      }
    )
  } else {
    DB(
      `SELECT order_count FROM bibo_milktea.order where order_id like '${order_id}%' and (order_state = '已下单' || order_state ='制作中')`,
      (err, result) => {
        if (err) {
          console.log(err)
          res.send({
            meta: {
              status: 501,
              message: '数据库发生问题'
            }
          })
          return
        } else {
          const resultArr = result.map((item) => item.order_count)
          const resultObj = {
            sumOrder: resultArr.length,
            sumCount: resultArr.reduce((a, b) => a + b, 0)
          }
          res.send({
            meta: {
              status: 200,
              message: 'ok'
            },
            data: resultObj
          })
        }
      }
    )
  }
})

// 根据订单id获取对应购物车
router.get('/api/orderid/cart', (req, res) => {
  const order_id = req.query.order_id
  DB(
    `SELECT * FROM bibo_milktea.shopcart where order_id = '${order_id}'`,
    (err, result) => {
      if (err) {
        console.log(err)
        res.send({
          meta: {
            status: 501,
            message: '数据库发生问题'
          }
        })
        return
      } else {
        res.send({
          meta: {
            status: 200,
            message: 'ok'
          },
          data: result
        })
      }
    }
  )
})

// 获取用户当前订单
router.get('/api/get/order/current', (req, res) => {
  const now = new Date()
  let order_id = `${now.getFullYear()}${
    now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
  }${now.getDate() < 10 ? '0' + now.getDate() : now.getDate()}`
  const user_id = req.query.user_id
  let sql = `SELECT * FROM bibo_milktea.order where order_id like '${order_id}%' and order_userid = ${user_id} and (order_state = '待支付' || order_state = '已下单' || order_state = '制作中' || order_state = '待取餐')`
  DB(sql, (err, result) => {
    if (err) {
      res.send({
        meta: {
          status: 501,
          msg: '数据库错误'
        }
      })
      return
    } else {
      res.send({
        meta: {
          status: 200,
          msg: 'ok'
        },
        data: result
      })
    }
  })
})

// 获取用户历史订单
router.get('/api/get/order/history', (req, res) => {
  const user_id = req.query.user_id
  let sql = `SELECT * FROM bibo_milktea.order where order_userid = ${user_id} and (order_state = '已完成' || order_state = '已取消')`
  DB(sql, (err, result) => {
    if (err) {
      res.send({
        meta: {
          status: 501,
          msg: '数据库错误'
        }
      })
      return
    } else {
      res.send({
        meta: {
          status: 200,
          msg: 'ok'
        },
        data: result
      })
    }
  })
})

// 分页获取所有订单
router.post('/api/get/allOrder', (req, res) => {
  let sql = `SELECT * FROM bibo_milktea.order limit ${
    (req.body.page - 1) * 10
  },${req.body.limit}`
  DB(sql, (err, result) => {
    if (err) {
      console.log(err)
      res.send({
        meta: {
          status: 501,
          msg: '数据库错误'
        }
      })
      return
    } else {
      res.send({
        meta: {
          status: 200,
          msg: 'ok'
        },
        data: result
      })
    }
  })
})

// 根据订单号查找订单
router.get('/api/get/order/orderid', (req, res) => {
  const order_id = req.query.order_id
  let sql = `SELECT * FROM bibo_milktea.order where order_id like '${order_id}%'`
  DB(sql, (err, result) => {
    if (err) {
      res.send({
        meta: {
          status: 501,
          msg: '数据库错误'
        }
      })
      return
    } else {
      res.send({
        meta: {
          status: 200,
          msg: 'ok'
        },
        data: result
      })
    }
  })
})

module.exports = router
