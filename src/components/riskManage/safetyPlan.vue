<template>
  <div>
    <BreadCrumbNavi>
      <template #secondPath>风险管理</template>
      <template #thirdPath>自定义安全计划表</template>
    </BreadCrumbNavi>
  <el-card style="padding-bottom:60px;">
    <el-tabs v-model="activeName">
    <el-tab-pane label="查看我的模板" name="first">
       <MyPlan></MyPlan>
    </el-tab-pane>
    <el-tab-pane label="创建计划表" name="second">  
       <CreatePlan></CreatePlan>
    </el-tab-pane> 
  </el-tabs>
    </el-card>
    </div>
  
</template>

<script>
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi'
import MyPlan from '@/components/riskManage/planChildren/myPlan'
import CreatePlan from '@/components/riskManage/planChildren/createPlan'
export default {
  data() {
    return {
      activeName: 'first'
    }
  },
  components: {
    BreadCrumbNavi,
    MyPlan,
    CreatePlan
    
  },
}
</script>

<style>
</style>