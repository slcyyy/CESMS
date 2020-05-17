<template>
  <div  style="text-align:center">
	<el-card class="box-card" style="margin-bottom:20px">
     <el-row style="text-align:left;margin:10px 0 20px 0">
      <el-button type="success" style="margin-right:10px" @click="savePlan">提交</el-button>
        <el-button type="primary" style="margin-right:10px" @click="exportPlan">导出EXCEL</el-button>
    </el-row>
     
		  <div class="box-card">
          <input v-model="planData.plan_title" style="font-size:30px; border-bottom: 1px solid #F5F5FE;margin-bottom:20px" class="noBorderInput" type="text" placeholder="请输入自定义安全计划表的标题"  />
      </div>

		  <!-- 计划表 " -->
       <el-card class="box-card"  v-for="(table,index1) in planData.children" :key="index1">
         <div slot="header" class="clearfix tableTitle" >
          <span>{{table.tableName}}</span>
           <el-button style="float: right; padding: 3px 10px" type="text" @click="deleteTable(index1)"> 
            <i class="el-icon-delete" style="font-size:19px;color:red"></i>
          </el-button>
          <el-button style="float: right; padding: 3px 10px" type="text" @click="showEditDialog(table,index1)">
             <i class="el-icon-edit" style="font-size:19px;"></i>
          </el-button>
        </div> 
          <el-table  border style="width: 100%" :data="tableData" class="planTable" :id="'table'+index1">
            <template v-for="(col,index2) in table.header">
              <el-table-column :label="col" :key="index2" prop="col"></el-table-column>
            </template>
          </el-table>
       </el-card>

      <!-- 添加表格按钮 -->
      <el-button style="margin:15px 0" size="medium" round @click="addDialogVisible=true">
         <i class="el-icon-circle-plus" style="color: #66b1ff;" >添加表格</i>
      </el-button>

 <!-- 添加自定义计划表弹框 -->
    <el-dialog title="新建考核表" :visible.sync="addDialogVisible" width="70%">
      <el-form ref="addFormRef" :model="addForm" label-width="80px" style="text-align:left;">
        <el-tag type="warning">
          <i class="el-icon-warning"></i> 可以选择下拉框中提供的选项，也可以自定义输入创建标签
        </el-tag>
        <el-form-item label="标题" style="font-size:16px">
          <el-select v-model="value" 
          filterable
          allow-create 
          clearable
          placeholder="请选择计划表标题"
          @change="getHeader"
          >
            <el-option
              v-for="item in options"
              :key="item.tableName"
              :label="item.tableName"
              :value="item.tableName+'$'+item.header">
              </el-option>
          </el-select>
        </el-form-item>
       <el-form-item label="表头" >
          <el-input v-model="addForm.header" placeholder="请输入表头(以|分隔)"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" >
        <el-button @click="addDialogVisible = false;resetForm('addFormRef')">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </span>
    </el-dialog>

