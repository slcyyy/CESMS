<template>
  <div>
    <!--面包屑导航-->
      <BreadCrumbNavi>
      <template #secondPath>企业评分</template>
      <template #thirdPath>查看评分结果</template>
    </BreadCrumbNavi>

    <!--卡片视图-->
    <el-card class="box-card " >
		<!-- 选择企业查看评分结果 -->
    <el-row>
      <el-select v-model="value" placeholder="请选择公司">
          <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
      </el-select>
       <el-button style= "margin-left:90%" type="primary">导出</el-button>
    </el-row>
	  <!-- 评分结果表 -->
    <div  class="scrolldiv" style="margin-top:20px;height:400px;">
      <table border="1" id="scoreTable" >
        <caption style="font-weight:bold;margin:10px 0;font-size:1.5em;">国服公司评分结果</caption>
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
      </div>
    </el-card>
  </div>
</template>

<script>
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi'
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
              itemRealScore: 48,
              itemFullScore: 65,
              itemScoreAverage: '73.83%'
            },
            {
              itemId: '1.2',
              itemRealScore: 32,
              itemFullScore: 50,
              itemScoreAverage: '64.00%'
            },
             {
              itemId: '1.3',
              itemRealScore: 51,
              itemFullScore: 65,
              itemScoreAverage: '78.4%'
            },
             {
              itemId: '1.4',
              itemRealScore: 32,
              itemFullScore: 50,
              itemScoreAverage: '64.00%'
            },
             {
              itemId: '1.5',
              itemRealScore: 34,
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
			 options: [{
          value: '选项1',
          label: '国服'
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
        value: ''
    }
	},
	created(){
     this.getCompanyList()
  },
  components:{
    BreadCrumbNavi
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