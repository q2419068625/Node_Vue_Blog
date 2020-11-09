module.exports = app => {
    const mongoose = require('mongoose');
    //连接mongodb数据库
    mongoose.connect('mongodb://127.0.0.1:27017/node-vue-blog', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true,
        useFindAndModify:false
    })
}