import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 重置
import './assets/css/reset.css'
// 解决边框1px像素问题
import './assets/css/border.css'
import './assets/js/rem.js'
import './assets/iconfont/iconfont.css'
import axios from 'axios'
import ToastPlugin from './plugins/Toast.js'
// import VConsole from 'vconsole'

// eslint-disable-next-line no-new
// new VConsole()
Vue.use(ToastPlugin)

Vue.config.productionTip = false
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'

// 接口拦截
axios.interceptors.response.use(response => {
  // console.log(response)
  const res = response.data
  if (res.status === 1) { // 请求成功,data过滤掉
    return res.data
  } else if (res.status === 0) { // 请求失败
    console.error(res)
    return Promise.reject(res)
  }
}, error => {
  console.error(error)
  return Promise.reject(error)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
