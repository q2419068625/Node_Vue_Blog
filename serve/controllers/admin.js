const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
//注册
exports.register = asyncHandler(async(req, res, next) => {
    // console.log(req.body);
    const user = await User.create(req.body);
    //生成token
    sendTokenResponse(user, 200, res);

});
//登录
exports.login = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;
    console.log(req.body);

    //判断email, password是否存在
    if (!email || !password) {
        return next(new ErrorResponse("邮箱或密码为空", 401));
    }

    //获取用户信息
    const user = await User.findOne({ email }).select("+password");
    //     console.log(user);
    //校验用户信息是否存在
    if (!user) {
        next(new ErrorResponse("参数有误", 400));
    }
    //检验密码
    const isMatch = user.matchPassword(password);
    console.log(isMatch);
    if (!isMatch) {
        return next(new ErrorResponse("密码错误", 401));
    }

    //生成token
    sendTokenResponse(user, 200, res);


});

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now + 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    res.status(statusCode).cookie("token", token, options).json({ success: true, token })
}