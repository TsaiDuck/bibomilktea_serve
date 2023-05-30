const DB = require('../db/connection')
var express = require('express')
var router = express.Router()

// 获取物料列表
router.get('/api/materialList', function (req, res) {
  DB('select * from materials', function (err, result) {
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
          msg: 'get materialList ok'
        }
      })
    }
  })
})

// 新增物料
router.post('/api/addmaterial', function (req, res) {
  console.log(req.body)
  const sql =
    "INSERT INTO `bibo_milktea`.`materials` (`material_name`, `material_count`, `material_date`) VALUES ('" +
    req.body.material_name +
    "'," +
    req.body.material_count +
    ',' +
    req.body.material_date +
    "')"
  DB(sql, function (err, result) {
    if (err) {
      console.log(err.message)
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

// 修改物料信息
router.post('/api/updatematerial', function (req, res) {
  console.log(req.body)
  let sql =
    "UPDATE `bibo_milktea`.`materials` SET `material_name` = '" +
    req.body.material_name +
    "', `material_count` = '" +
    req.body.material_count +
    "', `material_date` = '" +
    req.body.material_date +
    "' WHERE (`material_id` = '" +
    req.body.material_id +
    "')"
  console.log(sql)
  DB(sql, function (err, result) {
    if (err) {
      console.log(err.message)
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

module.exports = router
