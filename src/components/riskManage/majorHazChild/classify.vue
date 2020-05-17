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

    <el-table
      :data="tableData"
      :span-method="arraySpanMethod"
      border
      :cell-style="cellStyle"
      :header-cell-style="rowClass"
      style="width:100%"
    >
      <el-table-column prop="unit_name" label="单元" min-width="25%">
        <template v-slot="scope">{{unitName(scope.$index)}}</template>
      </el-table-column>
      <el-table-column prop="unit_α" label="α" min-width="15%"></el-table-column>
      <el-table-column prop="chemi_name" label="化学品名" min-width="25%"></el-table-column>
      <el-table-column prop="chemi_device" label="设备" min-width="20%"></el-table-column>
        <el-table-column prop="chemi_allowance" label="单个物质存储量/吨" min-width="20%"></el-table-column>
      <el-table-column prop="chemi_criticalMass" label="临界量/吨" min-width="20%"></el-table-column>
      <el-table-column prop="chemi_β" label="β" min-width="15%"></el-table-column>
      <el-table-column prop="unit_R" label="R" min-width="15%"></el-table-column>
      <el-table-column prop="unit_level" label="重大危险源级别" min-width="25%">
        <template v-slot="scope">{{computeLevel(scope.$index)}}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="15%">
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
    <el-dialog title="修改分级信息" :visible.sync="editFormVisible" width="75%">
      <el-form ref="editFormRef" :model="editForm" label-width="100px">
        <p style="width:25%;color:#FDBE63">
          <i class="el-icon-warning"></i> 只允许校正系数
        </p>
        <el-form-item label="存储单元">
          <el-input v-model="editForm.chemi_unit" style="width:25%" disabled></el-input>
        </el-form-item>
         <el-form-item label="校正系数α">
          <el-input v-model="editForm.unit_α" placeholder="校正系数α" style="width:12%" ></el-input>
        </el-form-item>
        <el-form-item
          v-for="(chemical,index) in editForm.chemicalInfo"
          :key="index"
          :label="'存储信息'+(index+1)"
        >
          <el-row :gutter="1">
            <el-input v-model="chemical.chemi_name" placeholder="化学品名称" style="width:20%" disabled></el-input>
            <span style="margin:0 1%">-</span>
            <el-input
              v-model="chemical.chemi_device"
              style="width:20%"
              disabled
            ></el-input>
            <span style="margin:0 1%">-</span>
            <el-input
              v-model="chemical.chemi_allowance"
              style="width:15%"
              disabled
            ></el-input>
            <span style="margin:0 1%" >-</span>
            <el-input v-model="chemical.chemi_criticalMass" style="width:15%" disabled></el-input>
             <span style="margin:0 1%">-</span>
            <el-input v-model.number="chemical.chemi_β" placeholder="校正系数β" type="number" style="width:15%" ></el-input>
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
export default {
  data() {
    return {
      tableData: [],
      query: '',
      unitOptions: [],
      oldEditForm: {},
      editForm: {
        chemi_unitId: '',
        chemi_unit: '',
        unit_α:'',
        chemicalInfo: []
      },
      editIndex: 0,
      editFormVisible: false,
    }
  },
  computed: {
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
    },
    computeLevel() {
      return function(i) {
        if(this.tableData[i].unit_R>=100)
          return '一级'
        else if(this.tableData[i].unit_R>=50&&this.tableData[i].unit_R<100)
          return '二级'
        else if(this.tableData[i].unit_R>=10&&this.tableData[i].unit_R<50)
          return '三级'
        else 
          return '四级'
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
    async getTableData() {
      let { data: res } = await this.$http.get('/hazard/classifyResult', {
        params: { query: this.query }
      })
      if (res.meta.err == -1) this.$message.error('获取表格数据失败')
      this.unitOptions = res.unitOptions
      this.computeSpanUnit(res.classifyResult)
      this.computeSpanChemi(res.classifyResult)
      this.tableData = res.classifyResult
      console.log('所有的单元格是:', this.tableData)
      console.log(this.unitOptions)
    },
      computeSpanUnit(table) {
      //chemiIndex用于记录要把合并长度添加在这个数据出现的第一次的位置
      let oldUnit = table[0].chemi_unitId,
        unitLength = 1,
        chemiIndex = 0,
        unitIndex = 0
      if (table.length == 1) {
        table[0].unitLength = 1
        table[0].unit_R = this.unitOptions[0].unit_R
        table[0].unit_α = this.unitOptions[0].unit_α
      }
      for (let i = 0; i < table.length; i++) {
        //合并存储单元
        //当与上一行的数据相同，并且不为第一行（已经默认给第一行的长度设为1），说明这一行需要合并，合并行数加一
        if (table[i].chemi_unitId == oldUnit && i != 0) {
          unitLength++
          //当都是相同的数据已经遍历到了尾部
          if (i + 1 === table.length) {
            table[chemiIndex].unitLength = unitLength
            table[chemiIndex].unit_R= this.unitOptions[unitIndex].unit_R
            table[chemiIndex].unit_α= this.unitOptions[unitIndex].unit_α
          }
        }
        //当数据与上一行的数据不相同，说明是不合并，可以为上一个需要合并的数据添加合并长度了
        else if (table[i].chemi_unitId != oldUnit) {
          //为上一个数据出现的第一次的数据中添加需要合并的长度
          table[chemiIndex].unitLength = unitLength
          table[chemiIndex].unit_R= this.unitOptions[unitIndex].unit_R
          table[chemiIndex].unit_α= this.unitOptions[unitIndex].unit_α
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
    resetForm(refname) {
      this.$refs[refname].resetFields()
    },

    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 0 ||
        columnIndex === 1 ||
        columnIndex === 7 ||
        columnIndex === 8 ||
        columnIndex === 9
      ) {
        if (row.unitLength) {
          return [row.unitLength, 1]
        } else return [0, 0]
      }
      if (columnIndex === 5 || columnIndex === 6) {
        if (row.chemiLength) {
          return [row.chemiLength, 1]
        } else return [0, 0]
      }
    },
    showEditForm(index) {
      this.editIndex = index
      for (let i = 0; i < this.unitOptions.length; i++) {
        if (this.unitOptions[i].unit_id == this.tableData[index].chemi_unitId) {
          this.editForm.chemi_unit = this.unitOptions[i].unit_name
          this.editForm.chemi_unitId = this.unitOptions[i].unit_id
          this.editForm.unit_α = this.unitOptions[i].unit_α
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
            chemi_criticalMass: this.tableData[i].chemi_criticalMass,
            chemi_β:this.tableData[i].chemi_β
          }
          this.editForm.chemicalInfo.push(tForm)
        }
      }
      //不能用...因为这里需要深拷贝
      let deepCopy = JSON.stringify(this.editForm)
      this.oldEditForm = JSON.parse(deepCopy)
      this.editFormVisible = true
    },
    async editData(){
      if (JSON.stringify(this.editForm) == JSON.stringify(this.oldEditForm)) {
        this.editFormVisible = false
        return
      } 
       else {
          let unitInfo = { unit_id: this.editForm.chemi_unitId,unit_α:Number(this.editForm.unit_α) }
          let R = 0
          for(let i=0;i<this.editForm.chemicalInfo.length;i++){
             R+=this.editForm.chemicalInfo[i].chemi_β*(this.editForm.chemicalInfo[i].chemi_allowance/this.editForm.chemicalInfo[i].chemi_criticalMass)
          }
          unitInfo.unit_R = R*Number(unitInfo.unit_α)
        let { data: res } = await this.$http.post('/hazard/editClassify', {
          editForm: this.editForm,
          unitInfo
        })
        if (res.meta.err == -1) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.getTableData().then(asyncResult => {
          this.editFormVisible = false
          this.resetForm('editFormRef')
        })
      }
    }
  }
}
</script>

<style>
</style>