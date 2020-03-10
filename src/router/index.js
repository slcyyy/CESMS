import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login/login'
import Home from '@/components/home'
import Welcome from '@/components/welcome'
import UsersList from '@/components/users/usersList'
import RoleList from '@/components/users/roleList'
import fillTable from '@/components/grade/fillTable'
import chemicals from '@/components/archives/chemicals'
import laws from '@/components/archives/laws'
import orgnization from '@/components/archives/orgnization'
import manage from '@/components/archives/manage'
import education from '@/components/archives/education'
import majorHazard from '@/components/riskManage/majorHazard'
import HIRARC from '@/components/riskManage/hazardAssess'
import vertifyEmail from '@/components/personal/vertifyEmail'
import account from '@/components/personal/account'
import dataset from '@/components/grade/dataset'
import checklist from '@/components/grade/checklist'

Vue.use(VueRouter)
//vscode提供的目录功能 @->src
const routes = [
  {
    path:'',
    redirect:'/login'
  },
  {
    path: '/login',
    component:Login
  },
  {
    path:'/checklist',
    component:checklist
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome,
      },
      {
        path:'/usersList',
        component:UsersList
      },
      {
        path:'/roleList',
        component:RoleList
      },
      {
        path:'/chemicals',
        component:chemicals
      },
      {
        path:'/laws',
        component:laws
      },
      {
        path:'/orgnization',
        component:orgnization
      },
      {
        path:'/manage',
        component:manage
      },
      {
        path:'/education',
        component:education
      },
      {
        path:'/majorHazard',
        component:majorHazard
      },
      {
        path:'/hazardAssess',
        component:HIRARC
      },
      {
        path:'/account',
        component:account
      },
      {
        path:'/vertifyEmail',
        component:vertifyEmail
      },
      {
        path:'/dataset',
        component:dataset
      },
      {
        path:'/fillTable',
        component:fillTable,
      },
    ]
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to代表将要访问的路径
  //from代表从哪个路径跳转而来
  //next是一个函数，表示放行
  if(to.path === '/login') return next(); 
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('./login')
  //有token直接放行
  next(); 
})
export default router
