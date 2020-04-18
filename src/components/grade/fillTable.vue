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
        style="margin-bottom:20px;"
        clearable
      ></el-cascader>

      
      <!--级联选择框 公司-表格名 -->
      <el-divider content-position="left" ><h3>填写记录</h3></el-divider>
      <el-row style="margin-top:20px;">
        <span style="margin-right:30px;color:red;font-size:14px;">已完成:3</span>
        <span style="color:green;font-size:14px;">进行中:0</span>
      </el-row>
      <el-table :data="fillStatus" border style="width: 100%" align="center">
        <el-table-column prop="status_time" label="填写时间" width="180"></el-table-column>
        <el-table-column prop="status_companyName" label="公司名称" ></el-table-column>
        <el-table-column prop="status_tableName" label="表格名称" ></el-table-column>
        <el-table-column prop="status_sate" label="填写状态" width="180" :style="{'color':statusColor}">
          <template slot-scope="scope">
            {{computeState(scope.row.status_state)}}
          </template>
        </el-table-column>
        <el-table-column prop="oprate" label="操作" width="180">
          <template v-slot="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditForm(scope.row.user_id)"
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
        let str = ''
        if(state) str = '已提交'
        else str = '未提交'
        return str
      }
     }
  },
  methods: {
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
    async getSeletList() {
      const { data: res } = await this.$http.get('/grade/EvaTSelectData')
      if (res.meta.err == -1) return
      this.selectList = res.selectList
      console.log(this.selectList )

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