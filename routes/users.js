var express = require('express')
var router = express.Router()

/* GET users listing. */
// 注册
router.get('/api/user/register', function (req, res, next) {
  console.log('get users')
  const user = {
    user_name: req.body.user_name,
    user_pwd: req.body.user_pwd,
    user_phone: req.body.user_phone,
    user_head: req.body.user_head
  }
  res.send('respond with a resource')
})

// 获取登录页面背景图
router.get('/api/user/bg', function (req, res) {
  res.send({
    data: { bgURL: 'http://localhost:3000/milktea/00245-3553923336-.png' },
    meta: {
      status: 200,
      msg: 'ok'
    }
  })
})
module.exports = router
