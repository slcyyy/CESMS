<template>
  <div>
    <BreadCrumbNavi>
      <template #secondPath>风险管理</template>
      <template #thirdPath>重大危险源识别和分级</template>
    </BreadCrumbNavi>
    <el-card>

    <el-tabs v-model="activeName" style="margin-top:-10px" >
    <el-tab-pane label="重大危险源辨识" name="first"  >
      <IdentifyTable v-if="showTable" ></IdentifyTable>
    </el-tab-pane>

    <el-tab-pane label="重大危险源分级" name="second">
      <Classify></Classify>  
    </el-tab-pane> 
    <el-tab-pane label="辨识/分级依据" name="third">
      <Basis></Basis>
    </el-tab-pane>
  </el-tabs>
    </el-card>
  </div>
</template>

<script>
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi'
import IdentifyTable from '@/components/riskManage/majorHazChild/identifyTable'
import Classify from  '@/components/riskManage/majorHazChild/classify'
import Basis from '@/components/riskManage/majorHazChild/basis'
export default {
 data(){
	 return{
     buttonColor1:'#66b1ff',
     buttonColor2:'#ffffff',
     showTable:true,
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
      IdentifyTable,
      Classify,
      Basis
    },
    methods: {
      switchData(){
      this.showTable= !this.showTable
      if(this.showTable){
        this.buttonColor1='#66b1ff'
        this.buttonColor2='#ffffff'
      }
      else{
        this.buttonColor1='#ffffff'
        this.buttonColor2='#66b1ff'
      }
    }
  }
}
	 
 
</script>

<style>

</style>