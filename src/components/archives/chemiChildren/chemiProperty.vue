<template>
  <div>
   <el-row :gutter="25">
        <el-col :span="7">
          <el-input
            placeholder="请输入化学品全称或关键字"
            class="input-with-select"
            clearable
            v-model="query"
            @clear="getTableData"
          >
            <el-button slot="append" icon="el-icon-search" @click="getTableData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addProperVisible = true">添加化学品信息</el-button>
        </el-col>
      </el-row>

    <el-table :data="tableData" border :cell-style="cellStyle" height="380" 
      :header-cell-style="rowClass" style="width: 100%;" stripe>
      <el-table-column prop="chemi_name" label="化学品名" width="150"></el-table-column>
      <el-table-column prop="chemi_property" label="化学品特性" width="200" ></el-table-column>
      <el-table-column prop="chemi_defend" label="控制和防护要求" width="200"></el-table-column>
      <el-table-column prop="chemi_storage" label="存储要求" width="200"></el-table-column>
      <el-table-column prop="chemi_transition" label="运输要求" width="200"></el-table-column>
      <el-table-column prop="chemi_abandon" label="废弃要求" width="200" ></el-table-column>
      <el-table-column label="操作" width="100" fixed="right" v-if="disabletemp">
        <template slot-scope="scope" >
          <el-button type="text" size="medium" @click ="showEditChemi(scope.row)" >修改</el-button>
          <el-button type="text" size="medium" @click="deleteData(scope.row.chemi_name)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- </div> -->
    <!-- 添加化学品对话框 -->
    <el-dialog
      title="添加化学品信息"
      :visible.sync="addProperVisible"
      width="80%"
    >
      <el-form ref="addFormRef" 
      :model="addForm" 
      :rules="dialogRule" 
      label-width="130px"
      label-position="left"
      >
        <el-form-item label="化学品名"  prop="chemi_name">
          <el-input v-model.trim="addForm.chemi_name" autosize></el-input>
        </el-form-item>
        <el-form-item label="化学特性"  prop="chemi_property">
          <el-input v-model.trim="addForm.chemi_property" autosize></el-input>
        </el-form-item>
        <el-form-item  label="控制和防护要求" prop="chemi_defend">
          <el-input  type="textarea" autosize v-model.trim="addForm.chemi_defend"></el-input>
        </el-form-item>
        <el-form-item label="存储要求"  prop="chemi_storage">
          <el-input type="textarea" autosize v-model.trim="addForm.chemi_storage"></el-input>
        </el-form-item>
        <el-form-item label="运输要求"  prop="chemi_transition">
          <el-input type="textarea" autosize v-model.trim="addForm.chemi_transition" ></el-input>
        </el-form-item>
        <el-form-item label="废弃要求"  prop="chemi_abandon">
          <el-input type="textarea" autosize v-model.trim="addForm.chemi_abandon"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addProperVisible = false;resetForm('addFormRef')">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
      <el-dialog
      title="修改化学品信息"
      :visible.sync="editProperVisible"
      width="80%"
    >
      <el-form
       ref="editFormRef"
       :model="editForm"
       :rules="dialogRule"
       label-width="150px"  
       label-position="left"
       >
        <el-form-item label="化学品名">
          <el-input v-model.trim="editForm.chemi_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="化学特性" prop="chemi_property" >
          <el-input type="textarea" autosize v-model.trim="editForm.chemi_property" ></el-input>
        </el-form-item>
        <el-form-item  label="控制和防护要求"  prop="chemi_defend">
          <el-input  type="textarea" autosize v-model.trim="editForm.chemi_defend" ></el-input>
        </el-form-item>
        <el-form-item label="存储要求"  prop="chemi_storage">
          <el-input type="textarea" autosize v-model.trim="editForm.chemi_storage" ></el-input>
        </el-form-item>
        <el-form-item label="运输要求" prop="chemi_transition">
          <el-input type="textarea" autosize v-model.trim="editForm.chemi_transition" ></el-input>
        </el-form-item>
        <el-form-item label="废弃要求" prop="chemi_abandon">
          <el-input type="textarea" autosize v-model.trim="editForm.chemi_abandon"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editProperVisible = false;resetForm('editFormRef')">取 消</el-button>
        <el-button type="primary" @click="editData">确 定</el-button>
      </span>
    </el-dialog>
  
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData:[],
      query:'',
      addProperVisible: false,
      addForm: {
        chemi_name: '',
        chemi_property: '',
        chemi_defend: '',
        chemi_storage: '',
        chemi_transition: '',
        chemi_abandon: ''
      },
      formLabelWidth: '80px',
      dialogRule:{
       chemi_name: [{required: true, message: '请输入化学品名', trigger: 'blur',pattern: '[^ \x22]+'}],
       chemi_property:[{required: true, message: '请输入化学品特性', trigger: 'blur',pattern: '[^ \x22]+' }],
       chemi_defend:[{required: true, message: '请输入控制和防护要求', trigger: 'blur',pattern: '[^ \x22]+'}],
       chemi_storage:[{required: true, message: '请输入存储要求', trigger: 'blur',pattern: '[^ \x22]+'}],
       chemi_transition:[{required: true, message: '请输入运输要求', trigger: 'blur',pattern: '[^ \x22]+'}],
       chemi_abandon:[{required: true, message: '请输入废弃要求', trigger: 'blur',pattern: '[^ \x22]+'}],
      },
      editForm:{},
      editProperVisible:false,
      chemi_name:'',
       disabletemp:true
    }
  },
  created() {
     this.roleId = window.sessionStorage.getItem('roleId')
    if(this.roleId=='6')
      this.disabletemp =false
    this.getTableData()
  },
  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },
    rowClass({ row, rowIndex }) {
      return 'text-align:center'
    },
     resetForm(refname) {
      this.$refs[refname].resetFields()
    },
    async getTableData() {
      const { data: res } = await this.$http.get('/archives/getChemiInfo',{params:{query:this.query}})
      if (res.meta.err == -1)
        return this.$message.error('获取化学品特性列表失败')
      this.tableData = res.chemiInfo
    },
    addData(){
      this.$refs.addFormRef.validate(async (valid) => {
        if(!valid) return ;
        const { data: res } = await this.$http.post('/archives/addChemiInfo',{addForm:this.addForm})
        if (res.meta.err == -1)
        return this.$message.error('添加化学品特性列表成功')
        this.resetForm('addFormRef')
        this.addProperVisible=false
        this.getTableData()
      })
    },
    showEditChemi(info){
      this.chemi_name = info.chemi_name
      let deepCopy = JSON.stringify(info)
      this.editForm = JSON.parse(deepCopy)
      this.editProperVisible = true
    },
    editData(){
       this.$refs.editFormRef.validate(async (valid) => {
        if(!valid) return ;
        const { data: res } = await this.$http.put('/archives/putChemiInfo',{editForm:this.editForm,chemi_name:this.chemi_name})
        if (res.meta.err == -1)
          return this.$message.error('修改化学品特性列表成功')
         this.$message.success('修改成功')
        this.resetForm('editFormRef')
        this.editProperVisible=false
        this.getTableData()
       })
    },
    async deleteData(chemi_name){
      const res = await this.$confirm('此操作将永久删除该化学品信息，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=> err )
      if(res !== "confirm") return ;
      const {data:result} = await this.$http.delete('archives/deleteChemiInfo',{params:{chemi_name}})
      if(result.meta.err == -1) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getTableData()
    }
  }
}
</script>

<style></style>
