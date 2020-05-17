<template>
  <div>
    <div>
        <el-select v-model="query" placeholder="请选择存储单元" clearable @change="getTableData">
          <el-option
            v-for="(item,index) in unitOptions "
            :key="index"
            :label="item.unit_name"
            :value="item.unit_id"
          ></el-option>
        </el-select>
    </div>

    <!-- 表格数据 -->
    <el-table
      :data="tableData"
      :span-method="arraySpanMethod"
      border
      :cell-style="cellStyle"
      :header-cell-style="rowClass"
      style="max-height:380px;overflow-y:auto"
    >
      <el-table-column label="是否重大危险源" min-width="30%">
        <template v-slot="scope">{{isRisk(scope.$index)}}</template>
      </el-table-column>
      <el-table-column label="单元">
        <template v-slot="scope">{{unitName(scope.$index)}}</template>
      </el-table-column>
      <el-table-column prop="chemi_name" label="化学品"></el-table-column>
      <el-table-column prop="chemi_device" label="设备" min-width="20%"></el-table-column>
      <el-table-column prop="chemi_allowance" label="单个物质存储量/吨" min-width="60%"></el-table-column>
      <el-table-column label="总存储量/吨" min-width="40%">
        <template v-slot="scope">{{totalStorage(scope.$index)}}</template>
      </el-table-column>
      <el-table-column prop="unit_S" label="S" min-width="30%"></el-table-column>
      <el-table-column prop="chemi_criticalMass" label="临界量/吨" min-width="40%"></el-table-column>
      <el-table-column label="操作" width="120">
        <template v-slot="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditForm(scope.$index)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改对话框 -->
    <el-dialog title="修改临界量信息" :visible.sync="editFormVisible" width="75%">
      <el-form ref="editFormRef" :model="editForm" label-width="100px">
        <el-form-item label="存储单元">
          <el-input v-model="editForm.chemi_unit" style="width:25%" disabled></el-input>
        </el-form-item>
        <p style="width:25%;color:#FDBE63">
          <i class="el-icon-warning"></i> 只允许修改临界量
        </p>
        <el-form-item
          v-for="(chemical,index) in editForm.chemicalInfo"
          :key="index"
          :label="'存储信息'+(index+1)"
        >
          <!-- 只允许修改临界量 -->
          <el-row :gutter="1">
            <el-input v-model="chemical.chemi_name" placeholder="化学品名称" style="width:25%" disabled></el-input>
            <span style="margin:0 1%">-</span>
            <el-input
              v-model="chemical.chemi_device"
              style="width:25%"
              disabled
            ></el-input>
            <span style="margin:0 1%">-</span>
            <el-input
              v-model="chemical.chemi_allowance"
              style="width:18%"
              disabled
            ></el-input>
            <span style="margin:0 1%" disabled>-</span>
            <el-input v-model="chemical.chemi_criticalMass" placeholder="临界量(吨)" style="width:18%"></el-input>
          </el-row>
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
import IdentifyChart from '@/components/riskManage/majorHazChild/identifyChart'
import bus from '@/plugins/bus'
export default {
  data() {
    return {
      buttonColor1: '#ecf5ff',
      buttonColor2: '#ffffff',
      showTable: true,
      showChart: false,
      tableData: [],
      addProperVisible: false,
      editFormVisible: false,
      formLabelWidth: '110px',
      addForm: {
        chemi_unitId: '',
        chemicalInfo: [
          {
            chemi_name: '',
            chemi_device: '',
            chemi_allowance: '',
            chemi_criticalMass: ''
          }
        ]
      },
      unitOptions: [],
      oldEditForm: {}, //用于在提交前判断是否更改，没有更改就进行数据库操作
      editForm: {
        chemi_unitId: '',
        chemi_unit: '',
        chemicalInfo: []
      },
      unit_S:'',
      query: '',
      changeId: [],
      radio: '1',
      editIndex: 0
    }
  },
  components: {
    IdentifyChart
  },
  created() {
    this.getTableData()
  },

  computed: {
    isRisk() {
      return function(i) {
        for (let j = 0; j < this.unitOptions.length; j++) {
          if (this.unitOptions[j].unit_id == this.tableData[i].chemi_unitId) {
            if (this.unitOptions[j].unit_isRisk > 0) return '是'
            else return '否'
          }
        }
      }
    },
    unitName() {
      return function(i) {
        let unitname = ''
        for (let j = 0; j < this.unitOptions.length; j++) {
          if (this.unitOptions[j].unit_id == this.tableData[i].chemi_unitId) {
            this.tableData[i].chemi_unit = this.unitOptions[j].unit_name
            return this.unitOptions[j].unit_name
          }
        }
      }
    },
    totalStorage() {
      return function(i) {
        let chemilen = this.tableData[i].chemiLength
        let total = 0
        for (let j = 0; j < chemilen; j++) {
          total += this.tableData[i + j].chemi_allowance
        }
        return total
      }
    }
  },

  methods: {
    switchData(type) {
      if (type == '1') {
        this.buttonColor1 = '#D1EEEE'
        this.buttonColor2 = '#ffffff'
        this.showTable = true
        this.showChart = false
      } else {
        this.buttonColor1 = '#FFFFFF'
        this.buttonColor2 = '#D1EEEE'
        this.showTable = false
        this.showChart = true
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },
    rowClass({ row, rowIndex }) {
      return 'text-align:center'
    },
    resetForm(refname) {
      this.$refs[refname].resetFields()
    },
    async getTableData() {
      let { data: res } = await this.$http.get('/hazard/IdentifyResult', {
        params: { query: this.query }
      })
      if (res.meta.err == -1) this.$message.error('获取表格数据失败')
      this.unitOptions = res.unitOptions
      this.computeSpanUnit(res.identifyResult)
      this.computeSpanChemi(res.identifyResult)
      this.tableData = res.identifyResult
      console.log('所有的单元格是:', this.tableData)
    },

    computeSpanUnit(table) {
      //chemiIndex用于记录要把合并长度添加在这个数据出现的第一次的位置
      let oldUnit = table[0].chemi_unitId,
        unitLength = 1,
        chemiIndex = 0,
        unitIndex = 0
      if (table.length == 1) {
        table[0].unitLength = 1
        table[0].unit_S = this.unitOptions[0].unit_S
      }
      for (let i = 0; i < table.length; i++) {
        //合并存储单元
        //当与上一行的数据相同，并且不为第一行（已经默认给第一行的长度设为1），说明这一行需要合并，合并行数加一
        if (table[i].chemi_unitId == oldUnit && i != 0) {
          unitLength++
          //当都是相同的数据已经遍历到了尾部
          if (i + 1 === table.length) {
            table[chemiIndex].unitLength = unitLength
            table[chemiIndex].unit_S = this.unitOptions[unitIndex].unit_S
          }
        }
        //当数据与上一行的数据不相同，说明是不合并，可以为上一个需要合并的数据添加合并长度了
        else if (table[i].chemi_unitId != oldUnit) {
          //为上一个数据出现的第一次的数据中添加需要合并的长度
          table[chemiIndex].unitLength = unitLength
          table[chemiIndex].unit_S = this.unitOptions[unitIndex].unit_S
          //重新赋值长度，数据和记录当前这个数据的位置（这是这个数据首次出现的位置）
          unitLength = 1
          chemiIndex = i
          oldUnit = table[i].chemi_unitId
          unitIndex++
          //当是不一样的数据已经遍历到了尾部,这条不一样的数据只有一条
          if (i + 1 === table.length) {
            //为这一个数据赋值合并的长度
            table[i].unitLength = unitLength
            table[i].unit_S = this.unitOptions[unitIndex].unit_S
            return
          }
        }
      }
    },
    computeSpanChemi(table) {
      let oldChemical = table[0].chemi_name
      let oldUnit = table[0].chemi_unitId
      let chemiLength = 1,
        chemiIndex = 0
      //直接从1开始循环
      if (table.length == 1) {
        table[0].chemiLength = chemiLength
        return
      }
      for (let i = 1; i < table.length; i++) {
        //同一个存储区域考虑
        if (table[i].chemi_unitId == oldUnit) {
          if (table[i].chemi_name === oldChemical) {
            chemiLength++
            if (i + 1 === table.length) {
              table[chemiIndex].chemiLength = chemiLength
            }
          }
          //table[j].chemi_unit == undefined ||
          else if (table[i].chemi_name != oldChemical) {
            table[chemiIndex].chemiLength = chemiLength
            oldChemical = table[i].chemi_name
            chemiLength = 1
            chemiIndex = i
            if (i + 1 === table.length) {
              table[chemiIndex].chemiLength = chemiLength
            }
          }
        } else {
          table[chemiIndex].chemiLength = chemiLength
          oldUnit = table[i].chemi_unitId
          oldChemical = table[i].chemi_name
          chemiIndex = i
          chemiLength = 1
          if (i + 1 === table.length) {
            table[chemiIndex].chemiLength = chemiLength
          }
        }
      }
    },
    //合并行要先判断rowIndex，合并列要先判断columnIndex！不能用data()中数据进行自增
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 1 ||
        columnIndex === 8 ||
        columnIndex === 6 ||
        columnIndex === 0
      ) {
        if (row.unitLength) {
          return [row.unitLength, 1]
        } else return [0, 0]
      }
      if (columnIndex === 2 || columnIndex === 7 || columnIndex === 5) {
        if (row.chemiLength) {
          return [row.chemiLength, 1]
        } else return [0, 0]
      }
    },
    async addUnitOptions() {
      let { data: res } = await this.$http.post('/hazard/editUnitRisk', {
        newUnit: this.unitOptions
      })
      if (res.meta.err == -1) this.$message.error('更新单元列表失败')
    },
    async getUnitOptions() {
      let { data: res } = await this.$http.get('/hazard/unitOptions')
      if (res.meta.err == -1) this.$message.error('获取单元列表失败')
    },
    showEditForm(index) {
      this.editIndex = index
      for (let i = 0; i < this.unitOptions.length; i++) {
        if (this.unitOptions[i].unit_id == this.tableData[index].chemi_unitId) {
          this.editForm.chemi_unit = this.unitOptions[i].unit_name
          this.editForm.chemi_unitId = this.unitOptions[i].unit_id
        }
      }
      //清空当前的编辑表单，重新载入该单元内的数据
      this.editForm.chemicalInfo.splice(0, this.editForm.chemicalInfo.length)
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].chemi_unitId == this.editForm.chemi_unitId) {
          let tForm = {
            chemi_name: this.tableData[i].chemi_name,
            chemi_device: this.tableData[i].chemi_device,
            chemi_allowance: this.tableData[i].chemi_allowance,
            chemi_criticalMass: this.tableData[i].chemi_criticalMass
          }
          this.editForm.chemicalInfo.push(tForm)
        }
      }
      //不能用...因为这里需要深拷贝
      let deepCopy = JSON.stringify(this.editForm)
      this.oldEditForm = JSON.parse(deepCopy)
      this.editFormVisible = true
    },

    async editData() {
      //判断是否进行修改，如果没有进行修改就不用继续进行数据库操作了
      if (JSON.stringify(this.editForm) == JSON.stringify(this.oldEditForm)) {
        this.editFormVisible = false
        return
      } 
      //用户进行了修改，要更改数据库
      else {
        let unitInfo = { unit_id: this.editForm.chemi_unitId }
        //当存储单元只存储了一个化学品时
        if(this.editForm.chemicalInfo.length==1){
          if(this.editForm.chemicalInfo[0].chemi_allowance>=this.editForm.chemicalInfo[0].chemi_criticalMass){
            //1为危险源 0 为非
             unitInfo.unit_isRisk = 1
             unitInfo.unit_S = '\\'
            //  this.tableData[this.editIndex].chemi_S = "\\"
          }
          else{
            unitInfo.unit_isRisk = 0
            unitInfo.unit_S = '\\'
          }
        }
        //当存储单元存储了2个及以上的相同化学品时
        else{
          //化学品都是同一种类
          if(this.tableData[this.editIndex].unitLength == this.editForm.chemicalInfo.length){
            if(this.editForm.chemicalInfo[0].chemi_allowance>=this.editForm.chemicalInfo[0].chemi_criticalMass){
             unitInfo.unit_isRisk = 1
             unitInfo.unit_S = '\\'
            }
            else{
              unitInfo.unit_isRisk = 0
              unitInfo.unit_S = '\\'
            }
          }
          //不同种类的化学品
          else{
            let S = 0
            for(let i=0;i<this.editForm.chemicalInfo.length;i++){
              S+=this.editForm.chemicalInfo[i].chemi_allowance/this.editForm.chemicalInfo[i].chemi_criticalMass
            }
            S = S.toFixed(3)
            if(S>=1)
            unitInfo.unit_isRisk = 1
            else
            unitInfo.unit_isRisk = 0
            S += ''
            unitInfo.unit_S = S
          }
        }
        let { data: res } = await this.$http.post('/hazard/editMajor', {
          editForm: this.editForm,
          unitInfo
        })
        if (res.meta.err == -1) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        // this.showEditForm(this.editForm.chemi_unit, 0)
        this.getTableData().then(asyncResult => {
          this.editFormVisible = false
          this.resetForm('editFormRef')
        })
      }
    },
    submitidentifyRes() {
      //上传辨识结果
      let risk = []
      this.tableData.forEach(item => {
        if (item.chemi_isRisk) {
          risk.push(item.chemi_unit)
        }
      })
    }
  }
}
</script>

<style>
.icon {
  font-size: 16px;
  margin-left: 15px;
}
.icon:hover {
  color: #66b1ff;
}
</style>