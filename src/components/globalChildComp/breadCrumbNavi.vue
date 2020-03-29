 <!--面包屑导航-->
<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><slot name="secondPath"></slot></el-breadcrumb-item>
      <el-breadcrumb-item><slot name="thirdPath"></slot></el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {

}
</script>

<style>

</style>