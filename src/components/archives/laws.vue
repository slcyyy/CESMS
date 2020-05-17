<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbNavi>
      <template #secondPath>档案管理</template>
      <template #thirdPath>法律法规制度标准</template>
    </BreadCrumbNavi>
    <el-card>
      <!-- 搜索查询添加 -->
      <el-row :gutter="25">
        <el-col :span="7">
          <el-input
            placeholder="输入法规制度全称或关键字"
            class="input-with-select"
            clearable
            v-model="query"
            @clear="getTableData"
          >
            <el-button slot="append" icon="el-icon-search" @click="getTableData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addProperVisible = true">添加法规制度条目</el-button>
        </el-col>
      </el-row>
     
     <!-- 表格数据 -->
      <el-table :data="tableData" style="width: 100%" border height="420">
        <el-table-column prop="law_name" label="法律法规名称" width="180"></el-table-column>
        <el-table-column prop="law_id" label="标准编号" width="180"></el-table-column>
        <el-table-column prop="law_effectiveDate" label="生效日期" width="110"></el-table-column>
        <el-table-column prop="law_issueDepa" label="颁布部门" width="180"></el-table-column>
        <el-table-column label="获取渠道" width="80">
          <template v-slot="scope">
          <el-link type="success" :href="$http.defaults.baseURL+scope.row.law_url">网上下载</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="law_identifyDate" label="识别日期" width="110"></el-table-column>
        <el-table-column prop="law_suitDepa" label="适用部门" width="110"></el-table-column>
        <el-table-column prop="law_note" label="备注"></el-table-column>
        <el-table-column label="操作" width="110" v-if="disabletemp">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="showEditDialog(scope.row)">修改</el-button>
            <el-button type="text" size="medium" @click="deleteData(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加数据对话框 -->
    <el-dialog title="添加法律法规条目" :visible.sync="addProperVisible" width="50%" >
      <el-form ref="addFormRef" :model="addForm" :rules="addRule" :label-width="formLabelWidth">
        <el-form-item label="法律制度名称" prop="law_name">
          <el-input v-model="addForm.law_name" placeholder="请输入法规制度名称"></el-input>
        </el-form-item>
        <el-form-item label="标准编号" prop="law_id">
          <el-input v-model="addForm.law_id" placeholder="请输入法规制度编号"></el-input>
        </el-form-item>
        <el-form-item label="生效日期" prop="law_effectiveDate">
          <el-input v-model="addForm.law_effectiveDate" placeholder="请输入生效日期"></el-input>
        </el-form-item>
        <el-form-item label="颁布部门" prop="law_issueDepa">
          <el-input v-model="addForm.law_issueDepa" autocomplete="off" placeholder="请输入颁布部门"></el-input>
        </el-form-item>
        <el-form-item label="适用部门" prop="law_suitDepa">
          <el-input v-model="addForm.law_suitDepa" placeholder="请输入适用部门"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="law_note">
          <el-input v-model="addForm.law_note" placeholder="请输入备注（选填）"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload"
            ref="uploadFile"
            action
            :file-list="fileList"
            :auto-upload="false"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-button slot="trigger" size="small" type="primary">上传相关文件</el-button>
             <div slot="tip" class="el-upload__tip">请将文件命名为：法律法规名称(标准编号)</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addProperVisible = false;resetForm('addFormRef')">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </span>
    </el-dialog>

      <!-- 修改数据对话框 -->
    <el-dialog title="修改法律法规条目" :visible.sync="editProperVisible" width="50%" >
      <el-form ref="editFormRef" :model="editForm" :rules="addRule" :label-width="formLabelWidth">
        <el-form-item label="法律制度名称" prop="law_name">
          <el-input v-model="editForm.law_name" placeholder="请输入法规制度名称"></el-input>
        </el-form-item>
        <el-form-item label="标准编号" prop="law_id">
          <el-input v-model="editForm.law_id" placeholder="请输入法规制度编号"></el-input>
        </el-form-item>
        <el-form-item label="生效日期" prop="law_effectiveDate">
          <el-input v-model="editForm.law_effectiveDate" placeholder="请输入生效日期"></el-input>
        </el-form-item>
        <el-form-item label="颁布部门" prop="law_issueDepa">
          <el-input v-model="editForm.law_issueDepa" autocomplete="off" placeholder="请输入颁布部门"></el-input>
        </el-form-item>
        <el-form-item label="适用部门" prop="law_suitDepa">
          <el-input v-model="editForm.law_suitDepa" placeholder="请输入适用部门"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="law_note">
          <el-input v-model="editForm.law_note" placeholder="请输入备注（选填）"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload"
            ref="uploadFile"
            action
            :file-list="fileList"
            :auto-upload="false"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-button slot="trigger" size="small" type="primary">上传相关文件</el-button>
             <div slot="tip" class="el-upload__tip">请将文件命名为：法律法规名称(标准编号)</div>
          </el-upload>
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
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi'
export default {
  data() {
    return {
       disabletemp:true,
      tableData: [],
      query: '',
      addProperVisible: false,
      addForm: {
        law_name: '',
        law_id: '',
        law_effectiveDate: '',
        law_issueDepa: '',
        law_suitDepa: '',
        law_note: ''
      },
      formLabelWidth: '110px',
      addRule: {
        law_name: [{ required: true, message: '请输入名称', trigger: 'blur',pattern: '[^ \x22]+' }],
        law_id: [
          { required: true, message: '请输入标准编号', trigger: 'blur',pattern: '[^ \x22]+' }
        ],
        law_effectiveDate: [
          { required: true, message: '请输入生效日期', trigger: 'blur' ,pattern: '[^ \x22]+'}
        ],
        law_issueDepa: [
          { required: true, message: '请输入颁布部门', trigger: 'blur',pattern: '[^ \x22]+' }
        ],
        law_suitDepa: [
          { required: true, message: '请输入适用部门', trigger: 'blur' ,pattern: '[^ \x22]+'}
        ]
      },
      editForm:{},
      editProperVisible:false,
      fileList: [],
      oldEditForm:{}
      
    }
  },
  created() {
      this.roleId = window.sessionStorage.getItem('roleId')
    if(this.roleId=='6')
      this.disabletemp =false
    this.getTableData()
  },
  components: {
    BreadCrumbNavi
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
      console.log(this.query)
      const { data: res } = await this.$http.get('archives/getLaws',{ params:{query:this.query}})
      if (res.meta.err == -1)
        return this.$message.error('获取化学品特性列表失败')
      this.tableData = res.laws
    },
    handleExceed() {
      return this.$message.error('文件个数超出限制')
    },
    async addData() {
      //采用upload+formData的方式上传文件
      //FormData对象用以将数据编译成键值对，以便用XMLHttpRequest来发送数据。
      const formData = new FormData()
      console.log(this.$refs.uploadFile.uploadFiles)
      let file = this.$refs.uploadFile.uploadFiles[0]
      if (!file) {
        // 若未选择文件
        return this.$message.error('请上传文件')
      }
      //获取当前的日期作为识别日期
      var now = new Date()
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth();//得到月份
      var date = now.getDate();//得到日期
       month = month + 1;
      if (month < 10) month = "0" + month;
      if (date < 10) date = "0" + date;
      this.addForm.law_identifyDate = year+'/'+month+'/'+date
      formData.append('lawFile', file.raw)
      let lawInfo = JSON.stringify(this.addForm)
      formData.append('lawInfo',lawInfo)
      const { data: res } = await this.$http.post(
        '/archives/addLaw',
        formData,
      )
      if (res.meta.err == -1) return this.$message.error('添加失败')
      this.$message.success('添加成功')
      this.getTableData()
      this.resetForm('addFormRef')
      this.addProperVisible = false
      //清空文件
      this.$refs.uploadFile.uploadFiles.splice(0,this.$refs.uploadFile.uploadFiles.length)
    },
    showEditDialog(law){
      //这里需要深拷贝,不然界面上对话框一改后面的表格也会改
      let deepCopy = JSON.stringify(law)
      this.editForm = JSON.parse(deepCopy)
      this.oldEditForm.law_name = law.law_name
      this.oldEditForm.law_id = law.law_id
      this.editProperVisible = true
    },
    async editData(){
      //获取当前的日期作为识别日期
       var now = new Date()
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth();//得到月份
      var date = now.getDate();//得到日期
       month = month + 1;
      if (month < 10) month = "0" + month;
      if (date < 10) date = "0" + date;
      this.editForm.law_identifyDate = year+'/'+month+'/'+date
      //采用upload+formData的方式上传文件
      const formData = new FormData()
      let file = this.$refs.uploadFile.uploadFiles[0]
      if(file){
        let lawInfo = JSON.stringify(this.editForm)
        formData.append('lawInfo',lawInfo)
      //修改文件如果有上传文件进行文件处理
        formData.append('lawFile', file.raw)
        let edit =  JSON.stringify(this.oldEditForm)
        formData.append('oldEditForm',edit)
        var { data: res } = await this.$http.post(
        '/archives/addLaw',
        formData,
       )
      }
      else{
        delete this.editForm.law_url
         //没有上传文件,只修改数据
        var { data: res } = await this.$http.put(
        '/archives/putLaw',
         {editForm:this.editForm,oldEditForm:this.oldEditForm},
       )
      }
      if (res.meta.err == -1) return this.$message.error('修改失败')
      this.$message.success('修改成功')
      this.getTableData()
      //清空文件
      this.$refs.uploadFile.uploadFiles.splice(0,this.$refs.uploadFile.uploadFiles.length)
      this.editProperVisible = false
    },
    async deleteData(law) {
      console.log(law)
      const res = await this.$confirm(
        '此操作将永久删除该法规条目，是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (res !== 'confirm') return
      // law是整个法律数据的值，因为有可能它的名字是一样的，编号不一样
      const { data: result } = await this.$http.delete('archives/deleteLaw', {
        params: {law_name:law.law_name,law_id:law.law_id,law_url:law.law_url}
      })
      if (result.meta.err == -1) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getTableData()
    }
  }
}
</script>

<style>
</style>	