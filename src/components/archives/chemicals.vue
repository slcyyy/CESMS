<template>
  <div>
    <BreadCrumbNavi>
       <template #secondPath>危险化学品管理</template>
       <template #thirdPath>化学品特性</template>
    </BreadCrumbNavi>
    <el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top:-10px">
      <el-tab-pane label="化学品特性" name="first" > 
            <Property></Property>
      </el-tab-pane>
      <el-tab-pane label="化学品管理" name="second">
            <Manage></Manage>
      </el-tab-pane>
    </el-tabs>
     </el-card>
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
