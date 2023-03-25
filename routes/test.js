const DB = require('../db/connection')
const { body, validationResult } = require('express-validator')
var express = require('express')
var router = express.Router()

router.get('/test', function (req, res, next) {
  console.log('get')
  DB('select * from users', function (err, result) {
    if (err) {
      console.log(err.message)
    } else {
      console.log('ok')
      console.log(result)
      res.send('ok')
    }
  })
})

module.exports = router
