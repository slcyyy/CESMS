<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员设置</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
      <el-row :gutter="25">
        <el-col :span="7">
          <el-input
            placeholder="请输入姓名全称或关键字"
            class="input-with-select"
            clearable
            @clear="getUserList"
            v-model="queryInfo.query"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="userList"
        border
        style="width: 100%"
        :cell-style="cellStyle"
        :header-cell-style="rowClass"
      >
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="user_id" label="工号" width="180"></el-table-column>
        <el-table-column prop="user_name" label="姓名" width="180"></el-table-column>
         <el-table-column prop="user_apartment" label="部门" width="180"></el-table-column>
        <el-table-column prop="user_roleName" label="角色" width="180"></el-table-column>
        <el-table-column prop="oprate" label="操作">
          <template v-slot="scope">
            <el-tooltip content="查看用户信息" placement="top">
              <el-button
                type="success"
                icon="el-icon-view"
                size="mini"
                @click="showEditForm(scope.row.user_id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="编辑用户" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditForm(scope.row.user_id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除用户" placement="top">
              <el-button
                type="warning"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(scope.row.user_id)"
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
    <el-dialog title="添加用户" :visible.sync="addFormVisible" width="40%" > 
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" :label-width="formLabelWidth">
        <!--prop名称要跟绑定的数据名字相同-->
        <el-form-item label="工号" prop="user_id">
          <el-input v-model="addForm.user_id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="user_name">
          <el-input v-model="addForm.user_name" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="user_pwd">
          <el-input v-model="addForm.user_pwd" disabled></el-input>
        </el-form-item>
        <el-form-item label="部门"  prop="user_apartment">
          <el-input v-model="addForm.user_apartment"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="user_roleId">
          <el-select v-model="addForm.user_roleId" placeholder="请选择角色" multiple style="width:50%">
            <el-option label="系统管理员" value="1"></el-option>
            <el-option label="专家" value="2"></el-option>
            <el-option label="汇总人" value="3"></el-option>
            <el-option label="档案管理员" value="4"></el-option>
            <el-option label="风险管理员" value="5"></el-option>
            <el-option label="员工" value="6"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false;resetForm('addFormRef')">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改用户对话框-->
    <el-dialog title="修改用户" :visible.sync="editFormVisible"  width="40%">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" :label-width="formLabelWidth">
        <!--prop名称要跟绑定的数据名字相同-->
        <el-form-item label="工号" >
          <el-input v-model="editForm.user_id" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="editForm.user_name" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="editForm.user_apartment" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色"  prop="user_roleId">
          <el-select v-model="editForm.user_roleId" placeholder="请选择角色" style="width:50%" multiple>
            <el-option label="系统管理员" value="1"></el-option>
            <el-option label="专家" value="2"></el-option>
            <el-option label="汇总人" value="3"></el-option>
            <el-option label="档案管理员" value="4"></el-option>
            <el-option label="风险管理员" value="5"></el-option>
            <el-option label="员工" value="6"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false;resetForm('editFormRef')">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        //查询参数
        query: '',
        pageNum: 1,
        pageSize: 10
      },
      userList: [],
      total: 0,
      addFormVisible: false,
      addForm: {
        user_id: '',
        user_name: '',
        user_pwd: '123456',
        user_roleId:[],
        user_apartment: '',
      },
      formLabelWidth: '60px',
      addFormRules: {
        user_id: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          {pattern: '[^ \x22]+', message: '不能全为空字符串',trigger:'blur'}
           ],
        user_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { pattern: '[^ \x22]+', message: '不能全为空字符串',trigger:'blur'}
        ],
        user_pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        user_Id: [
          { required: true, message: '请选择用户角色', trigger: 'blur' }
        ]
      },
      editFormVisible: false,
      editForm: {
        user_id: '',
        user_name: '',
        user_roleId: [],
        user_apartment:''
      },
      editFormRules: {
        user_roleId: [
          { required: true, message: '请选择用户角色', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
     cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },
    rowClass({ row, rowIndex }) {
      return 'text-align:center'
    },
    async getUserList() {
      const { data: res } = await this.$http.post(
        'users/getUserList',
        this.queryInfo
      )
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
    resetForm(refname) {
      this.$refs[refname].resetFields()
    },
    //async要加在await最接近的那个函数外部
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        this.addForm.user_roleId =  this.addForm.user_roleId+""
        const { data: res } = await this.$http.post(
          'users/addUser',
          this.addForm
        )
        if (res.meta.err == -1) return this.$message.error('添加用户失败')
        else if (res.meta.err == -2) return this.$message.error('该工号已注册')
        else {
          this.$message.success('添加用户成功')
          this.addFormVisible = false
          this.getUserList()
          this.resetForm('addFormRef')
        }
      })
    },
    //查看用户修改表单
    async showEditForm(user_id) {
      for(let i=0;i<this.userList.length;i++){
        if(user_id==this.userList[i].user_id){
          this.editForm = {...this.userList[i]}
        }
      }
      this.editFormVisible = true
    },
    async editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        this.editForm.user_roleId =  this.editForm.user_roleId+""
        const {data:res}=await this.$http.put('users/editUser', { editForm: this.editForm })
             
       if (res.meta.err == -1) return this.$message.error('修改用户信息失败')
        this.$message.success('修改用户信息成功')
        this.getUserList()
        this.editFormVisible = false
        this.resetForm('editFormRef')
     })
    },
    async deleteUser(id) {
      const res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 简写renturn err
      if (res !== 'confirm') return
      else {
        const {data: res} = await this.$http.delete('users/deleteUser', {params:{ user_id: id}})
        if (res.meta.err == -1) {
          this.$message.error('删除用户失败')
        } else {
          this.$message.success('已删除用户')
          this.getUserList()
        }
      }
    }
  }
}
</script>

<style></style>
