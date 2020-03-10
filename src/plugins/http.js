import axios from 'axios'

const MyHttpServer={}

MyHttpServer.install = (Vue) => {
    axios.defaults.baseURL='http://127.0.0.1:3000/'
    //  添加实例方法:给原型属性添加成员名
    //设置axios拦截器，做一个预处理
    axios.interceptors.request.use(config =>{
      //最后必须return config
      config.headers.Authorization = window.sessionStorage.getItem('token')
      return config
    })
    Vue.prototype.$http = axios
    
  }

export default MyHttpServer