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

//全局钩子函数 next执行完成后导航的状态是confirmed,否则为false
router.beforeEach((to,from,next)=>{
  if(to.meta.title){
    document.title = to.meta.title
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
