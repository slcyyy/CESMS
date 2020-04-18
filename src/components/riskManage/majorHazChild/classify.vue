<template>
  <div>
    <el-row :gutter="11" style="margin:10px 0 20px 0">
      <el-col :span="7">
        <el-input
          placeholder="请输入存储单元的全称或关键字"
          class="input-with-select"
          clearable
          @clear="getTableData"
          v-model="queryInfo.query"
        >
          <el-button slot="append" icon="el-icon-search" @click="getTableData"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!-- :span-method="arraySpanMethod" -->
    <el-table
      :data="table"
      :span-method="arraySpanMethod"
      border
      :cell-style="cellStyle"
      :header-cell-style="rowClass"
      style="width:100%"
    >
      <el-table-column prop="unit_name" label="单元" min-width="25%"></el-table-column>
      <el-table-column prop="unit_α" label="α" min-width="15%"></el-table-column>
      <el-table-column prop="chemi_name" label="化学品名" min-width="25%"></el-table-column>
      <el-table-column prop="unit_β" label="β" min-width="15%"></el-table-column>
      <el-table-column prop="unit_R" label="R" min-width="15%"></el-table-column>
      <el-table-column prop="unit_level" label="重大危险源级别" min-width="25%"></el-table-column>
      <el-table-column label="操作" min-width="15%">
        <template v-slot="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditForm(scope.row.major_unit,scope.$index)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import bus from '@/plugins/bus'

export default {
  data(){
    return{
      tableData:[],
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 10
      },
      identifyResult:[],
       table:[
      {
        unit_name:'乙炔车间',
        unit_α:'1.0',
        chemi_name:'乙炔',
        unit_β:1.5,
        unit_R:2.12,
        unit_level:'四级'
      },
      {
         unit_name:'乙炔车间',
        unit_α:'1.0',
        chemi_name:'氨',
        unit_β:2,
        unit_R:2.12,
        unit_level:'四级'
      },
      {
        unit_name:'合成车间',
        unit_α:'1.0',
        chemi_name:'聚乙烯',
        unit_β:1.5,
        unit_R:2.04,
        unit_level:'四级'
      }
    ],
    }
  },
  created(){
//     this.getTableData()
//      bus.$on('message', (e) => {
//        console.log(e)
// })
  },
  computed:{
    // computeR(){
    //   return function(i){
    //     return this.tableData[i].unit_L*this.tableData[i].unit_S
    //   }
    // },
  },
  methods:{
   
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },
    rowClass({ row, rowIndex }) {
      return 'text-align:center'
    },
     async getTableData(){
      let { data: res } = await this.$http.get('/hazard/classifyResult', {
        params: { query: this.queryInfo.query }
      })
      if (res.meta.err == -1) this.$message.error('获取表格数据失败')
      this.computeSpanUnit(res.classifyData)
      this.computeSpanChemi(res.classifyData)
      this.tableData = res.classifyData

      console.log(this.tableData)
    },
        computeSpanUnit(table) {
      //unitIndex用于记录要把合并长度添加在这个数据出现的第一次的位置
      let oldUnit = table[0].chemi_unitId,
        unitLength = 1,
        unitIndex = 0
      if(table.length==1){
        table[0].unitLength = 1
      }
      for (let i = 0; i <table.length; i++) {
        //合并存储单元
        //当与上一行的数据相同，并且不为第一行（已经默认给第一行的长度设为1），说明这一行需要合并，合并行数加一
        if (table[i].chemi_unitId == oldUnit && i != 0) {
          unitLength++
          //当都是相同的数据已经遍历到了尾部
          if (i + 1 === table.length) {
            table[unitIndex].unitLength = unitLength
          }
        }
        //当数据与上一行的数据不相同，说明是不合并，可以为上一个需要合并的数据添加合并长度了
        else if (table[i].chemi_unitId != oldUnit) {
          //为上一个数据出现的第一次的数据中添加需要合并的长度
          table[unitIndex].unitLength = unitLength
          //重新赋值长度，数据和记录当前这个数据的位置（这是这个数据首次出现的位置）
          unitLength = 1
          unitIndex = i
          oldUnit = table[i].chemi_unitId
          //当是不一样的数据已经遍历到了尾部,这条不一样的数据只有一条
          if (i + 1 === table.length) {
            //为这一个数据赋值合并的长度
            table[i].unitLength = unitLength
            return
          }
        }
      }
    },
    computeSpanChemi(table){
       let oldChemical = table[0].chemi_name
       let oldUnit = table[0].chemi_unitId
       let chemiLength = 1,chemiIndex = 0
       //直接从1开始循环
        if(table.length == 1){
          table[0].chemiLength = chemiLength
          return;
        }
      for (let i = 1; i < table.length; i++) {
        //同一个存储区域考虑
        if (table[i].chemi_unitId == oldUnit) {
          if(table[i].chemi_name === oldChemical){
            chemiLength++
            if((i+1)=== table.length){
               table[chemiIndex].chemiLength = chemiLength
            }
          }
          //table[j].chemi_unit == undefined || 
          else if(table[i].chemi_name != oldChemical){
            table[chemiIndex].chemiLength = chemiLength
            oldChemical =  table[i].chemi_name
            chemiLength = 1
            chemiIndex = i
            if((i+1)=== table.length){
             table[chemiIndex].chemiLength = chemiLength
            }
          }
        }
        else{
          table[chemiIndex].chemiLength = chemiLength
          oldUnit = table[i].chemi_unitId
          oldChemical = table[i].chemi_name
          chemiIndex = i
          chemiLength = 1
          if((i+1)=== table.length){
             table[chemiIndex].chemiLength = chemiLength
          }
        }
      }
    },
    resetForm(refname) {
      this.$refs[refname].resetFields()
    },
   
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
    
         if(columnIndex==0||columnIndex==5){
            if(rowIndex==0)
              return [2,1]
            if(rowIndex==1)
              return [0,0]
          }
   
    },
    showEditForm(){

    }
  }
}
</script>

<style>

</style>