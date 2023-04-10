const DB = require('../db/connection')
var express = require('express')
var router = express.Router()

// 获取商品列表
router.get('/api/goodlist', function (req, res) {
  DB('select * from goods', function (err, result) {
    if (err) {
      res.send({
        meta: {
          status: 201,
          msg: 'fail'
        }
      })
    } else {
      res.send({
        data: result,
        meta: {
          status: 200,
          msg: 'get goodlist ok'
        }
      })
    }
  })
})

// 增加商品
router.post('/api/addgood', function (req, res) {
  const good = {}
  console.log(req.body)
  const sql =
    "insert into goods(good_name,good_info,good_price,good_class,good_img) values ('" +
    req.body.good_name +
    "','" +
    req.body.good_info +
    "'," +
    req.body.good_price +
    ",'" +
    req.body.good_class +
    "','" +
    req.body.good_img +
    "')"
  DB(sql, function (err, result) {
    if (err) {
      console.log(err.message)
    } else {
      console.log('DBok')
      console.log(result)
    }
  })
  console.log(sql)
  res.json({
    msg: 'ok'
  })
})

module.exports = router
