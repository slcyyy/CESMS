<template>
  <div>
    <el-tabs v-model="activeName" style="margin-bottom:10px;">
      <el-tab-pane label="评估结果" name="first">
         <!-- <result></result> -->
      </el-tab-pane>
      <el-tab-pane label="风险统计" name="second">
         <Statistics></Statistics>
      </el-tab-pane>
      <el-tab-pane label="风险统计" name="third">

      </el-tab-pane>
      <el-tab-pane label="评价依据" name="fourth">
        <Basis></Basis>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import Result from '@/components/hazardAssess/assessResult'
import Statistics from '@/components/riskManage/assessChild/statistics'
import Basis from '@/components/riskManage/assessChild/basis'
export default {
  data() {
    return {
      activeName: 'first'
    }
  },

  components:{
    Result,
    Statistics,
    Basis
  }
}
</script>

<style></style>
