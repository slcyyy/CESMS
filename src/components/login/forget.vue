<template>
  <div >
    <h1 style="margin-left:10px;" v-if="showPwd">您的密码是：{{pwd}}</h1>
    <div class="pwd-wrap" style="height:470px;">
    <el-form
       label-position="left"
      status-icon
     v-if="!showPwd"
            :model="formData"
      :rules="forgetFormRules"
        ref="forgetFormRef"
      label-width="100px"
      class="pwd-form"
    >
    
    <el-form-item label="工号" prop="user_id">
        <el-input v-model.trim="formData.user_id"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码" prop="user_IDCard">
        <el-input type="text" v-model.trim="formData.user_IDCard"></el-input>
      </el-form-item>
      <el-form-item style="text-align:center">
        <el-button type="primary" @click="forget">提交</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        user_id: '',
        user_IDCard: ''
      },
      pwd: '',
      showPwd: false,
      forgetFormRules: {
        //验证用户名是否合法
        user_id: [
          {
            required: true,
            message: '请输入工号',
            trigger: 'blur',
            pattern: '[^ \x22]+'
          }
        ],
        //验证密码是否合法
        user_IDCard: [
          {
            required: true,
            message: '请输入身份证号码',
            trigger: 'blur',
            pattern: '[^ \x22]+'
          },
          {
            pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
            message: '证件号码格式错误',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    forget() {
      this.$refs.forgetFormRef.validate(async valid => {
        if (!valid) return
        console.log(this.formData)
        const { data: res } = await this.$http.post(
          '/users/forget',
          {formData:this.formData}
        )
        if (res.meta.err == -1) return this.$message.error('找回密码失败！')
       
        if(res.meta.err==0){
           this.pwd = res.pwd
           this.showPwd = true
        }
        if(res.meta.err==2){
            this.$message.error('用户身份错误！')
        }
       
      })
    }
  }
}
</script>

<style>

.forget-form {
  width: 400px;
  background-color: #ffffff;
  border-radius: 5px;
  padding: 10px 30px;
  margin-top: 100px;
}
.forget-title {
  position: relative;
  left: 50%;
  width: 100px;
  margin-left: -50px;
}
.login-btn {
  width: 100%;
}
.register-link {
  position: relative;
  left: 80%;
}
</style>