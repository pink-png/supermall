import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'


// 导入toastjs文件
import toast from 'components/common/toast'
//安装toast插件
Vue.use(toast)



// 添加事件总线对象
Vue.prototype.$bus = new Vue()
Vue.config.productionTip = false

Vue.use(VueLazyLoad, {
  preLoad: 1,
  loading: require('assets/img/common/placeholder.png')
})

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
