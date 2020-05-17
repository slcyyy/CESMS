<template>
  <div>
    <el-row :gutter="11" style="margin:0px 0 20px 0">
      <el-select v-model="query" @change="getTableData" placeholder="请选择工作任务">
        <el-option
          v-for="(item,index) in task"
          :key="index"
          :label="item.hazard_task"
          :value="item.hazard_taskId"
        ></el-option>
      </el-select>

      <el-button style="margin-left:20px" type="primary" @click="addProperVisible = true">添加工作任务</el-button>
    </el-row>

      <el-table
        :data="tableData"
        border
        :cell-style="cellStyle"
        :header-cell-style="rowClass"
        style="width:100%;overflow-x:auto;margin-top:10px;"
        height="360"
      >
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="hazard_stepName" label="主要步骤" width="150"></el-table-column>
        <el-table-column prop="hazard_risk" label="危害" min-width="180"></el-table-column>
        <el-table-column prop="hazard_res" label="后果" min-width="280"></el-table-column>
         <el-table-column prop="hazard_frequency" label="频率" width="100"></el-table-column>
        <el-table-column prop="hazard_L" label="L" width="50"></el-table-column>
        <el-table-column prop="hazard_S" label="S" width="50"></el-table-column>
        <el-table-column prop="hazard_R" label="R" width="50"></el-table-column>
        <el-table-column label="风险等级" width="90">
          <template v-slot="scope">{{computeLevel(scope.row.hazard_R)}}</template>
        </el-table-column>
        <el-table-column prop="hazard_measure" label="现有安全措施" width="230"></el-table-column>
        <el-table-column label="实施期限" width="150">
          <template v-slot="scope">{{computeAction(scope.row.hazard_R)}}</template>
        </el-table-column>
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
                    @click="showEditForm(scope.$index)"
                  ></el-button>
                </el-tooltip>
              </div>
              <div>
                <el-tooltip content="删除" placement="top">
                  <el-button type="warning"  @click="deleteOne(scope.$index)" icon="el-icon-delete" size="mini"></el-button>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

    <!-- 添加数据对话框 -->
    <el-dialog title="添加任务" :visible.sync="addProperVisible" width="95%">
      <el-form
        ref="addFormRef"
        :model="addForm"
        :label-width="formLabelWidth"
        style="text-align:left;"
      >
        <el-tag type="warning" style="width:100%;">
          <i class="el-icon-warning" style="font-size:16px;"></i> 可以选择下拉框中的所选项，也可以自定义输入创建
        </el-tag>

        <el-form-item label="工作">
          <el-select v-model="addForm.hazard_taskId" filterable allow-create placeholder="请选择工作标签">
            <el-option
              v-for="item in task"
              :key="item.hazard_taskId"
              :label="item.hazard_task"
              :value="item.hazard_taskId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-divider content-position="right" style="font-size:13px;">该工作中各步骤的危害信息</el-divider>
        <el-form-item
          v-for="(child,index) in addForm.children"
          :key="child.key"
          :label="'危害信息'+(index+1)"
        >
          <el-row>
            <el-input
              v-model.number="child.hazard_stepId"
              type="number"
              placeholder="第几步"
              style="width:10%"
            ></el-input>
            <span style="margin:0 1%">-</span>
            <el-input v-model="child.hazard_stepName" placeholder="步骤" style="width:20%"></el-input>
            <span style="margin:0 1%">-</span>
            <el-input v-model="child.hazard_risk" placeholder="危害" style="width:60%;"></el-input>
            <span style="margin:0 1%">-</span>
            <el-input v-model="child.hazard_res" placeholder="主要后果" style="width:65%;"></el-input>
            <span style="margin:0 1%">-</span>
            <el-input
              v-model="child.hazard_frequency"
              type="text"
              placeholder="频率"
              style="width:8%;margin-top:10px"
            ></el-input>
            <span style="margin:0 1%">-</span>
            <el-input
              v-model.number="child.hazard_L"
              type="number"
              placeholder="L"
              style="width:8%;margin-top:10px"
            ></el-input>
            <span style="margin:0 1%">-</span>
            <el-input
              v-model.number="child.hazard_S"
              type="number"
              placeholder="S"
              style="width:8%;margin-top:10px"
            ></el-input>
            <span style="margin:0 1%">-</span>
            <el-input
              v-model="child.hazard_measure "
              placeholder="现有控制措施（没有则填无）"
              style="width:70%;margin-top:10px"
            ></el-input>
            <span class="icon" style="color:red">
              <i class="el-icon-remove-outline" @click="removeDomain(child)"></i>
            </span>
          </el-row>
        </el-form-item>
        <el-form-item style="text-align:center">
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

 
    <!-- 修改数据对话框 -->
    <el-dialog title="修改任务" :visible.sync="editProperVisible" width="80%">
      <el-form ref="editFormRef" :model="editForm" label-width="100px" label-position="center">
        <el-form-item label="步骤序号">
          <el-input v-model.number="editForm.hazard_stepId" type="number" placeholder="第几步"></el-input>
        </el-form-item>
        <el-form-item label="步骤内容">
          <el-input v-model="editForm.hazard_stepName" placeholder="步骤"></el-input>
        </el-form-item>
        <el-form-item label="危害">
          <el-input v-model="editForm.hazard_risk" placeholder="第几步"></el-input>
        </el-form-item>
        <el-form-item label="主要后果">
          <el-input v-model="editForm.hazard_res" placeholder="主要后果"></el-input>
        </el-form-item>
        <el-form-item label="频率">
          <el-input v-model="editForm.hazard_frequency" type="text" placeholder="频率"></el-input>
        </el-form-item>
        <el-form-item label="L">
          <el-input v-model.number="editForm.hazard_L" type="number" placeholder="L"></el-input>
        </el-form-item>
        <el-form-item label="S">
          <el-input v-model.number="editForm.hazard_S" type="number" placeholder="S"></el-input>
        </el-form-item>
        <el-form-item label="现有控制措施">
          <el-input v-model="editForm.hazard_measure " placeholder="现有控制措施（没有则填无）"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editFormRef');editProperVisible = false">取 消</el-button>
        <el-button type="primary" @click="editData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      task: [],
      showTable: false,
      tableData: [],
      addProperVisible: false,
      editProperVisible:false,
      taskOptions: [],
      oldEditForm:[],
      addForm: {
        hazard_taskId: '',
        hazard_task: '',
        children: []
      },
      editForm: {
        hazard_taskId: '',
        hazard_task: ''
      },
      formLabelWidth: '80px',
      query: '',
    }
  },
  created() {
    this.getTask()
  },
  computed: {
    computeLevel() {
      return function(R) {
        if (R < 4) return '轻微风险'
        else if (R >= 4 && R <= 8) return '可接受风险'
        else if (R >= 9 && R <= 12) return '中等风险'
        else if (R >= 13 && R <= 16) return '重大风险'
        else return '巨大风险'
      }
    },
    computeAction() {
      return function(R) {
        if (R < 4) return '引起重视，日常岗检监管'
        else if (R >= 4 && R <= 8) return '有条件、有经费时治理'
        else if (R >= 9 && R <= 12) return '1~2年内治理'
        else if (R >= 13 && R <= 16) return '立即或近期整改'
        else return '立刻整改'
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
      this.$nextTick(() => {
        this.$refs[refname].resetFields()
      })
    },
    async getTask() {
      let { data: res } = await this.$http.get('/hazard/getTask')
      if (res.meta.err == -1) this.$message.error('获取任务列表失败')
      this.task = res.task
    },
    async getTableData() {
      let { data: res } = await this.$http.get('/hazard/assessResult', {
        params: { query: this.query }
      })
      if (res.meta.err == -1) this.$message.error('获取表格数据失败')
      this.tableData = res.assessResult
      console.log(this.tableData)
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
          hazard_stepId: '',
          hazard_stepName: '',
          hazard_risk: '',
          hazard_res: '',
          hazard_frequency: '',
          hazard_L: '',
          hazard_S: '',
          hazard_measure: ''
        })
      }
    },
    async addData() {
      //计算R
      this.addForm.children.forEach(item => {
        item.hazard_R = item.hazard_L * item.hazard_S
      })
      //判断是不是新的作业活动，是的话要在task数据库中插入数据
      let isNew = true
      for (let i = 0; i < this.task.length; i++) {
        if (this.addForm.hazard_taskId == this.task[i].hazard_taskId) {
          this.addForm.hazard_task = this.task[i].hazard_task
          isNew = false
          break
        }
      }
      if (isNew) {
        this.addForm.hazard_task = this.addForm.hazard_taskId
         var now = new Date();
        var year = now.getFullYear()%1000; //得到年份后两位
        var month = now.getMonth();//得到月份
        var date = now.getDate();//得到日期
        var seconds = now.getSeconds() ;//得到小时
        this.addForm.hazard_taskId = year+''+month+''+date+''+seconds+''+this.tableData.length
      }
      let { data: res } = await this.$http.post('/hazard/addTask', {
        addForm: this.addForm,
        isNew
      })
      if (res.meta.err == -1) return this.$message.error('提交数据失败')
      this.$message.success('添加数据成功')
      this.getTask()
      this.getTableData()
      this.addForm.hazard_taskId = ''
      this.addForm.children.splice(0, this.addForm.children.length)
      this.addProperVisible = false
    },
    showEditForm(index) {
      let deepCopy = JSON.stringify(this.tableData[index])
      this.oldEditForm = JSON.parse(deepCopy)
      this.editForm = JSON.parse(deepCopy)
      this.editProperVisible = true
    },
    async editData(){
      //判断是否进行过修改
      if (JSON.stringify(this.editForm) == JSON.stringify(this.oldEditForm)) {
        this.editProperVisible = false
        return
      } 
      else{
        console.log(this.editForm)
        console.log(this.oldEditForm.hazard_stepId,this.oldEditForm.hazard_stepName)
        let { data: res } = await this.$http.post('/hazard/editStep', {
        editForm: this.editForm,oldStepId:this.oldEditForm.hazard_stepId,oldStepName:this.oldEditForm.hazard_stepName
      })
      if (res.meta.err == -1) return this.$message.error('修改数据失败')
      this.$message.success('修改数据成功')
      this.getTableData()
      this.getTask()
      }
      this.editProperVisible = false
    },
    async deleteOne(index){
      let t = await this.$confirm(
        '此操作将永久删除该区域内所有存储信息, 是否继续?(如果要删除单个数据，请点击编辑操作)',
        '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)
      if (t !== 'confirm') return
      let type=0
      if(this.tableData.length==1){
        //当前如果只有一条步骤那么就说明删除这一条该任务就清空了，那么该任务也应该删除，更改下拉框
        type=1
      }
      let{ data: res } = await this.$http.delete('/hazard/deleteStep', {
        params:
        {
          hazard_taskId:this.query,
          type,
          hazard_stepId:this.tableData[index].hazard_stepId,
          hazard_stepName:this.tableData[index].hazard_stepName
        }
      })
      if (res.meta.err == -1) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getTableData()
      this.getTask()
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
