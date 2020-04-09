<template>
  <div>
    <el-row :gutter="11" style="margin:10px 0 20px 0">
        <el-col :span="7">
          <el-input
            placeholder="请输入区域/化学品的全称或关键字"
            class="input-with-select"
            clearable
            @clear="getTableData"
            v-model="queryInfo.query"
          >
            <el-button slot="append" icon="el-icon-search" @click="getTableData"></el-button>
          </el-input>
        </el-col >
        <el-col :span="7" :offset="1">
          <el-button type="primary" @click="getUnitOptions">添加存储数据</el-button>
        </el-col>
      </el-row>
    <el-table
      :data="tableData"
      :span-method="arraySpanMethod"
      border
      :cell-style="cellStyle"
      :header-cell-style="rowClass"
    >
      <el-table-column prop="major_isRisk" label="是否重大危险源" width="95%"></el-table-column>
      <el-table-column prop="major_unit" label="区域"></el-table-column>
      <el-table-column prop="major_chemical" label="化学品/t"></el-table-column>
      <el-table-column prop="major_device" label="设备"></el-table-column>
      <el-table-column prop="major_num" sortable label="数量" width="100"></el-table-column>
      <el-table-column prop="major_singleStorage" label="单个物质存储量/t"></el-table-column>
      <el-table-column prop="major_totalStorage" label="总存储量/t"></el-table-column>
      <el-table-column prop="major_criticalMass" label="临界量/t"></el-table-column>
      <el-table-column label="操作" width="120">
        <template v-slot="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditForm(scope.row.major_unit,scope.$index)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              type="warning"
              icon="el-icon-delete"
              size="mini"
              @click="deleteData(scope.row.major_unit,'all')"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加对话框 -->
    <el-dialog title="添加存储数据" :visible.sync="addProperVisible" width="90%">
      <el-form ref="addFormRef" :model="addForm" label-width="100px">
        <el-divider content-position="right">化学品存储区域</el-divider>
        <el-tag type="warning" style="width:100%;">
          <i class="el-icon-warning"></i> 可以选择下拉框中提供的选项，也可以自定义输入创建
        </el-tag>
        <el-form-item
          label="区域"
          prop="major_unit"
          style="font-size:16px"
        >
          <el-select v-model="addForm.major_unit" filterable allow-create placeholder="请选择存储区域标签">
            <el-option
              v-for="item in unitOptions"
              :key="item.major_unit"
              :label="item.major_unit"
              :value="item.major_unit"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-divider content-position="right" style="font-size:13px;">该区域存储的化学品信息</el-divider>
        <el-form-item
          v-for="(chemical,index) in addForm.chemicalInfo"
          :key="chemical.key"
          :label="'化学品信息'+(index+1)"
          style="text-align:center;font-size:16px"
        >
          <el-row :gutter="1">
            <el-input v-model="chemical.major_chemical" placeholder="化学品名称" style="width:25%"></el-input>
            <span style="margin:0 1%">-</span>
            <el-input v-model="chemical.major_device" placeholder="设备(选填)" style="width:25%"></el-input>
            <span style="margin:0 1%">-</span>
            <el-input
              v-model="chemical.major_singleStorage"
              placeholder="该化学品存储量(吨)"
              style="width:20%"
            ></el-input>
            <span style="margin:0 1%">-</span>
              <el-input
              v-model="chemical.major_criticalMass"
              placeholder="临界量(吨)"
              style="width:20%"
            ></el-input>
            <span class="icon" style="color:red">
              <i class="el-icon-remove-outline" @click="removeDomain(chemical)"></i>
            </span>
          </el-row>
        </el-form-item>
        <el-form-item style="text-align:center">
        <p class= "icon"  @click="addDomain('add')">
          <i class="el-icon-circle-plus-outline">添加化学品存储信息</i>
        </p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addFormRef');addProperVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData(addForm,'add')">提 交</el-button>
      </span>
    </el-dialog>

    <!-- 修改数据对话框 -->
    <!--修改角色对话框-->
    <el-dialog title="修改角色信息" :visible.sync="editFormVisible" width="95%">
      <el-form ref="editFormRef" :model="editForm" label-width="100px">
        <el-form-item label="区域">
          <el-input v-model="editForm.major_unit" placeholder="区域名" width="25%"></el-input>
        </el-form-item>
      <el-form-item
        v-for="(chemical,index) in editForm.chemicalInfo"
        :key = "index"
        :label="'存储信息'+(index+1)"
        style="text-align:center"
      >
        <el-row :gutter="1">
            <el-input v-model="chemical.major_chemical" placeholder="化学品名称" style="width:25%"></el-input>
            <span style="margin:0 1%">-</span>
            <el-input v-model="chemical.major_device" placeholder="设备(选填)" style="width:25%"></el-input>
            <span style="margin:0 1%">-</span>
            <el-input
              v-model="chemical.major_singleStorage"
              placeholder="该化学品存储量(吨)"
              style="width:20%"
            ></el-input>
            <span style="margin:0 1%">-</span>
              <el-input
              v-model="chemical.major_criticalMass"
              placeholder="临界量(吨)"
              style="width:20%"
            ></el-input>
            <span class="icon" style="color:red">
              <i class="el-icon-remove-outline" @click="deleteOne(chemical)"></i>
            </span>
          </el-row>
      </el-form-item>
              <el-form-item style="text-align:center">
        <p class= "icon"  @click="addDomain('edit')">
          <i class="el-icon-circle-plus-outline">添加化学品存储信息</i>
        </p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false;resetForm('editFormRef')">取 消</el-button>
        <el-button type="primary" @click="editData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

  <script>
