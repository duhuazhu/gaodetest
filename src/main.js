import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'animate.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 全局引入按需引入UI库 vant
import '@/plugins/vant'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入全局样式
import '@/assets/css/index.scss'
// 移动端适配
import 'lib-flexible/flexible.js'
import axios from 'axios'

axios.defaults.baseURL = "http://localhost:3000/";
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config
})
Vue.use(ElementUI);
Vue.prototype.$http = axios
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
