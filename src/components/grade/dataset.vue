<template>
  <div class= "dataset">
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
        @click="upload"
        >上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传1个xlsx文件</div>
       </el-upload>
    
  </div>
</template>

<script>
export default {
  data(){
    return{
      fileList:[],
    }
  },
  methods:{
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
