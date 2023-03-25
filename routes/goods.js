const DB = require('../db/connection')
var express = require('express')
var router = express.Router()

router.get('/api/goodlist', function (req, res) {
  DB('select * from goods', function (err, result) {
    if (err) {
      console.log(err.message)
    } else {
      console.log('ok')
      console.log(result)
      res.json({ msg: 'ok' })
    }
  })
})

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
