<template>
  <div style="text-align:center">
    <!-- 输入安全计划表标题 -->
    <el-row style="text-align:left;margin:10px 0 20px 0">
      <el-button type="success" style="margin-right:10px" @click="handleDownload">提交</el-button>
       <el-button type="warning" @click="resetPlan">重置</el-button>
    </el-row>
      <el-card class="box-card">
        
        <div>
          <input v-model="planData.planTitle" style="font-size:30px; border-bottom: 1px solid #F5F5FE;margin-bottom:20px" class="noBorderInput" type="text" placeholder="请输入自定义安全计划表的标题" required />
        </div>
        <div>
          <input v-model="planData.description"  style="font-size:16px;" class="noBorderInput" type="text" placeholder="请输入详细说明" />
        </div>
      </el-card>
     
    
       <!-- 计划表 " -->
       <el-card class="box-card"  v-for="(table,index1) in planData.children" :key="index1">
         <div slot="header" class="clearfix tableTitle">
          <span>{{table.tableName}}</span>
          <el-button style="float: right; padding: 3px 0;border:none" type="text" @click="changeDrawer=true"><i class="el-icon-more" style="color:#F5F5FE"></i></el-button>
        </div> 
          <el-table  border style="width: 100%" :data="tableData" class="planTable">
            <template v-for="(col,index2) in table.header">
              <el-table-column :label="col" :key="index2" prop="col"></el-table-column>
            </template>
          </el-table>
       </el-card>
  

      <!-- 添加表格按钮 -->
      <el-button style="margin:15px 0" size="medium" round @click="showAddDialog">
         <i class="el-icon-circle-plus" style="color: #66b1ff;" >添加表格</i>
      </el-button>
     
    <!-- 添加自定义计划表弹框 -->
    <el-dialog title="新建计划表" :visible.sync="addDialogVisible" width="70%">
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
               <el-option-group
                v-for="group in options"
                :key="group.label"
                :label="group.label">
             
          <el-option
          v-for="item in group.options"
          :key="item.tableName"
          :label="item.tableName"
          :value="item.tableName+'|'+item.header">
          </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
       <el-form-item label="表头" >
          <el-input v-model="addForm.header" placeholder="请输入表头(以/分隔)" :disabled="headerDisabled"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" >
        <el-button @click="addDialogVisible = false;resetForm('addFormRef')">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </span>
    </el-dialog>

   



    </div>
</template>

<script>
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi'
// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'


import { parseTime } from "@/utils/setMethods"
import { json2excel } from "@/utils/setMethods"

export default {
  data() {
    return {
      planData:{
        planId:1,
        planTitle:'',
        description:'',
        children:[
         {
          tableId:1,
          tableName:'人员培训教育',
          header:['序号','部门','培训计划-项目','培训计划-时间','培训计划-内容','考核结果']
         }
        ],
      },
      tableData:[
        {
         col:''
        }
      ],
      addDialogVisible: false,
      totalTable:0, //目前这个计划表内已经创建的表格
      addForm:{
         tableId:1,
         tableName:'',
         header:'' 
      },
      headerDisabled:false,
      value:'',
      changeDrawer:false,
      addPlanDrawer:false,
      options:[
        {
          label: '默认模板',
          options: [{
            tableName: '人员培训教育',
            header:'xxxx/yyyy/ccccc'
          }, {
            tableName: '设备维修',
            header:''
          }]
        }, {
          label: '我的模板',
          options: [{
            header: '',
            tableName: '成都'
          }, {
            header: 'Shenzhen',
            tableName: '深圳'
          }]
      }],
      list: [
        {
          "id": 1,
          "timestamp": 375676396994,
          "author": "Melissa",
          "reviewer": "Angela",
          "title": "Gxjxpr Jdfjwf Lxssr Deyonm Moxy Ryxhzp Gxtukv Bvnmvmlo",
          "content_short": "mock data",
          "forecast": 29.75,
          "importance": 2,
          "type": "EU",
          "status": "published",
          "display_time": "1998-10-24 01:53:18",
          "comment_disabled": true,
          "pageviews": 1670,
          "image_uri": "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          "platforms": [
            "a-platform"
          ]
        },
        {
          "id": 2,
          "timestamp": 14742538820,
          "author": "Anthony",
          "reviewer": "Angela",
          "title": "Ueeislixa Heid Dvcspjcuw Rrjyqi Wsqgyjsw",
          "content_short": "mock data",
          "forecast": 22.76,
          "importance": 2,
          "type": "JP",
          "status": "published",
          "display_time": "1990-03-21 05:30:52",
          "comment_disabled": true,
          "pageviews": 328,
          "image_uri": "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          "platforms": [
            "a-platform"
          ]
        }]
      
    }
  },
  created(){
    console.log('hahah')
  },
  components: {
    BreadCrumbNavi,
  },
  methods:{
    computePlanId(){
      //在我的模板哪里就要活得所有的模板数据，用vuex的state获取所有模板的数据
       //得到数据综合
       //planid就为数据综合加1
    },
    resetPlan(){
      this.planData.planTitle=''
      this.planData.description = ''
      this.planData.children=[]
    },
    resetForm(refname) {
      this.$refs[refname].resetFields()
    },
    showAddDialog(){
      this.addDialogVisible=true
    },
    //获取表头数据
    getHeader(){
       let res = this.value.split('|')
       this.addForm.tableName =  res[0]
       this.addForm.header = res[1]
       if(this.addForm.header=='')
        this.headerDisabled = false
       else
         //非空表格元素不可编辑
         this.headerDisabled = true
    },
    addData(){
      let header = this.addForm.header.split('/')
      this.addForm.tableId=this.planData.children.length+1
      this.planData.children.push({tableName:this.addForm.title,header:header})
      this.resetForm('addFormRef')
      this.addDialogVisible = false
    },
 handleDownload () {
        //注意：组装的导出excel所需要的数据结构
      var excelDatas = [
        {
          tHeader: ["Id", "Title", "Author", "Readings", "Date"], // sheet表一头部
          filterVal: ["id", "title", "author", "pageviews", "display_time"], // 表一的数据字段
          tableDatas: this.list, // 表一的整体json数据
          sheetName: "sheet1"// 表一的sheet名字
        },
        {
          tHeader: ["序号", "标题", "作者", "服务"],
          filterVal: ["id", "title", "author", "reviewer"],
          tableDatas: this.list,
          sheetName: "sheet2"
        },
        {
          tHeader: ["序号", "名字", "描述"],
          filterVal: ["userId", "userName", "userDescription"],
          tableDatas: this.rolesList,
          sheetName: "sheet5555"
        }
      ]
        //   引入的函数
      json2excel(excelDatas, "数据报表", true, "xlsx")
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