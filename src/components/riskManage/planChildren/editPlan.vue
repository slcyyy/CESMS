<template>
  <div>
   <el-card>
    <el-page-header @back="goBack" content="安全模板1">
    </el-page-header>
   </el-card>
  
	<el-card class="box-card" style="margin-bottom:20px">
     <el-row style="text-align:left;margin:10px 0 20px 0">
      <el-button type="success" style="margin-right:10px" @click="submitPlan">提交</el-button>
        <el-button type="primary" style="margin-right:10px" @click="editPlan">编辑</el-button>
			 <el-button type="warning"  style="margin-right:10px" @click="resetPlan">重置</el-button>
    </el-row>
     
		  <div class="box-card">
          <input v-model="planData.plan_title" :disabled="isEdit" style="font-size:30px; border-bottom: 1px solid #F5F5FE;margin-bottom:20px" class="noBorderInput" type="text" placeholder="请输入自定义安全计划表的标题"  />
      </div>

		  <div class="box-card"  v-for="(table,index1) in planData.children" :key="index1">
         <div slot="header" class="clearfix tableTitle">
          <span>{{table.plan_tableName}}</span>
          <el-button style="float: right; padding: 3px 0;border:none" type="text" @click="changeDrawer=true"><i class="el-icon-more" style="color:#F5F5FE"></i></el-button>
        </div> 
          <el-table border style="width: 100%" :data="tableData" class="planTable">
            <template v-for="(col,index2) in table.plan_header">
              <el-table-column :label="col" :key="index2" prop="col"></el-table-column>
            </template>
          </el-table>
       </div>
	</el-card>
    
  </div>
</template>

<script>
export default {
  data(){
		return{
			planData:{},
			tableData:[{col:''}],
			isEdit:true,
		}
	},
	created(){
		this.getTable()
	},
	methods: {
    async getTable(){
      this.planData.plan_id=this.$route.query.planId
      this.planData.plan_title=this.$route.query.planTitle
       this.planData.children=[]
      let { data: res } = await this.$http.get('/plans/getPlanById',{params:{tableId:this.$route.query.tables}})
			if (res.meta.err == -1) this.$message.error('获取数据失败')
			res.table.forEach(element => {
				element.plan_header=element.plan_header.split('|')
				this.planData.children.push(element)
			})
	
			console.log(this.planData)
		},
		submitPlan(){},
		resetPlan(){},
		editPlan(){
			this.isEdit=!this.isEdit
		},
      goBack() {
        console.log(this.$route.query)
        this.$router.go(-1)
      }
    }
}
</script>

<style>
.noBorderInput {
  border: none;
  outline: medium;
  border-bottom: 1px solid #F5F5FE;
  width:100%;
  text-align: center;
  
}
.drawer-select{
  width:80%;
  border:none;
}
.addBox{
  display: flex;
  flex-wrap:wrap;
  justify-content: center;

}

 .clearfix:before,.clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .tableTitle{
    text-align:left
  }

  /* .planTable th{
    padding: 10px 0 !important
  } */

  .planTable td{
    padding:30px 0 !important
  }



</style>