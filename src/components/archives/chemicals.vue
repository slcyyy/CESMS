<template>
  <div>
    <BreadCrumbNavi>
       <template #secondPath>危险化学品管理</template>
       <template #thirdPath>化学品特性</template>
    </BreadCrumbNavi>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="化学品特性" name="first"> 
          <el-card class="box-card">
            <Property></Property>
          </el-card>
      </el-tab-pane>
      <el-tab-pane label="化学品管理" name="second">
         <el-card class="box-card">
            <Manage></Manage>
          </el-card>
      </el-tab-pane>
      <el-tab-pane label="接触记录" name="third">接触记录</el-tab-pane>
      <el-tab-pane label="运输记录" name="fourth">运输记录</el-tab-pane>
      <el-tab-pane label="出入库记录" name="five">出入库记录</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi.vue'
import Property from '@/components/archives/chemiChildren/chemiProperty.vue'
import Manage from '@/components/archives/chemiChildren/chemiManage.vue'
export default {
  data() {
    return {
      //tabs卡片默认激活
      activeName: 'first',
      tableData: []
    }
  },
  components:{
    BreadCrumbNavi,
    Property,
    Manage
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    EditRow() {},
    deleteRow() {}
  }
}
</script>

<style></style>
