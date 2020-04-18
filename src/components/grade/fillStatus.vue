<template>
  <div>
          <BreadCrumbNavi>
      <template #secondPath>企业评分</template>
      <template #thirdPath>查看填写状态</template>
    </BreadCrumbNavi>
    <el-card>

      <el-select v-model="value" placeholder="请选择" style="margin-top:10px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-table
    :data="tableData"
    height="400"
    border
    style="width: 100%;margin-top:30px">
    <el-table-column
      prop="date"
      label="公司"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="已填写"
      >
    </el-table-column>
    <el-table-column
      prop="address"
      label="进行中">
    </el-table-column>
  </el-table>
  </el-card>
   

  
  </div>
</template>

<script>
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi'
export default {
  data(){
    return{
      	options: [{
          value: '选项1',
          label: '小罗'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value:'',
        tableData: [{
          date: '国服',
          name: '安全基础管理安全风险隐患排查表',
          address: '无'
        }, {
          date:'阿里',
          name: '安全基础管理安全风险隐患排查表',
          address: '装置运行安全风险隐患排查表'
        }, {
          date: '腾讯',
          name: '安全基础管理安全风险隐患排查表 装置运行安全风险隐患排查表',
          address: '无'
        }]
    }
  },
  components:{
     BreadCrumbNavi
  }
}
</script>

<style>
</style>