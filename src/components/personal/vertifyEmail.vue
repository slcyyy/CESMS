<template>
  <div style="margin:auto 0">
    <div v-if="bindMail">
      <p>您已绑定邮箱号</p>
      <h1>{{codeEmail}}</h1>
      <el-button type="text" round @click="changeEmailVisible=true">更换</el-button>
    </div>   
    <el-dialog title="修改邮箱" :visible.sync="changeEmailVisible" width="50%">  
      <!-- status-icon属性为输入框添加了表示校验结果的反馈图标 -->
      <el-form
        :model="emailForm"
        status-icon
        :rules="emailRule"
        ref="email"
        label-width="100px"
      >
        <el-form-item label="邮箱" prop="pass">
          <el-input type="password" v-model="email.newEmail" placeholder="请输入新的邮箱号码"></el-input>
        </el-form-item>
        <el-form-item label="" prop="checkPass">
          <el-row>
            <el-input type="password" v-model="email.vertifyCode" style="width:50%" placeholder="请输入验证码"></el-input>
            <el-button>发送验证码</el-button>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('email')">提交</el-button>
          <el-button @click="resetForm('email')">重置</el-button>
        </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer">
        <el-button @click="changeEmailVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeEmailVisible = false">确 定</el-button>
      </span>    
    </el-dialog>                              
  </div>
</template>

<script>
export default {
  data(){
    var validateMail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        // 需要排除一下全是空格的情况
        if (this.emailForm.newEmal !== '') {
          this.$refs.emailForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validateCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.emailForm.vertifyCode) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return{
      email:'631674132@qq.com',
      bindMail:false,
      changeEmailVisible:false,
      emailForm:{
        newEmail:'',
        vertifyCode:''
      },
      emailRule:{
        newEmail: [{ validator: validateMail, trigger: 'blur' }],
        vertifyCode: [{ validator: validateCode, trigger: 'blur' }]
      }
    }
  },
  computed:{
    codeEmail(){
      let temp = [...this.email]
      this.email=""
      temp.map((res,index)=>{
        if(index>1 && index<5){
          this.email+="*"
        }
        else{
          this.email+=res
        }
      })
      return this.email
    }
  }
}
</script>

<style>

</style>