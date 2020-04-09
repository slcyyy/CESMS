<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <h1 class="header-title">化工企业管理系统</h1>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside
        width="auto"
        @mouseenter.native="collapseOpen"
        @mouseleave.native="collapseClose"
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
import managerMenu from '@/utils/managerMenu.js'
import riskMenu from '@/utils/riskMenu.js'
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
        if(roleId.indexOf('1')!=-1) return this.menulist = managerMenu
        else if(roleId.indexOf('5')!=-1)  return this.menulist = riskMenu
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
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  /* min-height: 400px; */
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
