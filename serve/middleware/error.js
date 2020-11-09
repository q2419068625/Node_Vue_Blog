const ErrorResponse = require('../utils/errorResponse');

//捕获异常错误
const errorHandler = (err, req, res, next) => {
    // console.log(err);
    // console.log(err.name);
    //检验必填字段
    if (err.name == "ValidationError") {
        // err = new ErrorResponse(`${err}`,400)
        const message = Object.values(err.errors).map((val) => val.message)
            // console.log(message);
        err = new ErrorResponse(message, 400);
    }
    //返回重复字段值响应
    if (err.code == 11000) {
        const message = "邮箱已存在";
        err = new ErrorResponse(message, 400);
    }
    if (err.name == "ReferenceError") {
        const message = "密码验证失败"
            // console.log(message);
        err = new ErrorResponse(message, 400);
    }
    // if()


    res.json({ success: false, status: err.statusCode || 500, error: err.message || 'Server Error' });

}

module.exports = errorHandler;