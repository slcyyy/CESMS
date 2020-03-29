<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>企业评分</el-breadcrumb-item>
      <el-breadcrumb-item>查看打分情况</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card class="box-card">
		<!-- 选择企业查看评分结果 -->
      <el-select v-model="value" placeholder="请选择公司">
        <el-option
          v-for="item in companyList"
          :key="item.company_id"
          :label="item.company_name"
          :value="item.company_id"
					@change="getScore"
        ></el-option>
      </el-select>

	  <!-- 评分结果表 -->
      <table border="1" id="scoreTable">
        <caption style="font-weight:bold;margin:10px 0;font-size:1.5em;">XXXCOMPANY评分结果</caption>
        <thead>
          <tr>
            <th>检查项</th>
            <th>实得分</th>
            <th>满分</th>
            <th>得分率</th>
          </tr>
        </thead>
        <tbody>
          <!-- 如果没有获取到得分信息 -->
          <tr v-if="!scoreInfo">
            <td colspan="4">暂无数据</td>
          </tr>
          <!-- template不会被渲染 -->
          <!-- key以便它能跟踪每个节点的身份，从而重用和重新排序现有元素 -->
          <template v-for="(item,index) in scoreInfo">
            <tr :key="item.tableId">
              <td colspan="4" style="font-weight:bold;">{{item.tableName}}</td>
            </tr>
            <tr v-for="value in item.children" :key="value.itemId">
              <td>{{value.itemId}}</td>
              <td>{{value.itemRealScore}}</td>
              <td>{{value.itemFullScore}}</td>
              <td>{{value.itemScoreAverage}}</td>
            </tr>
            <tr v-if="(index!=scoreInfo.length-1)" :key="index">
              <td>小计</td>
              <td>{{item.subRealScore}}</td>
              <td>{{item.subFullScore}}</td>
              <td>{{item.itemScoreAverage}}</td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <td>总分</td>
            <td>{{totalCount.totalRealScore}}</td>
            <td>{{totalCount.totalFullScore}}</td>
            <td>{{totalCount.totalScoreAverage}}</td>
          </tr>
        </tfoot>
      </table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scoreInfo: [
        {
          tableId: 1,
          tableName: '1 安全基础管理安全风险隐患排查表',
          children: [
            {
              itemId: '1.1',
              itemRealScore: 32,
              itemFullScore: 50,
              itemScoreAverage: '23.3%'
            },
            {
              itemId: '1.2',
              itemRealScore: 32,
              itemFullScore: 50,
              itemScoreAverage: '23.3%'
            }
          ],
          subRealScore: 64,
          subFullScore: 100,
          subScoreAverage: '43.3%'
        },
        {
          tableId: 2,
          tableName: '2 设计与总图安全风险隐患排查表',
          children: [
            {
              itemId: '2.1',
              itemRealScore: 32,
              itemFullScore: 50,
              itemScoreAverage: '23.3%'
            },
            {
              itemId: '2.2',
              itemRealScore: 32,
              itemFullScore: 50,
              itemScoreAverage: '23.3%'
            }
          ],
          subRealScore: 64,
          subFullScore: 100,
          subScoreAverage: '43.3%'
        }
      ],
      totalCount: {
        totalRealScore: 123,
        totalFullScore: 200,
        totalScoreAverage: '32.44%'
			},
			companyList:[],
			value:''
    }
	},
	created(){
     this.getCompanyList()
	},
  methods:{
	  async getCompanyList(){
		  const {data:res}=await this.$http.get('/grade/getCompanyList')
				if (res.meta.err == -1) return this.$message.error('获取公司列表失败')
				this.companyList = res.companyInfo
				console.log(this.companyList)
		},
		 getScore(){
      console.log('haha')
		}
  }
}
</script>

<style>
#scoreTable td,
th {
  height: 2em;
}
</style>