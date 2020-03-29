<template>
  <div>
    <BreadCrumbNavi>
      <template #secondPath>风险管理</template>
      <template #thirdPath>重大危险源识别和分级</template>
    </BreadCrumbNavi>
    <el-tabs v-model="activeName">
    <el-tab-pane label="重大危险源辨识结果" name="first">
      <Identify></Identify>
    </el-tab-pane>
    <el-tab-pane label="重大危险源分级" name="second">
      <Classify></Classify>  
    </el-tab-pane> 
    <el-tab-pane label="辨识/分级依据" name="third">
      <Basis></Basis>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi'
import Identify from '@/components/riskManage/majorHazChild/identify'
import Classify from  '@/components/riskManage/majorHazChild/classify'
import Basis from '@/components/riskManage/majorHazChild/basis'
export default {
 data(){
	 return{
     activeName: 'first',
		  tableData: [{
          id: '12987122',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        }, {
          id: '12987123',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12
        }, {
          id: '12987124',
          name: '王小虎',
          amount1: '324',
          amount2: '1.9',
          amount3: 9
        }, {
          id: '12987125',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17
        }, {
          id: '12987126',
          name: '王小虎',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        }]
      };
    },
    components:{
      BreadCrumbNavi,
      Identify,
      Classify,
      Basis
    },
    methods: {
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (rowIndex % 2 === 0) {
          if (columnIndex === 0) {
            return [1, 2];
          } else if (columnIndex === 1) {
            return [0, 0];
          }
        }
      },

      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
    }
  }
	 
 
</script>

<style>

</style>