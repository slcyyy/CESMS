<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <h1 class="header-title">化工企业管理系统</h1>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="false"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
        <!-- unique必须要加冒号，因为是不加冒号是个字符串 -->
        <!-- 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <!-- index只接受字符串 加''是为了变为字符串 -->
        <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
          <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.name}}</span>
              </template>
              <!-- 二级菜单 -->
               <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" 
               :key="subItem.id" @click = "saveNavState('/'+subItem.path)">
               <i class="el-icon-menu"></i>
               <span>{{subItem.name}}</span>
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
      // isCollapse:false
      //*** 用路由可能好一点，用计算属性*/ */
      activePath:''
    }
  },
  //生命周期函数
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取左侧菜单数据
    async getMenuList(){
      const {data:res} = await this.$http.get('/index/menus')
      if(res.meta.err !== 0) return this.$message.error("获取左侧列表失败")
      this.menulist = res.menu
    },
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
    }
  }
}
</script>

<style>
.home-container {
  height: 100%;
}
.el-header {
  background-color:	#A2B5CD;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-title {
  font-size: 25px;
}
.el-aside {
  background-color: #545c64;
}
.el-main {
  background-color:	#ffffff;
}
.el-menu{
  border-right:none;
}
.iconfont{
  margin-right:10px;
}
</style>