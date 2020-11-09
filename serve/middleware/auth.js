const User = require('../models/User');
const jwt = require("jsonwebtoken");
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');

exports.protect = asyncHandler(async(req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new ErrorResponse("无权限访问该路由", 401));
    }
    try {
        //验证token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //找到登录的用户信息
        req.user = User.findById(decoded.id);
        next();
    } catch (error) {
        return next(new ErrorResponse("无权限访问该路由", 401));
    }
})