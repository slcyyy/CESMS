<template>
  <div>
    <BreadCrumbNavi>
      <template #secondPath>企业评分</template>
      <template #thirdPath>查看填写状态</template>
    </BreadCrumbNavi>
    <el-card>
      <el-select v-model="value" placeholder="请选择" style="margin-top:10px" @change="getFillRecord">
        <el-option
          v-for="(item,index) in expertList"
          :key="index"
          :label="item.user_name"
          :value="item.user_id"
        ></el-option>
      </el-select>

      <div v-if="showTable">
        <el-row style="margin-top:20px;font-size:14px;">
          <span style="margin-right:30px;color:red;">已完成:{{submitNum}}</span>
          <span style="color:green;">进行中:{{temporyNum}}</span>
          <el-tooltip content="刷新" placement="top">
            <el-button
              round
              type="warning"
              style="margin-left:83%;margin-top:-10px;font-size:16px;"
              @click="getFillRecord"
            >
              <i class="el-icon-refresh"></i>
            </el-button>
          </el-tooltip>
        </el-row>

        <el-table :data="fillStatus" border style="width: 100%" :height="370">
          <el-table-column prop="status_time" label="填写时间" width="180"></el-table-column>
          <el-table-column label="公司名称">
            <template v-slot="scope">{{companyName(scope.row.status_companyId)}}</template>
          </el-table-column>
          <el-table-column prop="status_tableName" label="表格名称"></el-table-column>
          <el-table-column prop="status_sate" label="填写状态" width="180">
            <template slot-scope="scope">{{computeState(scope.row.status_state)}}</template>
          </el-table-column>
          <el-table-column prop="oprate" label="操作" width="180">
            <template v-slot="scope">
              <el-tooltip content="查看评分表" placement="top">
                <el-button
                  type="success"
                  icon="el-icon-view"
                  size="mini"
                  @click="showChecklist(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi'
export default {
  data() {
    return {
      expertList: [],
      fillStatus: [],
      companyList: [],
      showTable:false,
      value: ''
    }
  },
  components: {
    BreadCrumbNavi
  },
  created() {
    this.getExpert()
    this.getCompanyList()
  },
  computed: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },
    rowClass({ row, rowIndex }) {
      return 'text-align:center'
    },
    computeState() {
      return function(state) {
        if (state == 1) {
          return '已完成'
        } else return '进行中'
      }
    },
    companyName() {
      return function(status_companyId) {
        let companyName = ''
        for (let i = 0; i < this.companyList.length; i++) {
          if (this.companyList[i].company_id == status_companyId) {
            companyName = this.companyList[i].company_name
            break
          }
        }
        return companyName
      }
    },
    submitNum() {
      let num = 0
      for (let i = 0; i < this.fillStatus.length; i++) {
        if (this.fillStatus[i].status_state == 1) num++
      }
      return num
    },
    temporyNum() {
      let num = 0
      for (let i = 0; i < this.fillStatus.length; i++) {
        if (this.fillStatus[i].status_state == 0) num++
      }
      return num
    }
  },
  methods: {
    async getExpert() {
      let { data: res } = await this.$http.get('/grade/expertList')
      this.expertList = res.expertList
    },
    async getFillRecord() {
      const { data: res } = await this.$http.get('/grade/getFillRecord', {
        params: { fill_userId: this.value }
      })
      if (res.meta.err == -1)
        return this.$message.error('获取该填表人填写记录失败')
      this.fillStatus = res.fillStatus
      this.showTable=true
    },
    async getCompanyList() {
      const { data: res } = await this.$http.get('/grade/getCompanyList')
      if (res.meta.err == -1)
        return this.$message.error('获取该填表人填写记录失败')
      this.companyList = res.companyInfo
      console.log(this.companyList)
    },
    showChecklist(info) {
      let companyName = ''
      for (let i = 0; i < this.companyList.length; i++) {
        if (this.companyList[i].company_id == info.status_companyId) {
          companyName = this.companyList[i].company_name
          break
        }
      }
      let routeUrl = this.$router.resolve({
        path: '/checklist',
        query: {
          company: info.status_companyId + ',' + companyName,
          table:
            info.status_tableName.split(' ')[0] + ',' + info.status_tableName,
          userId: this.value
        }
      })
      window.open(routeUrl.href, '_blank')
    }
  }
}
</script>

<style>
</style>