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
<div style="height:380px;overflow-y:auto">
    <el-table :data="properties" border   align="center">
      <el-table-column type="index" label="#" width="40"></el-table-column>
      <el-table-column prop="chemi_name" label="化学品名"></el-table-column>
      <el-table-column prop="chemi_hazardLevel" label="危害级别" width="80"></el-table-column>
      <el-table-column prop="chemi_defendReq" label="控制和防护要求"></el-table-column>
      <el-table-column prop="chemi_storageReq" label="存储要求"></el-table-column>
      <el-table-column prop="chemi_transReq" label="运输要求"></el-table-column>
      <el-table-column prop="chemi_abandonReq" label="废弃要求"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click ="showEditChemi(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="removeChemi(scope.row.chemi_name)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!-- 添加化学品对话框 -->
    <el-dialog
      title="添加化学品"
      :visible.sync="addProperVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addRule" validate-on-rule-change>
        <!--prop名称要跟绑定的数据名字相同-->
        <el-form-item label="化学品名" :label-width="formLabelWidth" prop="chemi_name">
          <el-input v-model="addForm.chemi_name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 这里主要要把它转为number -->
        <el-form-item label="危害级别" :label-width="formLabelWidth" prop="chemi_hazardLevel">
          <el-input v-model="addForm.chemi_hazardLevel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="控制和防护要求" :label-width="formLabelWidth" prop="chemi_defendReq">
          <el-input  type="textarea" autosize v-model="addForm.chemi_defendReq" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="存储要求" :label-width="formLabelWidth" prop="chemi_storageReq">
          <el-input type="textarea" autosize v-model="addForm.chemi_storageReq" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="运输要求" :label-width="formLabelWidth" prop="chemi_transReq">
          <el-input type="textarea" autosize v-model="addForm.chemi_transReq" ></el-input>
        </el-form-item>
        <el-form-item label="废弃要求" :label-width="formLabelWidth" prop="chemi_abandonReq">
          <el-input type="textarea" autosize v-model="addForm.chemi_abandonReq"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$refs.addFormRef.resetFields();addProperVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProperty">确 定</el-button>
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
        <el-form-item label="危害级别" :label-width="formLabelWidth" prop="chemi_hazardLevel">
          <el-input v-model="editForm.chemi_hazardLevel"></el-input>
        </el-form-item>
        <el-form-item  label="控制和防护要求" :label-width="formLabelWidth" prop="chemi_defendReq">
          <el-input  type="textarea" autosize v-model="editForm.chemi_defendReq" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="存储要求" :label-width="formLabelWidth" prop="chemi_storageReq">
          <el-input type="textarea" autosize v-model="editForm.chemi_storageReq" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="运输要求" :label-width="formLabelWidth" prop="chemi_transReq">
          <el-input type="textarea" autosize v-model="editForm.chemi_transReq" ></el-input>
        </el-form-item>
        <el-form-item label="废弃要求" :label-width="formLabelWidth" prop="chemi_abandonReq">
          <el-input type="textarea" autosize v-model="editForm.chemi_abandonReq"></el-input>
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
  data() {
    return {
      properties: [
        {
          chemi_name:'乙炔',
          chemi_hazardLevel:2,
          chemi_defendReq:'眼睛防护：一般不需要特殊防护，高浓度接触时可戴化学安全防护眼镜。呼吸系统防护：一般不需要特殊防护，但建议特殊情况下佩带合适的自吸过滤式防毒面具（氧气含量与空气中氧含量一致或接近时）。',
          chemi_storageReq:'乙炔的包装法通常是溶解在溶剂及多孔物中，装入钢瓶内。储存于阴凉、通风的库房。远离火种、热源。库温不宜超过30℃。应与氧化剂、酸类、卤素分开存放，切忌混储。采用防爆型照明、通风设施。禁止使用易产生火花的机械设备和工具。储区应备有泄漏应急处理设备。',
          chemi_transReq:'不得同一车运送氧气、乙炔瓶，如作业中需乙炔瓶和氧气瓶放在同一小车上搬运，必须用非燃材料隔板隔开；',
          chemi_abandonReq:'处置前应参阅国家和地方有关法规。建议用焚烧法处置和填埋。'
        },
        {
          chemi_name:'氯乙烯',
          chemi_hazardLevel:2,
          chemi_defendReq:'呼吸系统防护：空气中浓度超标时，佩戴过滤式防毒面具（半面罩）。紧急事态抢救或撤离时，建议佩戴空气呼吸器。',
          chemi_storageReq:'钢质气瓶；磨砂口玻璃瓶或螺纹口玻璃瓶外普通木箱；安瓿瓶外普通木箱；螺纹口玻璃瓶、铁盖压口玻璃瓶、塑料瓶或金属桶（罐）外普通木箱。',
          chemi_transReq:'不得同一车运送氧气、乙炔瓶，如作业中需乙炔瓶和氧气瓶放在同一小车上搬运，必须用非燃材料隔板隔开；',
          chemi_abandonReq:'用焚烧法处置。与燃料混合后，再焚烧。焚烧炉排出的卤化氢通过酸洗涤器除去。。'
        }
      ],
      addProperVisible: false,
      addForm: {
        chemi_name: '',
        chemi_hazardLevel: '',
        chemi_defendReq: '',
        chemi_storageReq: '',
        chemi_transReq: '',
        chemi_abandonReq: ''
      },
      formLabelWidth: '120px',
      addRule:{
       chemi_name: [{required: true, message: '请输入化学品名', trigger: 'blur'}],
       chemi_hazardLevel:[{required: true, message: '请输入危害级别', trigger: 'blur'}],
       chemi_defendReq:[{required: true, message: '请输入控制和防护要求', trigger: 'blur'}],
       chemi_storageReq:[{required: true, message: '请输入存储要求', trigger: 'blur'}],
       chemi_transReq:[{required: true, message: '请输入运输要求', trigger: 'blur'}],
       chemi_abandonReq:[{required: true, message: '请输入废弃要求', trigger: 'blur'}],
      },
      editForm:{
        chemi_name: '',
        chemi_hazardLevel: '',
        chemi_defendReq: '',
        chemi_storageReq: '',
        chemi_transReq: '',
        chemi_abandonReq: ''
      },
      editProperVisible:false
    }
  },
  created() {
    // this.getProperties()
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs.addFormRef.resetFields();
          done()
        })
        .catch(_ => {})
    },
    async getProperties() {
      const { data: res } = await this.$http.get('/archives//getChemicalInfo')
      if (res.meta.err == -1)
        return this.$message.error('获取化学品特性列表失败')
      this.properties = res.chemicalInfo
    },
    addProperty() {
      this.$refs.addFormRef.validate(async (valid) => {
        if(!valid) return ;
        const { data: res } = await this.$http.post('archives/addChemiInfo',{addForm:this.addForm})
        if (res.meta.err == -1) return this.$message.error('添加化学品特性失败')
        this.$message.success('添加化学品特性成功')
        this.addProperVisible = false
        this.$refs.addFormRef.resetFields();
        this.getProperties()
      })
    },
    showEditChemi(info){
      this.editForm.chemi_name = info.chemi_name
      this.editForm.chemi_hazardLevel = info.chemi_hazardLevel
      this.editForm.chemi_defendReq = info.chemi_defendReq
      this.editForm.chemi_storageReq = info.chemi_storageReq
      this.editForm.chemi_transReq = info.chemi_transReq
      this.editForm.chemi_abandonReq = info.chemi_abandonReq
      this.editProperVisible = true
    },
    editRow(){
      this.$refs.editFormRef.validate(async (valid) => {
        if(!valid) return ;
        let chemi_name = this.editForm.chemi_name
        const { data: res } = await this.$http.put('archives/changeChemiInfo',{editForm:this.editForm,chemi_name})
        if (res.meta.err == -1) return this.$message.error('修改化学品特性失败')
        this.$message.success('修改化学品特性成功')
        this.editProperVisible = false
        this.$refs.editFormRef.resetFields();
        this.getProperties()
      })
    },
    async removeChemi(chemi_name){
      const res = await this.$confirm('此操作将永久删除该化学品信息，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=> err )
      if(res !== "confirm") return ;
      const {data:result} = await this.$http.delete('archives/deleteChemiInfo',{params:{chemi_name}})
      if(result.meta.err == -1) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getProperties()
    }
  }
}
</script>

<style></style>
