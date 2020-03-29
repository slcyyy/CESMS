<template>
  <div class= "dataset">
    <BreadCrumbNavi></BreadCrumbNavi>
    <p v-if="tip"></p>
    <div v-else style="margin-bottom:20px">
      <span>已上传的评分表：</span>
      <a :href="fileUrl">评分表.xlsx</a>
    </div>
    <el-tag type="warning" style="width:100%;">请将文件名命名为“评分表”,文件格式为xlsx</el-tag>
    <el-upload
      class="upload"
      ref="uploadFile"
      action=""
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :auto-upload="false"
      :limit = "1"
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
      <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
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
  data(){
    return{
      fileList:[],
      tip:'',
      fileUrl:'',
      dialogVisible:false
    }
  },
  created(){
    this.getUrl()
  },
  components:{
    BreadCrumbNavi
  },
  methods:{
    async getUrl(){
      const {data:res} = await this.$http.get('/grade/getEvalTableUrl')
      if(res.err==-1) 
        this.tip= res.meta.$msg
      this.fileUrl = this.$http.defaults.baseURL+res.url
      console.log(this.fileUrl)
      console.log(this.tip)

    },
     async upload() {
       const formData = new FormData();
       let file = this.$refs.uploadFile.uploadFiles[0]
       const headerConfig = { headers: { 'Content-Type': 'multipart/form-data' } };
       if (!file) { // 若未选择文件
         return this.$message.error('请上传文件');
        }
        let name = file.name.split('.')[0]
        let ext = file.name.split('.')[1]
       if(name != '评分表') return this.$message.error('文件名不正确');
        else if(ext !='xlsx') return this.$message.error('文件类型不正确');   
       formData.append('checklist',file.raw)
       const {data:res} = await this.$http.post('/grade/uploadTable',formData,headerConfig)
       if(res.meta.err == 0){
        console.log(res)
        return this.$message.success('评分表上传成功')
       }
       else
        return this.$message.error('评分表上传失败')
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(){
        return this.$message.error('文件个数超出限制')
      },
  }
}
</script>

<style >
.dataset{
  width:100%;
  height:100%
}

</style>
