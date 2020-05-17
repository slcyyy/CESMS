<template>
  <div class="dataset">
    <BreadCrumbNavi>
      <template #secondPath>企业评分</template>
      <template #thirdPath>评分数据预设</template>
    </BreadCrumbNavi>
    <el-card>
      <el-divider content-position="right" style="font-size:13px;">上传评分表模板</el-divider>
      <p v-if="tip"></p>
      <div v-else style="margin-bottom:20px">
        <span>已上传的评分表：</span>
        <a :href="fileUrl">评分表.xlsx</a>
      </div>
      <el-tag type="warning" style="width:100%;">请将文件名命名为“评分表”,文件格式为xlsx</el-tag>
      <el-upload
        class="upload"
        ref="uploadFile"
        action
        :file-list="fileList"
        :auto-upload="false"
        :limit="1"
        :on-exceed="handleExceed"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="dialogVisible=true"
        >上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传1个xlsx文件</div>
      </el-upload>
      <div style="margin-top:30px">
        <el-divider content-position="right" style="font-size:13px;">设定参与评分的企业</el-divider>
      </div>
      <div style="margin-bottom:10px;">
        <el-input
          placeholder="请输入企业名称（以/分割）"
          class="input-with-select"
          v-model="companyName"
          clearable
          :disabled="isEdit"
        ></el-input>
      </div>

      <el-button type="primary" @click="isEdit=false">修改数据</el-button>
      <el-button type="success" @click="changeCompany">提交数据</el-button>
    </el-card>


    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定使用该评分表文件？（该文件会覆盖旧评分表文件）</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="upload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi'
export default {
  data() {
    return {
      fileList: [],
      tip: '',
      fileUrl: '',
      dialogVisible: false,
      companyName:'',
      isEdit: false,
    }
  },
  created() {
    this.getPresetData()
  },
  components: {
    BreadCrumbNavi
  },
  methods: {
    async getPresetData() {
      const { data: res } = await this.$http.get('/grade/getPresetData')
      if (res.err == -1) this.tip = res.meta.$msg
      this.fileUrl = this.$http.defaults.baseURL + res.url
      for (let i = 0; i < res.company.length; i++) {
        this.companyName += res.company[i].company_name
        if(i+1!=res.company.length)
          this.companyName += '/'
      }
      if (this.companyName != null && this.companyName != undefined)
        this.isEdit = true
    },
    async upload() {
      const formData = new FormData()
      let file = this.$refs.uploadFile.uploadFiles[0]
      const headerConfig = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      if (!file) {
        // 若未选择文件
        return this.$message.error('请上传文件')
      }
      let name = file.name.split('.')[0]
      let ext = file.name.split('.')[1]
      if (name != '评分表') return this.$message.error('文件名不正确')
      else if (ext != 'xlsx') return this.$message.error('文件类型不正确')
      formData.append('checklist', file.raw)
      const { data: res } = await this.$http.post(
        '/grade/uploadTable',
        formData,
        headerConfig
      )
      if (res.meta.err == 0) {
        return this.$message.success('评分表上传成功')
      } else return this.$message.error('评分表上传失败')
    },
    handleExceed() {
      return this.$message.error('文件个数超出限制')
    },
    async changeCompany(){
        let t = await this.$confirm(
        '是否更改？请注意更改公司数据后所有的评分表填写数据将会被清空',
        '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)
      if (t !== 'confirm') return
       const { data: res } = await this.$http.post('/grade/changeCompany', {companyName:this.companyName})
       if (res.meta.err == -1) return this.$message.error('修改公司数据失败')
       this.isEdit = true
      return this.$message.success('修改公司数据成功')

       
    }
  }
}
</script>

<style >
.dataset {
  width: 100%;
  height: 100%;
}
</style>
