<template>
  <div class="roleList">
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员设置</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table border style="width: 100%" align="center" :data="roleList">
        <el-table-column type="index" label="#" width="80"></el-table-column>
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
                @click="deleteUser(scope.row.role_name)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--修改角色对话框-->
    <el-dialog title="修改角色信息" :visible.sync="editFormVisible">
      <el-form ref="editFormRef" :model="editForm" :rule="editFormRule">
        <!--prop名称要跟绑定的数据名字相同-->
        <el-form-item label="角色名" :label-width="formLabelWidth">
          <el-input v-model="editForm.role_name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="role_desc">
          <el-input v-model="editForm.role_desc" autocomplete="off" clearale></el-input>
        </el-form-item>
      </el-form>
      <!--dialogFormVisible = false-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>

    <!--分配权限对话框-->
    <el-dialog title="分配权限" :visible.sync="AssignPowerFormVisible">
       <!-- node-key="id" -->
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
      <!--dialogFormVisible = false-->
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
        role_desc: '',
        role_authority: ''
      },
      formLabelWidth: '80px',
      editFormRule: {
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
      role_id:''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('/roles/getRoleList')
      if (res.meta.msg == -1) return this.$message.error('获取角色列表数据失败')
      this.roleList = res.data
    },
    async showEditForm(role_id) {
      console.log(role_id)
      const { data: res } = await this.$http.get('roles/getRoleById', {params: {role_id} })
      console.log(res)
      if (res.meta.err == -1)
        return this.$message.error('打开修改角色对话框失败')
      this.editForm = res.query
      this.editFormVisible = true
    },
    editRole() {
      // 对表单进行预验证
      this.$ref.editFormRef.validate(async valid => {
        if (!valid) return
      })

      this.editFormVisible = false
    },

    async showPowerForm(role) {
      this.checkedKeys = []
      const {data:res} = await this.$http.get('/roles/getPowersTree')
      if(res.meta.err == -1) return this.$message.error('获取权限列表失败')
      this.powers = res.powerList
      let role_id = role.role_id
      let role_powers = role.role_powers
      const {data:res2} = await this.$http.get('/roles/getPowersLeafTreeById',{params:{role_id,role_powers}})
      this.checkedKeys = res2.leafList
      console.log(this.checkedKeys)
      this.AssignPowerFormVisible = true
      this.role_id =role_id
    },
    async allotPowers(){
      let keys =[
          ...this.$refs.powerTree.getCheckedKeys(),
          ...this.$refs.powerTree.getHalfCheckedKeys()
      ]
      const {data:res} = await this.$http.put('/roles/savePowers')
      if(res.meta.err == -1 ) return this.$message.error('修改角色权限失败')
      this.$message.success('修改角色权限成功')
      this.AssignPowerFormVisible = false
      console.log(keys)
    }
      // keys = keys.join(',')
      
  }
  
}
</script>

<style>
</style>