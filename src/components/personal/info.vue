<template>

  <div class="info-wrap">
    <el-form
      :model="accountForm"
      status-icon
      :rules="rules"
      ref="personForm"
      label-width="100px"
      class="info-form"
    >
      <el-form-item label="姓名" >
        <el-input type="text" v-model="personForm.name" ></el-input>
      </el-form-item>
      <el-form-item label="性别">
          <el-input type="text" v-model="personForm.sex" ></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="checkPwd">
        <el-input type="text" v-model="personForm.apartment" ></el-input>
      </el-form-item>
      <el-form-item label="身份证号码">
          <el-input type="text" v-model="personForm.IDCard" ></el-input>
      </el-form-item>
       <el-form-item label="手机号码">
          <el-input type="text" v-model="personForm.phone" ></el-input>
      </el-form-item>
    
      <el-form-item style="text-align:center">
        <el-button type="primary" @click="submitForm('personForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>

export default {      
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        // 需要排除一下全是空格的情况
        if (this.accountForm.checkPass !== '') {
          this.$refs.accountForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.accountForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      personForm: {
        user_name:'',
        user_
      },
      rules: {
        pwd: [
         { validator: validatePass, trigger: 'blur' },
         { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格^%!@等特殊符号' },
         { min: 6, message: '请输入不少于6个字符', trigger: 'blur' },
         ],
        checkPwd: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods:{
       submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
  }
}
</script>
<style>
.info-wrap{
	height:100%;
  display: flex;
	justify-content: center;
	align-items: center;
}
.info-form{
	width:500px;
	border-radius:5px;
  padding:10px 30px;
  margin-top:100px;
}
</style>