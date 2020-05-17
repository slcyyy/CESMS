import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login/login'
import forget from '@/components/login/forget'

import Home from '@/components/home'
import Welcome from '@/components/welcome'
import UsersList from '@/components/users/usersList'
import RoleList from '@/components/users/roleList'
import fillTable from '@/components/grade/fillTable'

import chemicals from '@/components/archives/chemicals'
import laws from '@/components/archives/laws'

import majorHazard from '@/components/riskManage/majorHazard'
import HIRARC from '@/components/riskManage/hazardAssess'
import editPlan from '@/components/riskManage/planChildren/editPlan'
import safetyPlan from '@/components/riskManage/safetyPlan'
 
import personalInfo from '@/components/personal/personalInfo'
import account from '@/components/personal/account'

import dataset from '@/components/grade/dataset'
import checklist from '@/components/grade/checklist'
import getScore from '@/components/grade/getScore'
import fillStatus from '@/components/grade/fillStatus'


Vue.use(VueRouter)
//vscode提供的目录功能 @->src
const routes = [
  {
    path:'',
    redirect:'/login'
  },
  {
    path: '/login',
    component:Login,
    meta:{
      title:"化工企业安全管理系统-CESMS"
    }
  },
  {
    path: '/forget',
    component:forget,
    meta:{
      title:"忘记密码-CESMS"
    }
  },
  {
    path:'/checklist',
    component:checklist,
    meta:{
      title:"评分表-CESMS"
    }
  },
  {
    path:'/safetyPlan/editPlan',
    component:editPlan,
    meta:{
      title:"编辑安全计划表-CESMS"
    }

  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome,
        meta:{
          title:"CESMS-欢迎"
        }
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
        path:'/personalInfo',
        component:personalInfo
      },
      {
        path:'/importEvaluateTable',
        component:dataset
      },
      {
        path:'/fillTable',
        component:fillTable,
      },
      {
        path:'/getScore',
        component:getScore
      },
      {
        path:'/getFillStatus',
        component:fillStatus,
        meta:{
          title:"填写评分表-CESMS"
        }
      },
      {path:'/safetyPlan',
       component:safetyPlan,
       meta:{
        title:"CESMS-自定义安全计划表-"
      }
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
  if(to.path === '/login') return next(); 
  if(to.path === '/forget') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('./login')
  //有token直接放行
  next(); 
})
export default router
