<template>
  <div>
    <el-row :gutter="11" style="margin:10px 0 20px 0">
      <el-col :span="7">
        <el-input
          placeholder="请输入工作任务的全称或关键字"
          class="input-with-select"
          clearable
          @clear="getTableData"
          v-model="queryInfo.query"
        >
          <el-button slot="append" icon="el-icon-search" @click="getTableData"></el-button>
        </el-input>
      </el-col>
      <el-col :span="7" :offset="1">
        <el-button type="primary" @click="this.addProperVisible = true">添加数据</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="tableData"
      :span-method="arraySpanMethod"
      border
      :cell-style="cellStyle"
      :header-cell-style="rowClass"
      style="width:100%"
    >
      <el-table-column label="工作任务" min-width="60%">
        <template v-slot="scope">{{taskName(scope.$index)}}</template> 
      </el-table-column>
      <el-table-column prop="hazard_stepName" label="工作步骤"></el-table-column>
      <el-table-column prop="hazard_risk" label="危害"></el-table-column>
      <el-table-column prop="hazard_res" label="主要后果" max-width="180"></el-table-column>
      <el-table-column prop="hazard_L" label="L" min-width="35%"></el-table-column>
      <el-table-column prop="hazard_S" label="S" min-width="35%"></el-table-column>
      <el-table-column prop="hazard_R" label="R" min-width="35%"></el-table-column>
      <el-table-column  label="风险等级" min-width="40%">
        <template v-slot="scope">{{hazardLevel(scope.$index)}}</template> 
      </el-table-column>
      <el-table-column prop="hazard_measure" label="现有安全措施"></el-table-column>

      <el-table-column label="操作" min-width="50%">
        <template v-slot="scope">
          <div class="operateBox">
            <div>
              <el-tooltip content="编辑" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditForm(scope.row.hazard_task)"
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
                  @click="deleteUser(scope.row.hazard_task)"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加数据对话框 -->
    <el-dialog title="添加任务" :visible.sync="addProperVisible" width="95%">
      <el-form ref="addFormRef" :model="addForm" :label-width="formLabelWidth" style="text-align:left;">
        <el-tag type="warning" style="width:100%;">
          <i class="el-icon-warning" style="font-size:16px;"></i> 可以选择下拉框中的所选项，也可以自定义输入创建
        </el-tag>

        <el-form-item label="工作" >
          <el-select v-model="addForm.hazard_task" filterable allow-create placeholder="请选择工作标签">
            <el-option
              v-for="item in taskOptions"
              :key="item.hazard_taskId"
              :label="item.hazard_task"
              :value="item.hazard_task"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-divider content-position="right" style="font-size:13px;">该工作中各步骤的危害信息</el-divider>
        <el-form-item
          v-for="(child,index) in addForm.children"
          :key="child.key"
          :label="'危害信息'+(index+1)"
        >
          <div style="width:100%;display:flex;justify-content:center;wrap:wrap">
            <el-input v-model="child.hazard_stepName" placeholder="步骤" style="width:20%"></el-input>
            <span style="margin:0 1%">-</span>
            <el-input v-model="child.hazard_risk" placeholder="危害" style="width:30%"></el-input>
            <span style="margin:0 1%">-</span>
            <el-input v-model="child.hazard_res" placeholder="主要后果" style="width:30%"></el-input>
            <span style="margin:0 1%">-</span>
            <el-input v-model="child.hazard_L" placeholder="L" style="width:8%"></el-input>
            <span style="margin:0 1%">-</span>
            <el-input v-model="child.hazard_S" placeholder="S" style="width:8%"></el-input>
            <span style="margin:0 1%">-</span>
            <el-input v-model="child.hazard_measure " placeholder="现有控制措施（没有则填无）" style="width:30%"></el-input>
            <span class="icon" style="color:red">
              <i class="el-icon-remove-outline" @click="removeDomain(child)"></i>
            </span>
          </div>
        </el-form-item>
        <el-form-item style="text-align:center" >
        <p class="icon" @click="addDomain('add')">
          <i class="el-icon-circle-plus-outline">添加工作步骤信息</i>
        </p>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addFormRef');addProperVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      statistics: [
        {
          hazard_task: '氯乙烯单体回收贮槽维修',
          hazard_step: '设备排空',
          hazard_name: 'VCM抽不净;VCM排入大气',
          hazard_result: '有毒气体污染环境',
          hazard_frequency: 2,
          hazard_measure:
            '抽真空0.08MPa后，打开放空管阀门，空气补充继续抽真空2小时'
        },
        {
          hazard_task: '氯乙烯单体回收贮槽维修',
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
    this.getTaskOptions()
    this.getTableData()
  },
  computed:{
    taskName(){
      return function(i){
        var task='cc'
        for(let j=0;j<this.taskOptions.length;j++){
          if(this.tableData[i].hazard_taskId == this.taskOptions[j].hazard_taskId){
            task = this.taskOptions[j].hazard_task
            break;
          }
        }
        return task
      }  
    },
    hazardLevel(){
      return function(i){
        let R = this.tableData[i].hazard_R
        let level=''
        switch(true){
          case R<4:
            level="轻微风险"
            break
          case R>4&&R<9:
            level="可接受风险"
            break
        }
        return level
      }
    }
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
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 9) {
        if (row.taskLength) {
          return [row.taskLength, 1]
        } 
        else return [0, 0]
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
          key: Date.now()
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
          key: Date.now()
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
