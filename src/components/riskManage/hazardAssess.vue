<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="风险评估" name="first">
         <result></result>
      </el-tab-pane>
      <el-tab-pane label="风险识别" name="second">
         
      </el-tab-pane>
      <el-tab-pane label="等级标准" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import result from '@/components/hazardAssess/assessResult'
export default {
  data() {
    return {
      activeName: 'first'
    }
  },

  components:{
    result,
  }
}
</script>

<style></style>
