<template>
  <div>
        
    <el-row :gutter="25">
        <el-col :span="7">
          <el-input
            placeholder="请输入化学品全称或关键字"
            class="input-with-select"
            clearable
  >
            <el-button slot="append" icon="el-icon-search" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addFormVisible = true">添加化学品信息</el-button>
        </el-col>
      </el-row>
      <div class="scrolldiv">
    <el-table :data="chemiData" border style="width: 100%">
       <el-table-column prop="chemi_location" label="存储地点" width="180"></el-table-column>
      <el-table-column prop="chemi_name" label="化学品名" width="180"></el-table-column>
      <el-table-column prop="chemi_property" label="特性" ></el-table-column>
     <el-table-column prop="chemi_device" label="设备" width="100"></el-table-column>
     <el-table-column prop="chemi_allowance" label="余量" width="100"></el-table-column>
      <el-table-column prop="chemi_total" label="总量" width="100"></el-table-column>
      <el-table-column prop="chemi_refreshTime" label="更新时间" width="100"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <!-- //@click.native.prevent是为了使用父组件的事件 -->
          <el-button @click ="showEditForm(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="deleteRow(scope.row.chemi_name)" type="text" size="small">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
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
        <el-form-item label="更新时间"  width="100" prop="chemi_refreshTime">
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
         <el-form-item  label="存储地点" :label-width="formLabelWidth" prop="chemi_location">
          <el-input v-model="editForm.chemi_location" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="化学品名" :label-width="formLabelWidth" >
          <el-input v-model="editForm.chemi_name" disabled></el-input>
        </el-form-item>
        <!-- 这里主要要把它转为number -->
        <el-form-item label="特性" :label-width="formLabelWidth" prop="chemi_property">
          <el-input v-model="editForm.chemi_property" autocomplete="off"></el-input>
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
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi'
export default {
  data(){
    return{
      chemiData:[{
        chemi_name:'氯乙烯',
        chemi_property:'氯乙烯又名乙烯基氯（Vinyl chloride）是一种应用于高分子化工的重要的单体，可由乙烯或乙炔制得。为无色、易液化气体，沸点-13℃，临界温度151.5℃，临界压力5.57MPa。相对密度2.2%。氯乙烯是有毒物质，长期吸入和接触氯乙烯可能引发肝癌。它与空气形成爆炸混合物，爆炸极限3.6%～33%（体积），在加压下更易爆炸，贮运时必须注意容器的密闭及氮封，并应添加少量阻聚剂。 ',
        chemi_location:'氯乙烯罐区',
        chemi_device:'球罐',
    chemi_total:'32',
        chemi_allowance:'32',
        chemi_refreshTime:'2020/1/23 08:32',
      }  ,
       {
        chemi_name:'电石',
        chemi_property:'碳化钙，电石的主要成分，是无机化合物，白色晶体，工业品为灰黑色块状物，断面为紫色或灰色。遇水立即发生激烈反应，生成乙炔，并放出热量。碳化钙是重要的基本化工原料，主要用于产生乙炔气。也用于有机合成、氧炔焊接等。',
        chemi_location:'电石原料车间',
        chemi_allowance:'63',
        chemi_device:'料仓',
        chemi_total:63,
        chemi_refreshTime:'2020/2/4 23:22',
      },
      {
        chemi_name:'氨',
        chemi_property:'',
        chemi_location:'合成车间',
        chemi_allowance:'',
        chemi_refreshTime:'2020/2/4',
      }
      ],
      addProperVisible:false,
      addForm:{
        chemi_name:'氨',
        chemi_property:'',
        chemi_location:'合成车间',
        chemi_allowance:'',
        chemi_refreshTime:'2020/2/4',
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
    components:{
      BreadCrumbNavi,
  
    },
  created(){
    // this.getData()
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
      const { data: res } = await this.$http.get('/archives/getChemicalInfo')
      if (res.meta.err == -1)
        return this.$message.error('获取化学品管理列表失败')
      this.chemiData = res.chemicalInfo
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
        // console.log(this.editForm.chemi_property)
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