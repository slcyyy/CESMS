<template>
  <div>
    <BreadCrumbNavi>
      <template #secondPath>个人管理</template>
      <template #thirdPath>个人信息编辑</template>
    </BreadCrumbNavi>

    <el-card>
  <div class="pwd-wrap" style="margin-top:-20px;">
    <el-form
      :model="formData"
      status-icon
      :rules="rules"
      ref="personForm"
      label-width="100px"
      class="pwd-form"
    >
      <el-form-item label="工号">
        <el-input type="text" v-model="formData.user_id" disabled></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input type="text" v-model="formData.user_name"  disabled></el-input>
      </el-form-item>
       <el-form-item label="部门" >
        <el-input type="text" v-model="formData.user_depa" disabled></el-input>
      </el-form-item>
       <el-form-item label="身份证号码" prop="user_IDCard">
        <el-input type="text" v-model="formData.user_IDCard" ></el-input>
      </el-form-item>
       <el-form-item label="手机号码" prop="user_phone">
        <el-input type="text"  v-model="formData.user_phone" ></el-input>
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
  data(){
   return{
     formData:{},
     rules:{
       user_IDCard:[
         {required: true, message: '请输入身份证号码', trigger: 'blur',pattern: '[^ \x22]+'},
         {pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,message: '证件号码格式错误',trigger: 'blur'}
         ],
       user_phone:[
         {required: true, message: '请输入手机号码', trigger: 'blur',pattern: '[^ \x22]+'},
         {pattern: /^1[34578]\d{9}$/,message: '目前只支持中国大陆的手机号码',trigger: 'blur'}
         ]
     }
   }
 },
  components:{
   BreadCrumbNavi
  },
  created(){
    this.getFormData()
  },
  methods:{
    async getFormData(){
      let user_id = window.sessionStorage.getItem('userId')
      const { data: res } = await this.$http.get('users/getUserByID',{params:{user_id}})
      if (res.meta.err == -1) return this.$message.error('获取用户个人信息失败')
      this.formData = {...res.userInfo}
    },
    async submitForm(){
      this.formData.user_id = window.sessionStorage.getItem('userId')
      const { data: res } = await this.$http.put('users/editUser',{editForm:this.formData})
      if (res.meta.err == -1) return this.$message.error('修改用户个人信息失败')
      this.$message.success('修改用户个人信息成功')
    }
  }

}
</script>

<style>

</style>