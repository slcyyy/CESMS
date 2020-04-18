<template>
  <div>
        <BreadCrumbNavi>
      <template #secondPath>风险管理</template>
      <template #thirdPath>JHA风险评估</template>
    </BreadCrumbNavi>
        <el-card>
    <el-tabs v-model="activeName" style="margin-bottom:10px;">
      <el-tab-pane label="风险评估结果" name="first">
          <Assess></Assess>
      </el-tab-pane>
      <el-tab-pane label="评估依据" name="second">
        <Basis></Basis>
      </el-tab-pane>
    </el-tabs>
        </el-card>
  </div>
</template>

<script>
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi'
import Assess from '@/components/riskManage/assessChild/assess'
import Export from '@/components/riskManage/assessChild/export'
import Basis from '@/components/riskManage/assessChild/basis'
export default {
  data() {
    return {
      activeName: 'first',
      showExport:false
    }
  },

  components:{
    BreadCrumbNavi,
    // Result,
    Assess,
    Export,
    Basis
  },

}
</script>

<style></style>
