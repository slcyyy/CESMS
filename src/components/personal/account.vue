<template>
  <div style="margin:auto 0">
    <el-form
      :model="accountForm"
      status-icon
      :rules="rules"
      ref="accountForm"
      label-width="100px"
    >
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="accountForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="accountForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('accountForm')">提交</el-button>
        <el-button @click="resetForm('accountForm')">重置</el-button>
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
      accountForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  }
}
</script>
