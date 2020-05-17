<template>
  <div>
     <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>企业评分</el-breadcrumb-item>
      <el-breadcrumb-item>填写评分表</el-breadcrumb-item>
    </el-breadcrumb>
        <el-card class ="box-card">
    <el-tag style="width:100%"><i class="el-icon-warning-outline"></i>请选择公司-表格填写企业评分表</el-tag>
    <el-cascader
        ref="selectTable"
        v-model="selectedTableId"
        :options="selectList"
        :props="{ expandTrigger: 'hover' ,value:'id'}"
        @change="handleChange"
        style="margin-bottom:20px;width:300px;"
        clearable
      ></el-cascader>

      
      <!--级联选择框 公司-表格名 -->
      <el-divider content-position="left" ><h3>填写记录</h3></el-divider>
      <el-row style="margin-top:20px;font-size:14px;">
        <span style="margin-right:30px;color:red;">已完成:{{submitNum}}</span>
        <span style="color:green;">进行中:{{temporyNum}}</span>
         <el-tooltip content="刷新" placement="top">
        <el-button round type="warning" style="margin-left:83%;margin-top:-10px;font-size:16px;" @click="getFillRecord"><i class="el-icon-refresh"></i></el-button>
         </el-tooltip>
      </el-row>
      <el-table :data="fillStatus" border style="width: 100%"  :cell-style="cellStyle"
        :header-cell-style="rowClass" height="280">
        <el-table-column prop="status_time" label="填写时间" width="180"></el-table-column>
        <el-table-column  label="公司名称" >
          <template v-slot="scope">
            {{companyName(scope.row.status_companyId)}}
          </template>
        </el-table-column>
        <el-table-column prop="status_tableName" label="表格名称" ></el-table-column>
        <el-table-column prop="status_sate" label="填写状态" width="180" :style="{'color':statusColor}">
          <template slot-scope="scope">
            {{computeState(scope.row.status_state)}}
          </template>
        </el-table-column>
        <el-table-column prop="oprate" label="操作" width="180">
          <template v-slot="scope">
            <el-tooltip content="查看评分表" placement="top">
              <el-button
                type="success"
                icon="el-icon-view"
                size="mini"
                @click="showChecklist(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
  <!-- //指定选项的值为选项对象的某个属性值 -->
</template>

<script>
export default {
  data() {
    return {
      //选择的每一级id信息
      selectedTableId: [],
      selectList: [],
      filledTableList: [],
      fill_userId:window.sessionStorage.getItem('userId'),
      fillStatus:[],
      statusColor:"red",
      submitted:0,
      unsubmitted:0
    }
  },
  created() {
    this.getSeletList()
    this.getFillRecord()
  },
  computed:{
     computeState(){
      return function(state){
        if(state==1){
          return '已完成'   
        }
        else
          return '进行中'
      }
     },
     companyName(){
       return function(status_companyId){
        let companyName=''
        for(let i=0;i<this.selectList.length;i++){
          if(this.selectList[i].id == status_companyId){
            companyName = this.selectList[i].label
            break
          }
        }
        return companyName
      }
    },
    submitNum(){
      let num=0
      for(let i=0;i<this.fillStatus.length;i++){
        if(this.fillStatus[i].status_state==1)
         num++
      }
      return num
    },
    temporyNum(){
      let num=0
      for(let i=0;i<this.fillStatus.length;i++){
        if(this.fillStatus[i].status_state==0)
         num++
      }
      return num
    }

     
  },
  methods: {
     cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },
    rowClass({ row, rowIndex }) {
      return 'text-align:center'
    },
    handleChange() {
      const obj = this.$refs.selectTable.getCheckedNodes()
      let routeUrl = this.$router.resolve({
        path: '/checklist',
        query: {
          company: this.selectedTableId[0] + ',' + obj[0].parent.label,
          table: this.selectedTableId[1] + ',' + obj[0].label
        }
      })
      window.open(routeUrl.href, '_blank')
    },
    showChecklist(info){
      let companyName=''
       for(let i=0;i<this.selectList.length;i++){
          if(this.selectList[i].id == info.status_companyId){
            companyName = this.selectList[i].label
            break
         }
       }
      let routeUrl = this.$router.resolve({
        path: '/checklist',
        query: {
          company: info.status_companyId+ ',' + companyName,
          table: info.status_tableName.split(' ')[0] + ',' + info.status_tableName
        }
      })
      window.open(routeUrl.href, '_blank')
    },
    async getSeletList() {
      const { data: res } = await this.$http.get('/grade/EvaTSelectData')
      if (res.meta.err == -1) return
      this.selectList = res.selectList
      console.log(this.selectList)
    },
    //获取用户的填写记录
    async getFillRecord(){
      const {data:res} = await this.$http.get('/grade/getFillRecord',{params:{fill_userId:this.fill_userId}})
      if (res.meta.err == -1) return this.$message.error('获取该填表人填写记录失败')
      this.fillStatus = res.fillStatus
    }
  }
}
</script>

<style>
</style>