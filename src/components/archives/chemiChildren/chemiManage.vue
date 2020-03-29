<template>
  <div>
    <el-button type="primary" @click="addProperVisible= true">添加条目</el-button>
    <el-table :data="chemiData" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="40"></el-table-column>
      <el-table-column prop="chemi_name" label="化学品名" width="180"></el-table-column>
      <el-table-column prop="chemi_property" label="特性" ></el-table-column>
      <el-table-column prop="chemi_location" label="存储地点" width="100"></el-table-column>
      <el-table-column prop="chemi_allowance" label="余量" width="100"></el-table-column>
      <el-table-column prop="chemi_refreshTime" label="更新时间" width="100"></el-table-column>
      <el-table-column prop="chemi_refreshRecord" label="更新记录" width="100"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <!-- //@click.native.prevent是为了使用父组件的事件 -->
          <el-button @click ="showEditForm(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="deleteRow(scope.row.chemi_name)" type="text" size="small">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加对话框 -->
    <el-dialog
      title="添加条目"
      :visible.sync="addProperVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addRule" >
        <!--prop名称要跟绑定的数据名字相同-->
        <el-form-item label="化学品名" :label-width="formLabelWidth" prop="chemi_name">
          <el-input v-model="addForm.chemi_name" autocomplete="off" required></el-input>
        </el-form-item>
        <!-- 这里主要要把它转为number -->
        <el-form-item label="特性" :label-width="formLabelWidth" prop="chemi_property">
          <el-input v-model="addForm.chemi_property" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="存储地点" :label-width="formLabelWidth" prop="chemi_location">
          <el-input v-model="addForm.chemi_location" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="余量" :label-width="formLabelWidth" prop="chemi_allowance">
          <el-input v-model="addForm.chemi_allowance" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="更新时间" :label-width="formLabelWidth" prop="chemi_refreshTime">
          <el-input  v-model="addForm.chemi_refreshTime"></el-input>
        </el-form-item>
        <el-form-item label="更新记录" :label-width="formLabelWidth" prop="chemi_refreshRecord">
          <el-input  v-model="addForm.chemi_refreshRecord"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$refs.addFormRef.resetFields();addProperVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
      <el-dialog
      title="修改化学品信息"
      :visible.sync="editProperVisible"
      width="50%"
      :show-close="false"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="addRule" >
        <!--prop名称要跟绑定的数据名字相同-->
        <el-form-item label="化学品名" :label-width="formLabelWidth" >
          <el-input v-model="editForm.chemi_name" disabled></el-input>
        </el-form-item>
        <!-- 这里主要要把它转为number -->
        <el-form-item label="特性" :label-width="formLabelWidth" prop="chemi_property">
          <el-input v-model="editForm.chemi_property" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="存储地点" :label-width="formLabelWidth" prop="chemi_location">
          <el-input v-model="editForm.chemi_location" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="余量" :label-width="formLabelWidth" prop="chemi_allowance">
          <el-input v-model="editForm.chemi_allowance" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="更新时间" :label-width="formLabelWidth" prop="chemi_refreshTime">
          <el-input  v-model="editForm.chemi_refreshTime"></el-input>
        </el-form-item>
        <el-form-item label="更新记录" :label-width="formLabelWidth" prop="chemi_refreshRecord">
          <el-input  v-model="editForm.chemi_refreshRecord"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$refs.editFormRef.resetFields();editProperVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      chemiData:[],
      addProperVisible:false,
      addForm:{
        chemi_name:'',
        chemi_property:'',
        chemi_location:'',
        chemi_allowance:'',
        chemi_refreshTime:'',
        chemi_refreshRecord:''
      },
      formLabelWidth: '110px',
      addRule:{
       chemi_name: [{required: true, message: '请输入化学品名', trigger: 'blur'}],
       chemi_property:[{required: true, message: '请输入化学品特性', trigger: 'blur'}],
       chemi_location:[{required: true, message: '请输入存储地点', trigger: 'blur'}],
       chemi_allowance:[{required: true, message: '请输入余量', trigger: 'blur'}],
       chemi_refreshTime: [{required: true, message: '请输入更新时间', trigger: 'blur'}],
       chemi_refreshRecord: [{required: true, message: '请输入更新记录', trigger: 'blur'}],
      },
      editProperVisible:false,
      editForm:{
        chemi_name:'',
        chemi_property:'',
        chemi_location:'',
        chemi_allowance:'',
        chemi_refreshTime:'',
        chemi_refreshRecord:''
      }
    }
  },
  created(){
    this.getData()
  },
  methods:{
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs.addFormRef.resetFields();
          done()
        })
        .catch(_ => {})
    },
    async getData(){
      const { data: res } = await this.$http.get('archives/getChemiInfo',{params:{choice:2}})
      if (res.meta.err == -1)
        return this.$message.error('获取化学品管理列表失败')
      this.chemiData = res.chemiResult
    },
    async deleteRow(chemi_name){
       const res = await this.$confirm('此操作将永久删除该法规条目，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=> err)
      if(res !== "confirm") return ;
      const {data:result} = await this.$http.delete('archives/deleteChemiInfo',{params:{chemi_name}})
      if(result.meta.err == -1) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getData()
    },
    showEditForm(info){
      this.editForm = info
      this.editProperVisible=true
    },
    editRow(){
      this.$refs.editFormRef.validate(async (valid) => {
        if(!valid) return this.$message.error('有未填项');
        let chemi_name = this.editForm.chemi_name
        const { data: res } = await this.$http.put('archives/changeChemiInfo',{editForm:this.editForm,chemi_name})
        if (res.meta.err == -1) return this.$message.error('修改化学品特性失败')
        this.$message.success('修改化学品特性成功')
        this.eidtProperVisible = false
        this.$refs.editFormRef.resetFields();
        console.log(this.editForm.chemi_property)
        this.getData() 
      })
    },
    addData(){
      this.$refs.addFormRef.validate(async (valid) => {
        if(!valid) return ;
        const { data: res } = await this.$http.post('archives/addChemiInfo',{addForm:this.addForm})
        if (res.meta.err == -1) return this.$message.error('添加化学品特性失败')
        this.$message.success('添加化学品特性成功')
        this.addProperVisible = false
        this.$refs.addFormRef.resetFields();
        this.getData()
      })
    },
    
  }


}
</script>

<style>
</style>