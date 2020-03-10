<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员设置</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入姓名全称或关键字"
            class="input-with-select"
            clearable
            @clear="getUserList"
            v-model="queryInfo.query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary"  @click="dialogFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border style="width: 100%" align="center">
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column
          prop="user_id"
          label="工号"
          width="180"
        ></el-table-column>
        <el-table-column prop="user_name" label="姓名" width="180">
          <!-- 909 如果里面写了内容就会被覆盖 -->
        </el-table-column>
        <el-table-column
          prop="user_roleName"
          label="角色"
          width="180"
        ></el-table-column>
        <el-table-column prop="user_state" label="状态" width="180">
          <!-- 作用域插槽 -->
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <el-switch
              v-model="scope.row.user_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="oprate" label="操作">
          <template v-slot="scope">
            <el-tooltip content="编辑用户" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click = "showEditForm(scope.row.user_id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="设置权限" placement="top">
              <el-button
                type="danger"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除用户" placement="top">
              <el-button
                type="warning"
                icon="el-icon-delete"
                size="mini"
                @click = "deleteUser(scope.row.user_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
<!--添加用户对话框-->
    <el-dialog title="添加用户" :visible.sync="addFormVisible" @close="addFormClose"  >
      <el-form  ref="addFormRef" :model="addForm" :rules = "addFormRules">
        <!--prop名称要跟绑定的数据名字相同-->
        <el-form-item label="工号" :label-width="formLabelWidth" prop="user_id" >
          <el-input v-model="addForm.user_id" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="user_name">
          <el-input v-model="addForm.user_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="user_pwd">
          <el-input v-model="addForm.user_pwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="user_email">
          <el-input v-model="addForm.user_email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" prop="user_roleId">
          <el-select v-model="addForm.user_roleId" placeholder="请选择角色">
            <el-option label="系统管理员" value="1"></el-option>
            <el-option label="专家" value="2"></el-option>
            <el-option label="汇总人" value="3"></el-option>
            <el-option label="档案管理员" value="4"></el-option>
            <el-option label="风险管理员" value="5"></el-option>
            <el-option label="员工" value="6"></el-option>
          </el-select>
        </el-form-item>
      </el-form> <!--dialogFormVisible = false-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser"
          >确 定</el-button>
      </div>
    </el-dialog>

<!--修改用户对话框-->
    <el-dialog title="修改用户" :visible.sync="editFormVisible"  >
      <el-form  ref="editFormRef" :model="editForm" :rules = "editFormRules">
        <!--prop名称要跟绑定的数据名字相同-->
        <el-form-item label="工号" :label-width="formLabelWidth" >
          <el-input v-model="editForm.user_id" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="editForm.user_name" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" prop="user_roleId">
          <el-select v-model="editForm.user_roleId" placeholder="请选择角色">
            <el-option label="系统管理员" value="1"></el-option>
            <el-option label="专家" value="2"></el-option>
            <el-option label="汇总人" value="3"></el-option>
            <el-option label="档案管理员" value="4"></el-option>
            <el-option label="风险管理员" value="5"></el-option>
            <el-option label="员工" value="6"></el-option>
          </el-select>
        </el-form-item>
      </el-form> <!--dialogFormVisible = false-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser"
          >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule,value,cb) => {
    //必须要返回cb，在最后对整个表单验证时，如果这里没有返回cb那么就不会执行
        if(value){
          const regEmail = /^([a-zA-Z0-9_-])+([a-zA-z0-9_-])+(\.[a-zA-z0-9_-])+/
          //.test函数校验值是否合法
          if(regEmail.test(value)){
            return cb()
          }
          cb(new Error('请输入合法的邮箱'))
        }
        else{
          return cb()
        }
    }

    return {
      queryInfo: {
        //查询参数
        query: '',
        pageNum: 1,
        pageSize: 10
      },
      userList: [],
      total: 0,
      addFormVisible:false,
      addForm:{
        user_id:'',
        user_name:'',
        user_pwd:'123456',
        user_email:'',
        user_roleId:'',
        user_state:true,
      },
      formLabelWidth: '120px',
      addFormRules:{
        user_id:[
           { required: true, message: '请输入工号', trigger: 'blur' },
        ],
        user_name:[
           { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        user_pwd:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 6到 15 个字符', trigger: 'blur' }
        ],
        user_email:[
          {validator:checkEmail,trigger:'blur'}
        ],
        user_Id:[
          { required: true, message: '请选择用户角色', trigger: 'blur' },
        ],
      },
      editFormVisible:false,
      editForm:{
        user_id:'',
        user_name:'',
        user_roleId:''
      },
      editFormRules:{
        user_roleId:[
          { required: true, message: '请选择用户角色', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      // ,{params:this.queryInfo }
      const { data: res } = await this.$http.post(
        'users/getUserList',
        this.queryInfo
      )
      console.log(res)
      if (res.meta.err == -1) return this.$message.error('获取列表失败')
      this.total = res.total
      this.userList = res.data
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getUserList()
    },
    async userStateChange(oldState) {
      // console.log(oldState)
      const { data: res } = await this.$http.put('users/stateChange',oldState)
      if (res.meta.err == -1) return this.$message.error('更新用户状态失败')
      this.$message.success('更新用户状态成功')
    },
    addFormClose(){
      this.$refs.addFormRef.resetFields()
    },
    //async要加在await最接近的那个函数外部
    addUser(){
      this.$refs.addFormRef.validate(async (valid) => {
        if(!valid) return ;
        const {data:res} = await this.$http.post('users/addUser',this.addForm)
        console.log(res)
        if(res.meta.err == -1) return this.$message.error('添加用户失败')
        else if(res.meta.err == -2) return this.$message.error('该工号已注册')
        else{
          this.$message.success('添加用户成功')
          this.addFormVisible = false
          this.getUserList()
        }
      })
    },
    //查看用户修改表单
    async showEditForm(user_id){
    ////get，传入参数的时候，需要  { }  然后在里面传入 params 这个参数，一定要是
      const {data:res} = await this.$http.get('users/getUserByID',{params:{user_id}})
      if(res.meta.err == -1) return  console.error('查询用户失败')
      else{
        cosole.success('查询用户成功')
        this.editForm = res.query
        this.editFormVisible = true
      }
    },
    editUser(){
       this.$refs.editFormRef.validate(async (valid) => {
         if(!valid) return ; 
         this.$http.put('users/editUser',{user_id:this.editForm.user_id})
       })
    },
    async deleteUser(id){
      const res = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=> err )
        // 简写renturn err
      if(res !== "confirm") return ;
      else{
        const {data:res} = await this.$http.delete('users/deleteUser',{user_id:id})
        if(res.meta.err == -1){
          this.$message.error('删除用户失败')
        }
        else{
          this.$message.success('已删除用户')
          this.getUserList()
        }
      }
    }
    
  }
}
</script>

<style></style>
