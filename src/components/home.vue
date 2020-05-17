<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <h1 class="header-title">化工企业安全管理系统</h1>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside
        width="auto"
        @mouseenter.native="collapseOpen"
        @mouseleave.native="collapseClose"
        style="display:fixed;overflow-x:hidden"
      >
        <el-menu
          class="el-menu-vertical"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="false"
          :collapse-transition="false"
          router
          :collapse="isCollapse"
        >
          <!-- unique必须要加冒号，因为是不加冒号是个字符串 -->
          <!-- 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
          <!-- index只接受字符串 加''是为了变为字符串 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
            class="el-menu-vertical"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.name }}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- @click = "saveNavState('/'+subItem.path)"  -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <i class="el-icon-menu"></i>
              <span>{{ subItem.name }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
 import menu from '@/utils/menu.js'
export default {
  data(){
    return{
      menulist:[],
      iconsObj:{
        '1':'el-icon-s-custom',
        '2':'el-icon-s-management',
        '3':'el-icon-s-data',
        '4':'el-icon-s-claim',
        '5':'el-icon-s-tools'
      },
      userId:'',
      isCollapse: true,
      collapseBtnClick: false,
      menu: [
	{
		id:1,
		name:'个人管理',
		path:'users',
		children:[
			{id:11,name:'修改密码',path:'account'},
			{id:12,name:'个人信息',path:'personalInfo'}
		]
	},
	{
		id:2,
		name:'档案管理',
		path:'archives',
		children:[
			{id:21,name:'危险化学品管理',path:'chemicals'},
			{id:22,name:'法律法规标准规范',path:'laws'},
		]
	},
	{
		id:3,
		name:'风险管理',
		path:'risk',
		children:[
			{id:31,name:'重大危险源辨识和分级',path:'majorHazard'},
			{id:32,name:'风险评估',path:'hazardAssess'},
			{id:33,name:'自定义安全计划表',path:'safetyPlan'}
		]
	},
	{
		id:4,
		name:'企业评价',
		path:'grade',
		children:[	
			{id:41,name:'填写评分表',path:'fillTable'},
			{id:42,name:'查看填写情况',path:'getFillStatus'},
			{id:44,name:'查看评分结果',path:'getScore'}, //last score
			{id:45,name:'导入评价表',path:'importEvaluateTable'}, 
		]
	},
	{
		id:5,
		name:'管理员设置',
		path:'manager',
		children:[
			{id:51,name:'用户管理',path:'usersList'},
			{id:52,name:'权限管理',path:'roleList'},
		]	
	}
]

    }
  },
  //生命周期函数
  created(){
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getIcon(){
      if(this.isCollapse) return 'el-icon-d-arrow-left'
      return 'el-icon-d-arrow-right'
    },
    collapseOpen() {
      if (this.collapseBtnClick) return;
      this.isCollapse = false;
    },
    collapseClose() {
      if (this.collapseBtnClick) return;
      this.isCollapse = true;
    },
    //获取左侧菜单数据
     getMenuList(){
        let roleId = window.sessionStorage.roleId
        let powerId = window.sessionStorage.powerId
        let power_arr = powerId.split(',')
        //因为powerId字符串最后有个逗号
        power_arr.sort((a,b)=>{
          return Number(a)-Number(b)
        })
       
        let record = -1
        for(let i = 0;i<power_arr.length;i++){
          if(power_arr[i]<10){
            for(let j=0;j<this.menu.length;j++){
              if(power_arr[i] == this.menu[j].id){
                this.menulist.push(this.menu[j])
                if(power_arr[i] == 4){
                   record = i
                }
              }
            }
          }
          else{
            break;
          }
        }
       //在企业评分ID为4的时候考虑一下，因为汇总人和专家可以看到的界面是不同的
         this.menulist[record].children.splice(0, this.menulist[record].children.length)
         for(let j = 0;j<power_arr.length;j++){
            for(let i=0;i<menu[3].children.length;i++){
                if(power_arr[j] == menu[3].children[i].id){
                  this.menulist[record].children.push(menu[3].children[i])  
                }
            }
          }
    },
  }
}
</script>

<style>
.home-container {
  height: 100%;
}
.el-header {
/* #a2b5cd; */
  background-color: #a2b5cd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-title {
  font-size: 25px;
}
.el-menu--collapse{
 width:25px
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px;
}

.el-aside {
  background-color: #545c64;
}
.el-main {
  background-color: #f5f5fe;
}
.el-menu {
  border-right: none;
}
.iconfont {
  margin-right: 10px;
}
</style>
