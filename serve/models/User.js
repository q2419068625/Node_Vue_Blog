const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "请填写邮箱地址"],
        unique: true,
        trim: true,
        match: [
            /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
            "请填写合法的邮箱地址"
        ]
    },
    password: {
        type: String,
        required: [true, "请填写密码"],

        minlength: [8, "最少8位密码"],
        select: false
    },
    name: {
        type: String,
        required: [true, "请填写用户名"],
        maxlength: [50, "最多50个字"],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    }
});
//保存前用bcrypt 进行密码加密
UserSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
//设置token
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
}

//密码匹配
UserSchema.methods.matchPassword = function(enteredPassword) {
    return bcrypt.compareSync(enteredPassword, this.password);
}

module.exports = mongoose.model('User', UserSchema);