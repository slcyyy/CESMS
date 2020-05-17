<template>
<div>
<BreadCrumbNavi>
      <template #secondPath>个人管理</template>
      <template #thirdPath>修改密码</template>
    </BreadCrumbNavi>

<el-card>
  <div class="pwd-wrap" style="height:470px;">
    <el-form
      :model="accountForm"
      status-icon
      :rules="rules"
      ref="accountForm"
      label-width="100px"
      class="pwd-form"
    >
    
      <el-form-item label="新密码" prop="pwd">
        <el-input type="password" v-model="accountForm.pwd" ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPwd">
        <el-input type="password" v-model="accountForm.checkPwd"></el-input>
      </el-form-item>
      <el-form-item style="text-align:center">
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
    </div>
    </el-card>
  </div>

</template>

<script>
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi'
export default {
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.accountForm.checkPass !== '') {
          this.$refs.accountForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.accountForm.pwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      accountForm: {
        user_id:'',
        pwd: '',
        checkPwd: '',
      },
      rules: {
        pwd: [
         { validator: validatePass1, trigger: 'blur' },
         { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格^%!@等特殊符号' },
         { min: 6,max:18, message: '请输入6-18个字符', trigger: 'blur' },
         ],
        checkPwd: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  components:{
    BreadCrumbNavi,
  },
  methods:{
    resetForm(refname) {
      this.$refs[refname].resetFields()
    },
    async submitForm(){
      this.accountForm.user_id = window.sessionStorage.getItem('userId')
      const {data:res} = await this.$http.put('/users/changePwd',{accountForm:this.accountForm})
      if(res.meta.err == -1) return this.$message.error('修改密码失败')
      this.$message.success('修改密码成功')
      this.resetForm('accountForm')
    },
  }
}
</script>
<style>
.pwd-wrap{
	height:100%;
  display: flex;
	justify-content: center;
	align-items: center;
}
.pwd-form{
	width:500px;
	border-radius:5px;
  padding:10px 30px;
  margin-top:100px;
}
</style>