// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'

// //请求拦截器
// axios.interceptors.request.use(function(config) {
//     if (localStorage.getItem('token')) {
//         config.headers.Authorization = 'Bearer ' + localStorage.getItem('token')
//     }
//     return config;
// }, function(error) {
//     console.log(error);
//     return Promise.reject(error);
// });

//响应拦截器
// axios.interceptors.response.use(res => {
//     console.log(res);
//     return res
// }, err => {
//     console.log(err.response);
//     if (!err.response.data.success) {
//         console.log(123);
//         Vue.prototype.$message({
//             type: 'error',
//             message: err.response.data.data
//         })

//         if (err.response.status === 401) {
//             router.push('/')
//         }
//     }
//     return Promise.reject(err)
// })

Vue.prototype.$axios = axios

Vue.use(ViewUI);


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})