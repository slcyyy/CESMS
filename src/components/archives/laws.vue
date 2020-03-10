<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column prop="id" label="序号" sortable width="100"></el-table-column>
      <el-table-column prop="laws_name" label="法律法规名称"  width="180"></el-table-column>
      <el-table-column prop="date" label="标准编号"  width="180"></el-table-column>
      <el-table-column prop="date" label="生效日期"  width="180"></el-table-column>
      <el-table-column prop="date" label="颁布部门"  width="180"></el-table-column>
			<el-table-column prop="date" label="获取渠道"  width="180"></el-table-column>
      <el-table-column prop="name" label="识别日期"  width="180"></el-table-column>
      <el-table-column prop="date" label="使用部门"  width="180"></el-table-column>
			<el-table-column prop="address" label="备注" :formatter="formatter"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
       
      ]
    }
  },
  methods: {
    formatter(row, column) {
      return row.address
    }
  }
}
</script>

<style>
</style>	