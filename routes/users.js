const DB = require('../db/connection')

var express = require('express')
var router = express.Router()

/* GET users listing. */
// 获取登录页面背景图
router.get('/api/user/bg', function (req, res) {
  res.send({
    data: { bgURL: 'http://1.12.227.13:3000/milktea/00245-3553923336-.png' },
    meta: {
      status: 200,
      msg: 'ok'
    }
  })
})

// 注册
router.post('/api/user/register', function (req, res) {
  console.log(req.body)
  const user = {
    user_phone: req.body.user_phone,
    user_pwd: req.body.user_pwd
  }
  const sql =
    "insert into users(user_phone,user_pwd)values ('" +
    user.user_phone +
    "','" +
    user.user_pwd +
    "')"
  DB(sql, function (err, result) {
    if (err) {
      console.log(err.message)
    } else {
      console.log('DBok')
      console.log(result)
      res.send({
        data: {},
        meta: {
          status: 200,
          msg: 'ok'
        }
      })
    }
  })
})
// 登录
router.post('/api/user/login', function (req, res) {
  console.log(req.body)
  const sql =
    "SELECT * FROM bibo_milktea.users where user_pwd='" +
    req.body.user_pwd +
    "' and user_phone = '" +
    req.body.user_phone +
    "';"
  DB(sql, function (err, result) {
    if (err) {
      res.send({
        data: err,
        meta: {
          status: 500,
          msg: err.message
        }
      })
    } else {
      console.log('DBok')
      console.log(result[0])
      if (result.length !== 0) {
        const user = {
          user_id: result[0].user_id,
          user_name: result[0].user_name,
          user_phone: result[0].user_phone,
          user_birthday: result[0].user_birthday,
          user_gender: result[0].user_gender,
          user_address: result[0].user_address,
          user_head: result[0].user_head,
          user_root: result[0].user_root
        }
        res.send({
          data: { user },
          meta: {
            status: 200,
            msg: 'ok'
          }
        })
      } else {
        res.send({
          data: {},
          meta: {
            status: 201,
            msg: 'fail'
          }
        })
      }
    }
  })
})
// 修改个人信息
router.post('/api/user/update/userinfo', function (req, res) {
  const user = {
    user_id: req.body.user_id,
    user_name: req.body.user_name,
    user_phone: req.body.user_phone,
    user_birthday: req.body.user_birthday,
    user_gender: req.body.user_gender,
    user_address: req.body.user_address
  }
  const sql =
    "update users set user_name='" +
    user.user_name +
    "',user_phone='" +
    user.user_phone +
    "',user_birthday='" +
    user.user_birthday +
    "',user_gender='" +
    user.user_gender +
    "',user_address='" +
    user.user_address +
    "' where user_id = " +
    user.user_id +
    ''
  DB(sql, function (err, result) {
    if (err) {
      console.log(err.message)
    } else {
      console.log('DBok')
      console.log(result)
      res.send({
        data: {},
        meta: {
          status: 200,
          msg: 'ok'
        }
      })
    }
  })
})
module.exports = router
