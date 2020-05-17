<template>
  <div class="login-wrap">
    <h1 class="cms-title">化工企业安全管理系统</h1>
    <el-form ref="loginFormRef" class="login-form" label-position="left" 
    label-width="60px" :model="formData" :rules="loginFormRules" >
      <h2 class="login-title">用户登录</h2>
      <!-- 指定prop使得验证规则生效 -->
      <el-form-item label="工号:" prop="id">
        <el-input v-model="formData.id"></el-input>
      </el-form-item>
      <!-- // prop="password" -->
      <el-form-item label="密码:" prop = "pwd" >
        <el-input v-model="formData.pwd" type="password" @keyup.enter.native = "login"></el-input>
      </el-form-item>
      <p class="forget" @click="forget">忘记密码？</p>
        <el-button @click="login" class="login-btn" type="primary" style="margin-bottom:30px;">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data(){
    return{
      formData:{
        id:'',
        pwd:''
      },
       loginFormRules:{
        //验证用户名是否合法
        id:[ 
          { required: true, message: '请输入工号', trigger: 'blur' },
          // { min: 13, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
        //验证密码是否合法
         pwd:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 6到 15 个字符', trigger: 'blur' }
        ]
     }
    }
  },
  methods:{
    login(){  
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const {data:res} = await this.$http.post('/users/login',this.formData);
        if(res.meta.err == 0){
          this.$message.success('登录成功！')
          window.sessionStorage.setItem("token",res.token);
          window.sessionStorage.setItem("userId",res.id)
          window.sessionStorage.setItem("roleId",res.roleId)
          window.sessionStorage.setItem('powerId',res.powers)
          this.$router.push('/home')
        }
        else if(res.meta.err== -2){
          return this.$message.error('工号或密码错误')
        }
        else{
          return this.$message.error('系统内部失败！')
        }
      })
    },
    forget(){
      let routeUrl = this.$router.resolve({
        path: '/forget',
      })
      window.open(routeUrl.href, '_blank')
    }
  }
}
</script>

<style>
.cms-title{
  position: absolute;
  margin-top:-200px;
  color: #ffffff;
  font-size: 50px
}
.login-wrap{
  background-color: #324152;
	height:100%;
  display: flex;
	justify-content: center;
	align-items: center;
}
.login-form{
	width:400px;
	background-color: #ffffff;
	border-radius:5px;
  padding:10px 30px;
  margin-top:100px;
}
.login-title{
  position:relative;
  left:50%;
  width:100px;
  margin-left:-50px;
}
.login-btn{
  width:100%;
}
.register-link{
  position:relative;
  left:80%;
}
.forget{
  font-size:14px;
}
.forget:hover{
  color:slateblue
}
</style>