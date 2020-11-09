<template>
<div class="box">
    <div class="login">
        <Card style="width:420px">
            <Form ref="formLogin" :model="formLogin" :rules="ruleLogin">
                <FormItem prop="email">
                    <Input type="text" v-model="formLogin.email" placeholder="请输入邮箱">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="formLogin.password" placeholder="请输入密码">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
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
                    <Button type="primary" @click="Login" style="width:100%">登录</Button>
                </FormItem>
                <FormItem>
                    <span class="register">
                        <router-link to="/register">注册用户</router-link>
                    </span>
                </FormItem>

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
        const validateUserEamil = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入邮箱'))
            } else {
                const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value);
                // console.log(reg)
                if (!reg) {
                    callback(new Error('请填写正确的邮箱'))
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
            formLogin: {
                email: '',
                password: ''
            },
            ruleLogin: {
                email: [{
                    required: true,
                    validator: validateUserEamil,
                    trigger: 'blur',
                    min: 6,
                    max: 16,

                }],
                password: [{
                    required: true,
                    validator: validatePWD,
                    min: 8,
                    max: 16,
                    trigger: 'blur'
                }],
            }

        }
    },
    methods: {
        async Login() {
            if (!this.formLogin.email || !this.formLogin.password) {
                this.$Message.warning('表单验证失败');
            } else {
                if (vaptchaToken && vaptchaToken.token) {
                    await this.$axios.post('/admin/api/login', {
                        email: this.formLogin.email,
                        password: this.formLogin.password
                    }).then(res => {
                        console.log(res.data)
                        if (!res.data.success) {
                            return this.$Message.warning(`${res.data.error}`);
                        }
                        localStorage.setItem('token', res.data.token)
                    }).catch(err => {
                        console.log(err)
                        this.$Message.warning('账号或密码错误');
                    })
                } else {
                    this.$Message.warning('请进行人机验证');
                }

            }
        },
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
    background: url('../assets/body.8aa7c4a6.svg') center center no-repeat;
    background-color: rgb(247, 247, 247);
}

.box .login {
    position: relative;
}

.register {
    position: absolute;
    right: 16px;

}
</style>
