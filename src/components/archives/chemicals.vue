<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="化学品特性" name="first">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="date" label="编号" width="180"></el-table-column>
          <el-table-column prop="name" label="化学品名" width="180"></el-table-column>
          <el-table-column prop="address" label="危害级别"></el-table-column>
          <el-table-column prop="address" label="控制和防护要求"></el-table-column>
          <el-table-column prop="address" label="存储要求"></el-table-column>
          <el-table-column prop="address" label="废弃要求"></el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <el-button @click.native.prevent="EditRow(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click.native.prevent="deleteRow()" type="text" size="small">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="化学品管理" name="second">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="date" label="编号" width="180"></el-table-column>
          <el-table-column prop="name" label="化学品名" width="180"></el-table-column>
          <el-table-column prop="address" label="特性"></el-table-column>
          <el-table-column prop="address" label="存储地点"></el-table-column>
          <el-table-column prop="address" label="余量"></el-table-column>
          <el-table-column prop="address" label="更新时间"></el-table-column>
          <el-table-column prop="address" label="更新记录"></el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <el-button @click.native.prevent="EditRow(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click.native.prevent="deleteRow(scope.row)" type="text" size="small">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="接触记录" name="third">接触记录</el-tab-pane>
      <el-tab-pane label="运输记录" name="fourth">运输记录</el-tab-pane>
      <el-tab-pane label="出入库记录" name="five">出入库记录</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //tabs卡片默认激活
      activeName: 'first',
      tableData: []
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    EditRow() {},
    deleteRow() {}
  }
}
</script>

<style></style>
