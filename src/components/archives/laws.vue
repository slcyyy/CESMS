<template>
  <div>

    <BreadCrumbNavi>
      <template #secondPath>档案管理</template>
      <template #thirdPath>法律法规制度标准</template>
    </BreadCrumbNavi>
    <el-card >
      <el-button type="primary" @click="addProperVisible= true">添加条目</el-button>
    <el-table
      :data="lawData"
      style="width: 100%"
      border
    >
    <!--  :default-sort="{prop: 'date', order: 'descending'}" -->
      <el-table-column type="index" label="序号" sortable width="40"></el-table-column>
      <el-table-column prop="law_name" label="法律法规名称"  width="180"></el-table-column>
      <el-table-column prop="law_id" label="标准编号"  width="180"></el-table-column>
      <el-table-column prop="law_effectiveData" label="生效日期"  width="110"></el-table-column>
      <el-table-column prop="law_issueDepa" label="颁布部门"  width="180"></el-table-column>
			<el-table-column label="获取渠道"  width="80"> <el-link type="primary">网上下载</el-link></el-table-column>
      <el-table-column prop="law_identifyData" label="识别日期"  width="110"></el-table-column>
      <el-table-column prop="law_useDepa" label="适用部门"  width="110"></el-table-column>
			<el-table-column prop="law_note" label="备注" ></el-table-column>
     <!-- 这个formatter是什么？ :formatter="formatter-->
     <el-table-column label="操作" width="110">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click ="changeChemi(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="removeLaw(scope.row.law_name)">移除</el-button>
        </template>
      </el-table-column>
 </el-table>
 </el-card>
  <el-dialog
      title="添加法律法规条目"
      :visible.sync="addProperVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="addFormRef" :model="addData" :rules="addRule" >
        <!--prop名称要跟绑定的数据名字相同-->
        <el-form-item label="法律法规名称" :label-width="formLabelWidth" prop="law_name">
          <el-input v-model="addData.law_name" autocomplete="off" required></el-input>
        </el-form-item>
        <!-- 这里主要要把它转为number -->
        <el-form-item label="标准编号" :label-width="formLabelWidth" prop="law_id">
          <el-input v-model="addData.law_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="生效日期" :label-width="formLabelWidth" prop="law_effectiveData">
          <el-input v-model="addData.law_effectiveData" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="颁布部门" :label-width="formLabelWidth" prop="law_issueDepa">
          <el-input v-model="addData.law_issueDepa" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="获取渠道" :label-width="formLabelWidth">
       
         
        </el-form-item>
        <el-form-item label="识别日期" :label-width="formLabelWidth" prop="law_identifyData">
          <el-input  v-model="addData.law_identifyData"></el-input>
        </el-form-item>
        <el-form-item label="适用部门" :label-width="formLabelWidth" prop="law_useDepa">
          <el-input  v-model="addData.law_useDepa"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="law_note">
          <el-input  v-model="addData.law_note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$refs.addFormRef.resetFields();addProperVisible = false">取 消</el-button>
        <el-button type="primary" @click="addLaw">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi'
export default {
  data() {
    return {
      lawData: [
       
      ],
      addProperVisible:false,
      addData:{
        law_name:'',
        law_id:'',
        law_effectiveData:'',
        law_issueDepa:'',
        law_access:'',
        law_identifyData:'',
        law_useDepa:'',
        law_note:''
      },
      formLabelWidth: '110px',
      addRule:{
       law_name: [{required: true, message: '请输入名称', trigger: 'blur'}],
       law_id:[{required: true, message: '请输入标准编号', trigger: 'blur'}],
       law_effectiveData:[{required: true, message: '请输入生效日期', trigger: 'blur'}],
       law_issueDepa:[{required: true, message: '请输入颁布部门', trigger: 'blur'}],
      //  law_access:[{required: true, message: '请输入获取渠道', trigger: 'blur'}],
       law_identifyData:[{required: true, message: '请输入识别日期', trigger: 'blur'}],
       law_useDepa:[{required: true, message: '请输入使用部门', trigger: 'blur'}],
      }
    }
  },
  created(){
    this.getLaws()
  },
   components:{
      BreadCrumbNavi,
  
    },
  methods: {
    formatter(row, column) {
      return row.address
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs.addFormRef.resetFields();
          done() 
        })
        .catch(_ => {})
    },
    async getLaws(){
      const { data: res } = await this.$http.get('archives/getLaws')
      if (res.meta.err == -1)
        return this.$message.error('获取化学品特性列表失败')
      this.lawData = res.laws
    },
    addLaw(){
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('表单还有必填项未填写！')
        const { data: res } = await this.$http.post('archives/addLaw',{addData:this.addData})
        if (res.meta.err == -1) return this.$message.error('添加法律法规条目失败')
        this.$message.success('添加法律法规条目成功')
        this.addProperVisible = false
        this.getLaws()
        this.$refs.addFormRef.resetFields();
        // 备注还没有被清空
      })
    },
     async removeLaw(law_name){
      const res = await this.$confirm('此操作将永久删除该法规条目，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=> err)
      if(res !== "confirm") return ;
      const {data:result} = await this.$http.delete('archives/deleteLaw',{params:{law_name}})
      if(result.meta.err == -1) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getLaws()
    }

  }
}
</script>

<style>
</style>	