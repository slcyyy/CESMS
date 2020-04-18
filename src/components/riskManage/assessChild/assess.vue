<template>
  <div>
    <el-row :gutter="11" style="margin:10px 0 20px 0">
    
     <el-select v-model="value" placeholder="请选择工作任务" style="margin-top:10px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
 
        <el-button style="margin-left:70%" type="primary" @click="this.addProperVisible = true">添加工作任务</el-button>

    </el-row>

    <el-table
      :data="statistics"
      border
      :cell-style="cellStyle"
      :header-cell-style="rowClass"
      style="width:100%;overflow-x:auto;margin-top:20px;"
       height="380"
    >
      <el-table-column prop="hazard_step" label="主要步骤" width="150"></el-table-column>
      <el-table-column prop="hazard_name" label="危害" min-width="180"></el-table-column>
      <el-table-column prop="hazard_result" label="后果" min-width="280"></el-table-column>
      <el-table-column prop="hazard_L" label="L" width="50"></el-table-column>
      <el-table-column prop="hazard_S" label="S" width="50"></el-table-column>
       <el-table-column prop="hazard_R" label="R" width="50"></el-table-column>
      <el-table-column prop="hazard_level" label="风险等级" width="90">
      </el-table-column>
      <el-table-column prop="hazard_measure" label="现有安全措施" width="230"></el-table-column>
      <el-table-column prop="hazard_measure" label="实施期限" width="150"></el-table-column>

      <el-table-column label="操作" width="100">
        <template v-slot="scope">
          <div class="operateBox">
            <div>
              <el-tooltip content="编辑" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
               
                  style="margin-bottom:5px;"
                ></el-button>
              </el-tooltip>
            </div>
            <div>
              <el-tooltip content="删除" placement="top">
                <el-button
                  type="warning"
                  icon="el-icon-delete"
                  size="mini"
              
                ></el-button>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [{
          value: '选项1',
          label: '氯乙烯单体回收贮槽维修'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value:'',
      statistics: [
        {
          hazard_task: '氯乙烯单体回收贮槽维修',
          hazard_step: '堵盲板',
          hazard_name: '盲板不合格或部位不对',
          hazard_result: 'VCM气体外泄污染环境',
          hazard_frequency: 3,
          hazard_L:1,
          hazard_S:2,
          hazard_R:2,
          hazard_level:'轻微风险',
          hazard_measure: '用“眼镜型”盲板处理盲板作业单'
        },
         
        {
          hazard_task: '氯乙烯单体回收贮槽维修',
          hazard_step: '设备排空',
          hazard_name: 'VCM抽不净;VCM排入大气',
          hazard_result: '有毒气体污染环境',
              hazard_level:'轻微风险',
               hazard_L:1,
          hazard_S:2,
          hazard_R:2,
    
          hazard_measure:
            '抽真空0.08MPa后，打开放空管阀门，空气补充继续抽真空2小时'
        },
          {
          hazard_task: '氯乙烯单体回收贮槽维修',
          hazard_step: '初步清洗置换（现场）',
          hazard_name: '高COD冲洗水排放下水道，且排放口含大量VCM，形成爆炸性混合物',
          hazard_result: '排放水COD超标;化学爆炸',
          hazard_frequency: 3,
          hazard_L:1,
          hazard_S:3,
          hazard_R:3,
          hazard_level:'轻微风险',
          hazard_measure: '1.办理临时废水排放申请单；2.设立监护人和 警戒区域，周围严禁带入火种'
        },
        
        {
          hazard_task: 'test',
          hazard_step: '堵盲板',
          hazard_name: '盲板不合格或部位不对',
          hazard_result: 'VCM气体外泄污染环境',
          hazard_frequency: 3,
          hazard_measure: '用“眼镜型”盲板处理盲板作业单'
        },
        {
          hazard_task: 'test',
          hazard_step: '堵盲板',
          hazard_name: '盲板不合格或部位不对',
          hazard_result: 'VCM气体外泄污染环境',
          hazard_frequency: 3,
          hazard_measure: '用“眼镜型”盲板处理盲板作业单'
        }
      ],
      tableData:[],
      addProperVisible: false,
      taskOptions:[],
      addForm: {
        hazard_taskId:'',
        hazard_task: '',
        children: [
          {
            hazard_stepName: '',
            hazard_stepId:'',
            hazard_risk: '',
            hazard_res: '',
            hazard_L: '',
            hazard_S: '',
            hazard_R: '',
            hazard_measure: '',
            key: 1
          }
        ]
      },
      formLabelWidth: '80px',
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    // this.getTaskOptions()
    // this.getTableData()
  },
  
  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },

    rowClass({ row, rowIndex }) {
      return 'text-align:center'
    },
    resetForm(refname) {
      this.$nextTick(()=>{
        this.$refs[refname].resetFields();
      })
    },
    async getTableData() {
       let { data: res } = await this.$http.get('/hazard/getAssessResult', {
        params: { query: this.queryInfo.query }
      })
      if (res.meta.err == -1) this.$message.error('获取表格数据失败')
        // this.tableData = res.assessResult
        console.log(res.assessResult)
        // this.computeSpanTaskId()
    },
    computeSpanTaskId() {
      //unitIndex用于记录要把合并长度添加在这个数据出现的第一次的位置
      let oldTaskId = this.tableData[0].hazard_taskId,
        taskLength = 1,
        taskIndex = 0
      for (let i = 0; i < this.tableData.length; i++) {
        //合并存储单元
        //当与上一行的数据相同，并且不为第一行（已经默认给第一行的长度设为1），说明这一行需要合并，合并行数加一
        if (this.tableData[i].hazard_taskId == oldTaskId && i != 0) {
          taskLength++
          //当都是相同的数据已经遍历到了尾部
          if (i + 1 === this.tableData.length) {
            this.tableData[taskIndex].taskLength = taskLength
          }
        }
        //当数据与上一行的数据不相同，说明是不合并，可以为上一个需要合并的数据添加合并长度了
        else if (this.tableData[i].hazard_taskId != oldTaskId) {
          //为上一个数据出现的第一次的数据中添加需要合并的长度
          this.tableData[taskIndex].taskLength = taskLength
          //重新赋值长度，数据和记录当前这个数据的位置（这是这个数据首次出现的位置）
          taskLength = 1
          taskIndex = i
          oldTaskId = this.tableData[i].hazard_taskId
          //当是不一样的数据已经遍历到了尾部,这条不一样的数据只有一条
          if (i + 1 === this.tableData.length) {
            //为这一个数据赋值合并的长度
            this.tableData[i].taskLength = taskLength
            return
          }
        }
      }
    },
 
    showEditForm(index) {},
    deleteUser(index) {
      console.log(index)
    },
    removeDomain(child) {
      var index = this.addForm.children.indexOf(child)
      if (index !== -1) {
        this.addForm.children.splice(index, 1)
      }
    },
    addDomain(type) {
     if (type === 'add') {
        this.addForm.children.push({
           hazard_stepId:'',
           hazard_stepName: '',
           hazard_risk: '',
           hazard_res: '',
           hazard_L: '',
           hazard_S: '',
           hazard_R: '',
           hazard_measure: '',
        })
      } 
      else{
        this.editForm.children.push({
           hazard_stepId:'',
           hazard_stepName: '',
           hazard_risk: '',
           hazard_res: '',
           hazard_L: '',
           hazard_S: '',
           hazard_R: '',
           hazard_measure: '',
        })
      }
    },
     async getTaskOptions(){
      let { data: res } = await this.$http.get('/hazard/getTaskOptions')
      if (res.meta.err == -1) this.$message.error('获取数据失败')
      this.taskOptions = res.taskOptions
    },
    async addData(){
      //计算R
      this.addForm.children.forEach(item=>{
        item.hazard_R = item.hazard_L * item.hazard_S
      })
      //判断是不是新的作业活动，是的话要在task数据库中插入数据
      var index=-1
      for(let i=0;i<this.taskOptions.length;i++){
        if(this.addForm.hazard_task == this.taskOptions[i].hazard_task){
          this.addForm.hazard_taskId = this.taskOptions[i].hazard_taskId
          index = 0
          break;
        }
      }
      if(index==-1){
        //设置taskID
        this.addForm.hazard_taskId = this.taskOptions.length+1        
        var { data: res } = await this.$http.post('/hazard/addTask', {
          addForm: this.addForm,type:'new'
        })
      }
      else{
        var { data: res } = await this.$http.post('/hazard/addTask', {
          addForm: this.addForm,type:'old'
        })
      }
      if (res.meta.err == -1) this.$message.error('提交数据失败')
      this.$message.success('提交数据成功')
      this.resetForm('addFormRef')
      this.addProperVisible = false
    }
  }
}
</script>


<style>
.operateBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.icon {
  font-size: 16px;
  margin-left: 15px;
}
.icon:hover {
  color: #66b1ff;
}
</style>