import InputMaterial from '@/components/globalChildComp/inputMaterial'
export default {
  data() {
    return {
      tableData:[],
      statistics: [
        {
          steps: 1,
          major_isRisk: 'true',
          major_areaName: '氯乙烯罐区',
          major_chemical: '氯乙烯',
          major_device: '球罐',
          major_num: 4,
          major_singleStorage: 4914,
          major_criticalMass: 50,
          major_totalStorage: 4914
        },
        {
          steps: 1,
          major_isRisk: 'true',
          major_areaName: '电石原料车间',
          major_chemical: '电石',
          major_device: '料仓',
          major_num: 1,
          major_singleStorage: 600,
          major_criticalMass: 1,
          major_totalStorage: 600
        },
        {
          steps: 4,
          major_isRisk: 'true',
          major_areaName: '乙炔车间',
          major_chemical: '乙炔',
          major_device: '系统',
          major_num: '',
          major_singleStorage: 0.312,
          major_criticalMass: 1
        },
        {
          major_isRisk: true,
          major_areaName: '乙炔车间',
          major_chemical: '乙炔',
          major_device: '气柜',
          major_num: '',
          major_singleStorage: 0.96,
          major_criticalMass: 1
        },
        {
          major_isRisk: true,
          major_areaName: '乙炔车间',
          major_chemical: '氨',
          major_device: '储罐',
          major_num: 3,
          major_singleStorage: 14.4,
          major_criticalMass: 1
        },
        {
          major_isRisk: true,
          major_areaName: '乙炔车间',
          major_chemical: '氨',
          major_device: '系统',
          major_num: '',
          major_singleStorage: 15.6,
          major_criticalMass: 10
        }
      ],
      majorSteps: [
        {
          major_name: '氯乙烯车间',
          steps: 1
        },
        {
          major_name: '电视原料车间',
          steps: 1
        },
        {
          major_name: '乙炔车间',
          steps: 4
        }
      ],
      addProperVisible: false,
      editFormVisible:false,
      formLabelWidth: '110px',
      addForm: {
        major_unit: '',
        chemicalInfo: [
          {
            major_chemical: '',
            major_device: '',
            major_singleStorage: '',
            major_criticalMass:'',
            key: 1
          }
        ]
      },
      unitOptions: [],
      editForm:{
        major_unit: '',
        chemicalInfo: []
      },
      queryInfo:{
        query:'',
        pageNum:1,
        pageSize:10
      }
  }
  },
  created() {
    this.getTableData() 
  },
  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },
    rowClass({ row, rowIndex }) {
      return 'text-align:center'
    },
   resetForm(refname) {
      this.$refs[refname].resetFields()
    },
    async getTableData(){
      let {data:res} = await this.$http.get('/hazard/getIdentifyResult',{params:{query:this.queryInfo.query}})
      if (res.meta.err == -1) this.$message.error('获取表格数据失败')
      this.tableData = res.identifyResult
      this.computeSpan()
  },
   computeSpan(){
      //unitIndex用于记录要把合并长度添加在这个数据出现的第一次的位置
      let oldUnit=this.tableData[0].major_unit,unitLength = 1,unitIndex=0
      for(let i = 0;i<this.tableData.length;i++){
        //当与上一行的数据相同，并且不为第一行（已经默认给第一行的长度设为1），说明这一行需要合并，合并行数加一
        if(this.tableData[i].major_unit==oldUnit && i!=0){
            unitLength++
            //当数据已经遍历到了尾部  
            if((i+1)===this.tableData.length){
              this.tableData[unitIndex].unitLength = unitLength
            }
        }
        //当数据与上一行的数据不相同，说明是不合并，可以为上一个需要合并的数据添加合并长度了
        else if(this.tableData[i].major_unit!=oldUnit){     
          //为这个数据出现的第一次的数据中添加需要合并的长度       
          this.tableData[unitIndex].unitLength = unitLength
          //重新赋值长度，数据和记录当前这个数据的位置（这是这个数据首次出现的位置）
          unitLength = 1
          unitIndex = i
          oldUnit = this.tableData[i].major_unit
        }
      }
      console.log(this.tableData)
    },
    //合并行要先判断rowIndex，合并列要先判断columnIndex！不能用data()中数据进行自增
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if(columnIndex===1 || columnIndex===8){
        if(row.unitLength){
          return [row.unitLength,1]
        }
        else
          return [0,0]
      }
    },
    async getUnitOptions() {
      // let { data: res } = await this.$http.get('/hazard/getUnitOptions')
      // if (res.meta.err == -1) this.$message.error('获取数据失败')
      // this.unitOptions = res.unitOptions
      this.addProperVisible = true
    },
     removeDomain(item) {
      //清除添加框
      var index = this.addForm.chemicalInfo.indexOf(item)
      if (index !== -1) {
        this.addForm.chemicalInfo.splice(index, 1)
      }
    },
    addDomain(type) { 
      //添加添加框
      if(type === 'add'){
        this.addForm.chemicalInfo.push({
          major_chemical: '',
          major_device: '',
          major_singleStorage: '',
          major_criticalMass:'',
          key: Date.now()
        })
      }
      else{
        this.editForm.chemicalInfo.push({
          major_chemical: '',
          major_device: '',
          major_singleStorage: '',
          major_criticalMass:'',
          key: Date.now()
        })
      }
      this.getTableData()
    },
    async addData(editForm,type){
      let {data:res} = await this.$http.post('/hazard/editChemical',{editForm,type})
      if (res.meta.err == -1) this.$message.error('提交数据失败')
      this.$refs.addFormRef.resetFields()
      this.getTableData()
      this.addProperVisible = false
    },
    async editData(){},
    showEditForm(unit,index){
      this.editForm.major_unit = unit
      for(let i=index;i<this.tableData.length;i++){
        if(this.tableData[i].major_unit == unit){
          let tForm = {
            major_chemical: this.tableData[i].major_chemical,
            major_device: this.tableData[i].major_device,
            major_singleStorage: this.tableData[i].major_singleStorage,
            major_criticalMass:this.tableData[i].major_criticalMass,
            key: i
          }
          this.editForm.chemicalInfo.push(tForm)
        }
      }
      this.editFormVisible=true
    },
    async deleteData(deleteData,type){
      const t = await this.$confirm(
        '此操作将永久删除该区域内所有存储信息, 是否继续?(如果要删除单个数据，请点击编辑操作)',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (t !== 'confirm') return
      if(type=='all'){
        let {data:res} = await this.$http.delete('/hazard/deleteChemical',{params:{deleteData,type}})
      }
      if(res.meta.err==-1) return this.$message.error('删除失败')
      this.$message.error('删除成功')
      // this.getTableData()
    },
    deleteOne(){
      //只删除区域里的一个信息
    }
    
  }
}
</script>

<style>
.icon{
  font-size:16px;
  margin-left:5px
}
.icon:hover {
  color: #66b1ff;
}
</style>