const DB = require('../db/connection')
var express = require('express')
var router = express.Router()
const multiparty = require('multiparty')
const fs = require('fs')
const axios = require('axios')
const http = axios.create({
  baseURL: 'https://www.tsaiduck.cn',
  timeout: 5000
})
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
      res.send({
        meta: {
          status: 200,
          msg: 'ok'
        }
      })
    }
  })
})

// 上传图片
router.post('/api/uploadImage', function (req, res) {
  var form = new multiparty.Form({ uploadDir: './public/images/' })
  form.parse(req, function (err, fields, files) {
    //
    try {
      if (!fields.good_id) {
        console.log('no id')
        const good = {
          good_name: fields.good_name[0],
          good_info: fields.good_info[0],
          good_price: fields.good_price[0],
          good_class: fields.good_class[0],
          good_img: `https://www.tsaiduck.cn/images/${
            files.good_img[0].path.split('\\')[2]
          }`
        }
        http({
          method: 'post',
          url: '/api/addgood',
          data: JSON.stringify(good),
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
          .then(({ data: res1 }) => {
            console.log(res1)
            res.send({
              meta: {
                status: 200,
                msg: 'ok'
              }
            })
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        console.log('have id')
        const good = {
          good_id: fields.good_id[0],
          good_name: fields.good_name[0],
          good_info: fields.good_info[0],
          good_price: fields.good_price[0],
          good_class: fields.good_class[0],
          good_img: files.good_img
            ? `https://www.tsaiduck.cn/images/${
                files.good_img[0].path.split('\\')[2]
              }`
            : fields.good_img[0]
        }
        http({
          method: 'post',
          url: '/api/updateGood',
          data: JSON.stringify(good),
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
          .then(({ data: res1 }) => {
            if (res1.meta.status == 200) {
              res.send({
                meta: {
                  status: 200,
                  msg: 'ok'
                }
              })
            } else {
              res.send({
                meta: {
                  status: 201,
                  msg: '服务器错误'
                }
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    } catch (error) {
      console.log(err)
      console.log(error)
      res.send({
        meta: {
          status: 201,
          msg: '服务器错误'
        }
      })
    }
  })
})

// 修改商品
router.post('/api/updateGood', (req, res) => {
  let sql =
    "UPDATE `bibo_milktea`.`goods` SET `good_name` = '" +
    req.body.good_name +
    "', `good_info` = '" +
    req.body.good_info +
    "', `good_price` = '" +
    req.body.good_price +
    "', `good_class` = '" +
    req.body.good_class +
    "', `good_img` = '" +
    req.body.good_img +
    "' WHERE (`good_id` = '" +
    req.body.good_id +
    "');"
  DB(sql, function (err, result) {
    if (err) {
      console.log(err)
      res.send({
        meta: {
          status: 500,
          msg: '数据库错误'
        }
      })
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

// 删除商品
router.get('/api/deleteGood', (req, res) => {
  let sql =
    "DELETE FROM `bibo_milktea`.`goods` WHERE (`good_id` = '" +
    req.query.good_id +
    "');"
  DB(sql, function (err, result) {
    if (err) {
      console.log(err)
      res.send({
        meta: {
          status: 500,
          msg: '数据库错误'
        }
      })
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
