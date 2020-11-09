const express = require("express");

const jwt = require('jsonwebtoken')
var assert = require('http-assert')
const { register, login } = require('../../controllers/admin.js')

const router = express.Router();
//注册
router.route("/register").post(register)
    //登录
router.route("/login").post(login)


module.exports = router;