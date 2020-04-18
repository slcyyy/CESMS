<template>
  <div class="roleList">
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-button type="primary" @click="addFormVisible=true">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table border style="width: 100%" align="center" :data="roleList" :cell-style="cellStyle"
        :header-cell-style="rowClass">
        <el-table-column prop="role_id" label="角色ID" width="80"></el-table-column>
        <el-table-column prop="role_name" label="角色名称" width="200"></el-table-column>
        <el-table-column prop="role_desc" label="角色描述" width="400"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-tooltip content="修改角色信息" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditForm(scope.row.role_id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="分配权限" placement="top">
              <el-button
                type="danger"
                icon="el-icon-setting"
                size="mini"
                @click="showPowerForm(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除角色" placement="top">
              <el-button
                type="warning"
                icon="el-icon-delete"
                size="mini"
                @click="deleteRole(scope.row.role_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

     <!--添加角色对话框-->
    <el-dialog title="添加用户" :visible.sync="addFormVisible" width="40%"  > 
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" :label-width="formLabelWidth">
        <!--prop名称要跟绑定的数据名字相同-->
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="addForm.role_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="role_desc">
          <el-input v-model="addForm.role_desc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false;resetForm('addFormRef')">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改角色对话框-->
    <el-dialog title="修改角色信息" :visible.sync="editFormVisible">
      <el-form ref="editFormRef" :model="editForm" :rule="editFormRule" :label-width="formLabelWidth">
        <!--prop名称要跟绑定的数据名字相同-->
        <el-form-item label="角色名"  prop="role_name">
          <el-input v-model="editForm.role_name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="role_desc">
          <el-input v-model="editForm.role_desc" autocomplete="off" clearale></el-input>
        </el-form-item>
      </el-form>
      <!--dialogFormVisible = false-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false;resetForm('editFormRef')">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>

    <!--分配权限对话框-->
    <el-dialog title="分配权限" :visible.sync="AssignPowerFormVisible">
      <el-tree
        :data="powers"
        show-checkbox
        default-expand-all
        node-key="power_id"
        ref="powerTree"
        highlight-current
        :props="treePowers"
        :default-checked-keys="checkedKeys"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AssignPowerFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotPowers">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      editFormVisible: false,
      editForm: {
        role_name: '',
        role_desc: ''
      },
      formLabelWidth: '80px',
      editFormRule: {
        role_name:[
          {required: true, message: '请输入角色姓名', trigger: 'blur' }
        ],
        role_desc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      powers: [],
      AssignPowerFormVisible: false,
      treePowers:{
        children:'children',
        label:'power_name'
      },
      checkedKeys:[],
      role_id:'',
      addFormVisible:false,
      addFormRules:{
        role_name:[
          {required: true, message: '请输入角色描述', trigger: 'blur' }
        ],
        role_desc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      addForm:{
        role_id:'',
        role_name: '',
        role_desc: ''
      }

    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },
    rowClass({ row, rowIndex }) {
      return 'text-align:center'
    },
    async getRoleList() {
      const { data: res } = await this.$http.get('/roles/getRoleList')
      if (res.meta.msg == -1) return this.$message.error('获取角色列表数据失败')
      this.roleList = res.data
    },
    resetForm(refname) {
      this.$refs[refname].resetFields()
    },
    async showEditForm(role_id) {
      for(let i=0;i<this.roleList.length;i++){
        if(role_id==this.roleList[i].role_id){
          this.editForm = {...this.roleList[i]}
        }
      }
      this.editFormVisible = true
    },
    async editRole() {
      // 对表单进行预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const {data:res} = await this.$http.put('/roles/editRole',{editForm:this.editForm})
        if(res.meta.err == -1) return this.$message.error('修改失败')
        this.getRoleList()
        this.editFormVisible = false
        this.resetForm('editFormRef')
      })
    },
    async addRole(){
     this.$refs.addFormRef.validate(async valid => {
        this.addForm.role_id=this.roleList.length+1
        let {data:res} = await this.$http.post('/roles/addRole',{addForm:this.addForm})
        if(res.meta.err == -1) return this.$message.error('添加角色数据失败')
        this.$message.success('添加角色信息成功，可以为其分配权限')
        this.addFormVisible=false
        this.getRoleList()
        this.resetForm('addFormRef')
      })
    },
    async deleteRole(id){
      const t = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (t !== 'confirm') return
      const {data: res} = await this.$http.delete('roles/deleteRole', {params:{ role_id: id}})
      if (res.meta.err == -1)  return this.$message.error('删除用户失败')
      this.$message.success('已删除用户')
      this.getRoleList()
    },
    async showPowerForm(role) {
      this.checkedKeys = []
      const {data:res} = await this.$http.get('/roles/getPowersTree')
      if(res.meta.err == -1) return this.$message.error('获取权限列表失败')
      this.powers = res.powerList
      this.role_id =role.role_id//获取当前的角色ID
      this.checkedKeys = role.role_powers.split(',') //获取当前已经拥有的权限
      this.AssignPowerFormVisible = true
    },
  
    //提交修改
    async allotPowers(){
      let keys =[
          ...this.$refs.powerTree.getCheckedKeys(),
          ...this.$refs.powerTree.getHalfCheckedKeys()
      ]
      const {data:res} = await this.$http.put('/roles/savePowers',{role_id:this.role_id,keys})
      if(res.meta.err == -1 ) return this.$message.error('修改角色权限失败')
      this.$message.success('修改角色权限成功')
      this.AssignPowerFormVisible = false
    }
      
  }
  
}
</script>

<style>
</style>