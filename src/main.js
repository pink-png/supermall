import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入toastjs文件
import toast from 'components/common/toast'
//安装toast插件
Vue.use(toast)

// 导入fastclick这个库
import FastClick from 'fastclick'

//使用fastclick解决300ms的延迟
FastClick.attach(document.body)

// 添加事件总线对象
Vue.prototype.$bus = new Vue()
Vue.config.productionTip = false

//导入vue-lazyload这个库
import VueLazyLoad from 'vue-lazyload'

//安装这个插件
Vue.use(VueLazyLoad, {
  preLoad: 1,
  loading: require('assets/img/common/placeholder.png')
})

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
