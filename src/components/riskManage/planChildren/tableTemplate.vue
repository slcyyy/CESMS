<template>
  <div>
    <!-- 计划表 -->
    <el-card class="box-card">
      <el-table border style="width: 100%">
        <el-table-column  label="序号"></el-table-column>
        <el-table-column  label="部门"></el-table-column>
        <el-table-column  label="培训计划-项目" ></el-table-column>
        <el-table-column  label="培训计划-时间" ></el-table-column>
        <el-table-column  label="培训计划-内容" ></el-table-column>
        <el-table-column  label="考核结果" ></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>
// tableJson 导出数据 ; filenames导出表的名字; autowidth表格宽度自动 true or false; bookTypes xlsx & csv & txt
     json2excel (tableJson, filenames, autowidth, bookTypes) {
       //这个是引用插件
      import("@/vendor/Export2Excel").then(excel => {
        var tHeader = []
        var dataArr = []
        var sheetnames = []
        for (var i in tableJson) {
          tHeader.push(tableJson[i].tHeader)
          dataArr.push(this.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
          sheetnames.push(tableJson[i].sheetName)
        }
        excel.export_json_to_excel({
          header: tHeader,
          data: dataArr,
          sheetname: sheetnames,
          filename: filenames,
          autoWidth: autowidth,
          bookType: bookTypes
        })
      })
    },
    // 数据过滤，时间过滤
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === "timestamp") {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
<style>
</style>