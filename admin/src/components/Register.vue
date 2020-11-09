<template>
<div class="box">
    <div class="login">
        <Card style="width: 420px">
            <Form class="register-form" ref="registerFrom" :model="registerFrom" :rules="registerRule">
                <FormItem prop="email" label="">
                    <Input type="text" v-model="registerFrom.email" placeholder="请输入邮箱地址">
                    <Icon type="ios-mail" slot="prepend" />
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="registerFrom.password" placeholder="请输入密码(8-16位)">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="repeatpassword">
                    <Input type="password" v-model="registerFrom.repeatpassword" placeholder="请确认密码">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="name" label="">
                    <Input type="text" v-model="registerFrom.name" placeholder="请输入用户名">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem>
                    <div id="vaptchaContainer" @click="initVaptcha" style="width: 300px;height: 36px;">
                        <!--vaptcha-container是用来引入VAPTCHA的容器，下面代码为预加载动画，仅供参考-->
                        <div class="vaptcha-init-main">
                            <div class="vaptcha-init-loading">
                                <a href="/" target="_blank">
                                    <img src="https://r.vaptcha.net/public/img/vaptcha-loading.gif" />
                                </a>
                                <span class="vaptcha-text">Vaptcha启动中...</span>
                            </div>
                        </div>
                    </div>
                </FormItem>

                <FormItem>
                    <Button type="primary" @click="register" style="width: 100%">注册</Button>
                </FormItem>

                <div class="loginBtn">
                    已经拥有账户？ <router-link to="/">登录</router-link>
                </div>

            </Form>
        </Card>
    </div>
</div>
</template>

<script>
import {
    vaptcha
} from '../plugins/vaptcha';
var vaptchaToken = null;
export default {
    data() {
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入你的密码'));
            } else {
                if (this.registerFrom.password !== value) {
                    // 对第二个密码框单独验证
                    callback(new Error('密码不一致'));
                }
                callback();
            }
        };
        const validateEmail = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入邮箱'))
            } else {
                const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value);
                // console.log(reg)
                if (!reg) {
                    callback(new Error('请填写合法的邮箱地址'))
                }
                callback();
            }
        };
        const validatePWD = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                const reg = /^[a-zA-Z0-9]\w{7,16}$/.test(value);
                // console.log(reg)
                if (!reg) {
                    callback(new Error('请填写正确密码'))
                }
                callback();
            }
        };
        return {
            registerFrom: {
                name: '',
                password: '',
                repeatpassword: '',
                email: ''
            },
            registerRule: {
                name: [{
                    required: true,
                    trigger: 'blur',
                    message: "请输入用户名"

                }],
                password: [{
                    required: true,
                    validator: validatePWD,
                    min: 8,
                    max: 16,
                    trigger: 'blur'
                }],
                repeatpassword: [{
                    required: true,
                    validator: validatePass,
                    trigger: 'blur',
                    min: 8,
                    max: 16
                }],
                email: [{
                    required: true,
                    trigger: 'blur',
                    validator: validateEmail,
                }]
            },
            flag: false

        }
    },
    methods: {
        async register() {
            if (!this.registerFrom.name || !this.registerFrom.password || !this.registerFrom.repeatpassword || !this.registerFrom.email) {
                this.$Message.warning('表单验证失败');
            } else {
                try {
                    if (vaptchaToken && vaptchaToken.token) {
                        const data = await this.$axios.post('/admin/api/register', {
                            name: this.registerFrom.name,
                            password: this.registerFrom.password,
                            email: this.registerFrom.email
                        }).then(res => {
                            // console.log(res)
                            if (!res.data.success) {
                                return this.$Message.warning(`注册失败${res.data.error}`);
                            }
                            this.$router.push('/')
                        }).catch(error => {
                            throw error
                            // console.log(error)
                        })

                    } else {
                        this.$Message.warning('请进行人机验证');
                    }
                } catch (error) {
                    console.log(error)
                }
            }

        },
        //验证码
        initVaptcha() {
            vaptcha().then((vaptcha) => {
                vaptcha({
                    vid: '5f9ffdb44530397a5f5381c4', // 验证单元id
                    type: 'click', // 显示类型 点击式
                    scene: 0, // 场景值 默认0
                    offline_server: 'auto', // 离线模式服务端地址
                    container: '#vaptchaContainer' // 容器，可为Element 或者 selector
                }).then((vaptchaObj) => {
                    vaptchaObj.listen("pass", function () {
                        // 验证成功进行后续操作
                        var data = {
                            //表单数据
                            token: vaptchaObj.getToken(),
                        };
                        vaptchaToken = data || '';
                        // console.log(vaptchaToken)
                    });

                    //关闭验证弹窗时触发
                    vaptchaObj.listen("close", function () {
                        //验证弹窗关闭触发
                        vaptchaObj.reset();
                    });
                    vaptchaObj.render() // 调用验证实例 vaptchaObj 的 render 方法加载验证按钮
                })
            })
        }

    },
    mounted() {
        this.initVaptcha();
    }

}
</script>

<style scoped>
.box {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("../assets/body.8aa7c4a6.svg") center center no-repeat;
    background-color: rgb(247, 247, 247);
}

.box .login {
    position: relative;
}

.loginBtn {
    text-align: center;
}

.vaptcha-init-main {
    display: table;
    width: 100%;
    height: 100%;
    background-color: #eeeeee;
}

​ .vaptcha-init-loading {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}

​ .vaptcha-init-loading>a {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: none;
}

​ .vaptcha-init-loading>a img {
    vertical-align: middle;
}

​ .vaptcha-init-loading .vaptcha-text {
    font-family: sans-serif;
    font-size: 12px;
    color: #cccccc;
    vertical-align: middle;
}
</style>
