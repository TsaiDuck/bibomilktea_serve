const express = require('express')
const expressWs = require('express-ws')

const router = express.Router()
expressWs(router)