<!-- 修改考核表-->
    <el-dialog title="修改考核表" :visible.sync="editDialogVisible" width="70%">
      <el-form ref="editFormRef" :model="editForm" label-width="80px" style="text-align:left;">
        <el-form-item label="考核表名" >
          <el-input v-model="editForm.tableName"  ></el-input>
        </el-form-item>
       <el-form-item label="表头" >
          <el-input v-model="editForm.header" placeholder="请输入表头(以|分隔)" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" >
        <el-button @click="addDialogVisible = false;resetForm('editFormRef')">取 消</el-button>
        <el-button type="primary" @click="editData">确 定</el-button>
      </span>
    </el-dialog>
   


	</el-card>
    
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  data(){
		return{
			planData:{},
			tableData:[{col:''}],
      editDialogVisible:false,
      addDialogVisible: false,
      addForm:{
         tableName:'',
         header:'' 
      },
      editForm:{
         tableName:'',
         header:'' 
      },
      editIndex:'', //当前编辑的表格下标
      value:'',
        options:[
         {
            tableName: '人员培训教育',
            header:'序号/培训项目|部门|培训计划-项目|培训计划-时间|培训计划-内容|考核结果'
          },
           {
            tableName: '设备维修',
            header:'序号/维修项目|部门|维修计划-项目|维修计划-时间|维修计划-内容|考核结果'
           }
      ],
      myPlan:[]
		}
	},
	created(){
		this.getTable()
	},
	methods: {
    async getTable(){
      this.planData.plan_title=this.$route.query.planTitle
      this.planData.tables = window.sessionStorage.getItem('tables')
      this.planData.children=[]
      let tables = this.planData.tables.split('&&')
      for(let i=0;i<tables.length-1;i++){
        let temp=tables[i].split(',')
        let form={}
        form.tableName=temp[0]
        form.header = temp[1].split('|')
        this.planData.children.push(form)
      }
     console.log(this.planData)
		},
		 resetPlan(){
      this.planData.plan_title=''
      this.planData.children.splice(0,this.planData.children.length)
    },
    resetForm(refname) {
      this.$refs[refname].resetFields()
    },
    showEditDialog(info,index){
      this.editIndex=index
      this.editForm.tableName = info.tableName
      let str=info.header.join('|')
      this.editForm.header =str
      this.editDialogVisible=true
    },
    //获取表头数据
    getHeader(){
      //清空addForm
       let res = this.value.split('$')
       this.addForm.tableName =  res[0]
       this.addForm.header = res[1]
    },
    addData(){
      //存入的时候要以数组存入，因为这样才可以通过循环遍历得到
      let header = this.addForm.header.split('|')
      this.planData.children.push({tableName:this.addForm.tableName,header:header})
      this.resetForm('addFormRef')
      this.addDialogVisible = false
    },
    editData(){
      this.planData.children[this.editIndex].tableName = this.editForm.tableName
      let arr = this.editForm.header.split('|')
      this.planData.children[this.editIndex].header = arr
      this.editDialogVisible=false
    },
    deleteTable(index){
      this.planData.children.splice(index,1)
    },
    async getPlan(){
      let userId = window.sessionStorage.getItem('userId')
      let { data: res } = await this.$http.get('/plans/getPlan', {params:{userId}})
      if (res.meta.err == -1) this.$message.error('获取我的计划表列表失败')
      this.myPlan = res.plans
    },
    async savePlan(){
      for(let i=0;i<this.myPlan.length;i++){
        if(this.planData.plan_title==this.myPlan[i].plan_title){
          return this.$message.error('安全计划表名重复！（请修改计划表名）')
        }
      }
      if(this.planData.plan_title=='')
         return this.$message.error('请填写标题')
      if(this.planData.children==0)
        return this.$message.error('请添加考核表')
      let userId = window.sessionStorage.getItem('userId')
      let { data: res } = await this.$http.post('/plans/addPlan', {planData:this.planData,userId})
      if (res.meta.err == -1) return this.$message.error('保存数据失败')
      this.$message.success('保存成功')
      this.resetPlan()
    },
    exportPlan(){
      // 创建工作蒲
      let workbook = XLSX.utils.book_new();
       // 根据table的id创建sheet页，并将sheet添加到工作蒲中
      for(let i=0;i<this.planData.children.length;i++){
        let tableSheet = XLSX.utils.table_to_sheet(document.querySelector('#table'+i));
        // 生成sheet页的名称
        XLSX.utils.book_append_sheet(workbook, tableSheet,this.planData.children[i]['tableName']);
      }
       // 创建输出对象，excel后缀为xlsx
      let wbOut = XLSX.write(workbook, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      });
      try {
        // 通过window以流的方式导出工作蒲输出对象
        window.saveAs(
          new Blob([wbOut], { type: 'application/octet-stream' }), this.planData.plan_title+'.xlsx'
        );
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbOut);
      }

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