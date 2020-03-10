import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//全部引入的方式
//  import ElementUI from 'element-ui'
// 插件
import MyServerHttp from './plugins/http.js'
import './plugins/element.js'

//引入CSS文件
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

Vue.use(MyServerHttp)
// Vue.use(ElementUI)
// Vue.prototype.$message = Message
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
