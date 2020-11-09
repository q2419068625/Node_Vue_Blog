const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const cookieParser = require('cookie-parser')


//从文件加载环境变量
dotenv.config({
    path: "./config/config.env",

});
//创建路由
const app = express();

//跨域处理
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); //允许任何源
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*'); //允许任何类型
    // res.writeHead(200, {"Content-Type": "text/plain;charset=utf-8"});  
    next(); //next 方法就是一个递归调用
});

//引入路由文件
const admin = require('./routes/admin/index')
const errorHandler = require('./middleware/error');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json())
app.set('secret', '78sd7f7sdfsdf83')

//挂载路由节点
app.use('/admin/api', admin)

require('./plugins/db')(app)

//引入处理错误中间件
app.use(errorHandler)





app.listen(3000);
console.log('http://localhost:3000');