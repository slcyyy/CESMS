<template>
  <div>
    <!--面包屑导航-->
    <BreadCrumbNavi>
      <template #secondPath>企业评分</template>
      <template #thirdPath>查看评分结果</template>
    </BreadCrumbNavi>

    <!--卡片视图-->
    <el-card class="box-card">
      <!-- 选择企业查看评分结果 -->
      <el-row>
        <el-select v-model="value" @change="getScore" placeholder="请选择公司">
          <el-option
            v-for="(item,index) in companyList"
            :key="index"
            :label="item.company_name"
            :value="item.company_id"
          ></el-option>
        </el-select>
        <el-button style="margin-left:70%" type="primary" @click="exportExcel" v-show="show">导出评分结果</el-button>
      </el-row>
      <!-- 评分结果表 -->
      
      <!-- v-if="scoreInfo" -->
      <div class="scrolldiv" style="margin-top:30px;height:390px;color:#4F5154" v-show="show">
        <div v-if="!show"><p>{{msg}}</p></div>
        <table border="1" id="scoreTable" v-if="show">
          <caption style="font-weight:bold;margin:10px 0;font-size:1.5em;">{{tableName}}</caption>
          <thead>
            <tr>
              <th>检查项</th>
              <th>实得分</th>
              <th>满分</th>
              <th>得分率</th>
            </tr>
          </thead>
          <tbody>
            <!-- template不会被渲染 -->
            <!-- key以便它能跟踪每个节点的身份，从而重用和重新排序现有元素 -->
            <template v-for="(item,index) in scoreInfo">
              <tr :key="item.tableId">
                <td colspan="4" style="font-weight:bold;font-size:16px;">{{item.title_name}}</td>
              </tr>
              <tr v-for="value in item.children" :key="value.itemId">
                <td>{{value.itemId}}</td>
                <td>{{value.realScore}}</td>
                <td>{{value.fullScore}}</td>
                <td>{{value.itemRate}}</td>
              </tr>
              <tr v-if="(index!=scoreInfo.length-1)" :key="index">
                <td style="font-weight:bold">小计</td>
                <td>{{item.subRealScore}}</td>
                <td>{{item.subFullScore}}</td>
                <td>{{item.subRate}}</td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4"></td>
            </tr>
            <tr>
              <td style="font-weight:bold">总分</td>
              <td>{{totalRealScore}}</td>
              <td>{{totalFullScore}}</td>
              <td>{{totalRate}}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </el-card>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi'

export default {
  data() {
    return {
      scoreInfo: [],
      totalRealScore: '',
      totalFullScore: '',
      totalRate: '',
      companyList: [],
      value: '',
      msg:'',
      show: false,
    }
  },
  computed: {
    tableName() {
      for (let i = 0; i < this.companyList.length; i++) {
        if (this.value == this.companyList[i].company_id) {
          return this.companyList[i].company_name + '评分结果'
        }
      }
    }
  },
  created() {
    this.getCompanyList()
  },
  components: {
    BreadCrumbNavi
  },
  methods: {
    async getCompanyList() {
      const { data: res } = await this.$http.get('/grade/getCompanyList')
      if (res.meta.err == -1) return this.$message.error('获取公司列表失败')
      this.companyList = res.companyInfo
    },
    async getScore() {
      const { data: res } = await this.$http.get('/grade/getScore', {
        params: { companyId: this.value }
      })
      if (res.meta.err == -1) return this.$message.error('获取得分数据失败')
      if (res.meta.err == 1) 
        return this.msg = "该公司的评分表还未有专家填写"
      this.scoreInfo = res.table
      this.totalRealScore = res.totalRealScore
      this.totalFullScore = res.totalFullScore
      this.totalRate = res.totalRate
      this.show = true
      console.log(this.scoreInfo)
    },
    sheet2blob(sheet, sheetName) {
      sheetName = sheetName || 'sheet1'
      var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
      }
      workbook.Sheets[sheetName] = sheet
      // 生成excel的配置项
      var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
      }
      var wbout = XLSX.write(workbook, wopts)
      var blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
      // 字符串转ArrayBuffer
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length)
        var view = new Uint8Array(buf)
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buf
      }
      return blob
    },
    openDownloadDialog(url, saveName) {
      if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url) // 创建blob地址
      }
      var aLink = document.createElement('a')
      aLink.href = url
      aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      var event
      if (window.MouseEvent) event = new MouseEvent('click')
      else {
        event = document.createEvent('MouseEvents')
        event.initMouseEvent(
          'click',
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        )
      }
      aLink.dispatchEvent(event)
    },
    // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
    exportExcel() {
      let title='';
      for (let i = 0; i < this.companyList.length; i++) {
        if (this.value == this.companyList[i].company_id) {
          title=this.companyList[i].company_name + '评分结果'
        }
      }
      let excel1 = [
        ['检查项','实际得分','满分','得分率']
      ]
      let merge=[]
      for(let i=0;i<this.scoreInfo.length;i++){
        let arr = [this.scoreInfo[i].title_name]
        excel1.push(arr)
        //s表示开始，e表示结束，r表示行，c表示列；A是0
        let obj = { s: { r: excel1.length-1, c: 0 }, e: { r: excel1.length-1, c: 3 } }
        merge.push(obj)
        for(let j=0;j<this.scoreInfo[i].children.length;j++){
          excel1.push(Object.values(this.scoreInfo[i].children[j]))
        }
      }
      let sheet = XLSX.utils.aoa_to_sheet(excel1)
      sheet['!merges'] = merge
      sheet['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }]
      sheet['!rows'] = []
      for(let i=0;i<excel1.length;i++){
        sheet['!rows'].push({ hpt: 20 })
      }
      this.openDownloadDialog(this.sheet2blob(sheet), `${title}.xlsx`)
    }
  }
}
</script>

<style>
#scoreTable {
  font-size: 16px;
  border: 1px solid #909399;
}
#scoreTable td,
th {
  height: 2em;
}
</style>