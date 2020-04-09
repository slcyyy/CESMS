 <!--面包屑导航-->
<template>
  <div class="card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><slot name="secondPath"></slot></el-breadcrumb-item>
      <el-breadcrumb-item><slot name="thirdPath"></slot></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.card{
  width: 100%;
  /* 设置两层阴影 */
  box-shadow: 0 4px 1px 0 rgba(196, 196, 204, 0.2), 0 6px 3px 0 rgba(196, 196, 204, 0.19);
  text-align: center;
}
</style>