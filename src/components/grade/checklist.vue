<template>
  <div class="checklist">
      <h1>{{ companyName }}-{{ tableName }}</h1>
      <el-row style="margin-left:90%"> 
      <el-button type="warning" round  style="margin-bottom:10px" v-if="disabled" @click="disabled=false">修改</el-button> 
      </el-row>
    <el-form :model="arrData" ref="checklistForm" :rule="checklistRule">
      <el-table
        :data="checklistData"
        :span-method="arraySpanMethod"
        :show-header="false"
        align="center"
        border
        style="width: 100%;height:100%"
      >
        <!-- 子标题展开行 -->
        <el-table-column type="expand" label="序号" width="60px">
          <!-- 内容 这个是scope代表的是最外面那一行的全部数据 即代表这个子表中的所有内容-->
          <template slot-scope="scope">
            <!-- 表格中的数据是只取这个子表中一行的数据中children属性，所以能够显示出来 -->
            <el-table
              :data="scope.row.children"
              class="expand-table"
              border
              style="width:100%;height:100%"
            >
              <el-table-column prop="checklist_id" width="60px"></el-table-column>
              <el-table-column prop="checklist_content" label="排查内容"></el-table-column>
              <el-table-column prop="checklist_basis" label="排查依据" width="180px"></el-table-column>
              <el-table-column prop="checklist_method" label="检查方式" width="180px"></el-table-column>
              <el-table-column prop="checklist_status" label="检查情况" width="180px">
                <!-- 这个scope是单个children的数据了 -->
                <template slot-scope="scope2">
                  <el-form-item
                    :prop="
                      `checklistData.${scope.$index}.children.${scope2.$index}.checklist_status`
                    "
                    :rules="[
                      { required: true, message: '请填写', trigger: 'blur' }
                    ]"
                  >
                    <el-input
                      type="textarea"
                      autosize
                      placeholder="请输入检查情况"
                      v-model="scope2.row.checklist_status"
                      :disabled="disabled"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="问题" width="180px">
                <template slot-scope="scope2">
                  <el-form-item
                    :prop="
                      `checklistData.${scope.$index}.children.${scope2.$index}.checklist_question`
                    "
                    :rules="[
                      { required: true, message: '请填写', trigger: 'blur' }
                    ]"
                  >
                    <el-input
                      type="textarea"
                      autosize
                      placeholder="请输入问题"
                      v-model="scope2.row.checklist_question"
                      :disabled="disabled"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="建议" width="180px">
                <template slot-scope="scope2">
                  <el-form-item
                    :prop="
                      `checklistData.${scope.$index}.children.${scope2.$index}.checklist_advice`
                    "
                    :rules="[
                      { required: true, message: '请填写', trigger: 'blur' }
                    ]"
                  >
                    <el-input
                      type="textarea"
                      autosize
                      placeholder="请输入建议"
                      clearable
                      v-model="scope2.row.checklist_advice"
                      :disabled="disabled"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="得分" width="80px">
                <!-- 在这里面加的scope才是这一个内容表格所代表的一行 -->
                <template slot-scope="scope2">
                  <el-form-item
                    :prop="
                      `checklistData.${scope.$index}.children.${scope2.$index}.checklist_grade`
                    "
                    :rules="[
                      { required: true, message: '请填写', trigger: 'blur' }
                    ]"
                  >
                    <el-select v-model="scope2.row.checklist_grade" placeholder="请选择"  :disabled="disabled">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                       
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>

        <el-table-column prop="title_name" label="标题"></el-table-column>
      </el-table>
    </el-form>
    <el-row class="rightRow">
      <el-button type="danger" style="margin-right:30px;">危险按</el-button>
      <el-button type="primary" round @click="saveTable" style="margin-top:10px">提交</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      companyName: this.$route.query.company.split(',')[1],
      tableName: this.$route.query.table.split(',')[1],
      tableId: '',
      companyId: '',
      checklistData: [],
      arrData: {},
      checklistRule:{
        
      }, 
      options: [
        {
          value: '1',
          label: '1'
        },
        {
          value: '2',
          label: '2'
        },
        {
          value: '3',
          label: '3'
        },
        {
          value: '4',
          label: '4'
        },
        {
          value: '5',
          label: '5'
        }
      ],
      fill_userId: '',
      submitData: [],
      //当点击submit后stop>0时取消自动保存
      stop: 0,
      //存储自动保存次数,第一次的时候不保存
      coutn: 0,
      //整个页面渲染好的时间
      mountTime: '',
      //输入框是否能修改
      disabled:false,
      //记录是否是第一次提交
      isRecord:false
    }
  },
  created() {
    this.fill_userId = window.sessionStorage.getItem('userId')
    this.getChecklistData()
  },
  mounted() {
    if (!window.localStorage) {
      alert('浏览器不支持localstorage,请不要使用无痕浏览')
    } else {
      //自动保存数据
      console.log('已经挂在好饿了')
      var t1 = setTimeout(this.temporySaveTable(), 120000)
    }
  },
  methods: {
    //页面渲染前获取到评分表数据
    /*
     1.先要从localstorage中查看缓存
     2.从数据库中查看数据
    */
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) return [1, 7]
    },
    async getChecklistData() {
      //获取公司ID\表ID
      this.companyId = this.$route.query.company.split(',')[0]
      console.log(this.companyId)
      this.tableId = this.$route.query.table.split(',')[0]
      //2.从数据库中获取数据
      const { data: res } = await this.$http.get('grade/getChecklistData', {
        params: { checklist_pId: this.tableId, fill_userId: this.fill_userId,fill_companyId:this.companyId }
      })
      if (res.meta.err == -1) return this.$message.error('获取评分列表失败')
      //如果有填写记录则把所有输入框设为禁用
      if (res.record) {
         this.disabled = true
         this.isRecord = true
      } 
      this.checklistData = res.cTable
      this.arrData.checklistData = this.checklistData
      console.log(this.checklistData)
    },
    temporySaveTable() {
      try {
        if (this.stop > 0) {
          clearTimeout(t2)
        } else {
          if (this.count > 0) {
            this.handleData()
            localStorage.setItem('temporySave', this.submitData)
            //每隔两分钟保存一次数据
            var t2 = setTimeout(this.temporySaveTable, 120000)
            this.$message('自动保存成功')
            console.log(new Date().getMinutes())
          }

          this.count++
        }
      } catch (err) {
        console.log(err)
        this.$message('自动保存失败')
      }
    },
    //处理评分表填写数据
    handleData() {
      this.submitData = []
      //读取每一张子表
      for (let i = 0; i < this.checklistData.length; i++) {
        // 获取子表ID
        //每一张子表的对象
        let fillRecord = {}
        fillRecord.fill_cTableId = this.checklistData[i].title_id
        fillRecord.children = []
        //每张子表每一行的内容
        for (let j = 0; j < this.checklistData[i].children.length; j++) {
          let input = {}
          input.fill_itemId = this.checklistData[i]['children'][j].checklist_id
          input.fill_status = this.checklistData[i]['children'][j].checklist_status
          input.fill_question = this.checklistData[i]['children'][j].checklist_question
          input.fill_advice = this.checklistData[i]['children'][j].checklist_advice
          input.fill_grade = this.checklistData[i]['children'][j].checklist_grade
          fillRecord.children.push(input)
        }
        this.submitData.push(fillRecord)
        console.log(this.submitData)
      }
    },
    //提交填写的评分表数据
    saveTable() {
      this.$refs.checklistForm.validate(async valid => {
        if (!valid) 
           return this.$message.error('还有内容未填写！')
        console.log(valid)
        if(this.checklistData[0].children[0].length<=7){
           return this.$message.error('还有内容未填写！')
        }
        const fill_companyId = this.companyId
        const fill_fTableId = this.tableId
        //get time
        let d = new Date() //封装为当前代码执行时间2020-02-23T07:42:22.980Z
        let year = d.getFullYear()  //今年的年份 
        let month = d.getMonth()+1 //今天是几月,0表示1月 取值是0-11
        let day = d.getDate() //今天是几号 1就是1号 取值是1-31
        let hour = d.getHours() //现在几点
        let minute = d.getMinutes() //现在几分
        let seconds = d.getSeconds()  //现在几秒
        const fillTime = year+'/'+month+'/'+day+' '+hour+':'+minute
        //提交
        this.handleData()
        console.log(this.tableName)
        let { data: res } = await this.$http.post('/grade/saveChecklist', {
          submitTable: this.submitData,
          fill_userId:this.fill_userId,
          fill_companyId,
          fill_fTableId,
          fillTime,
          companyName:this.companyName,
          tableName:this.tableName
        })
        if (res.meta.err == -1) return this.$message.error('保存数据失败')
        this.disabled = true
        this.$message.success('保存数据成功')
        // if(t1)
        //  clearTimeout(t1)
      })
    }
  }
}
</script>

<style>
.checklist {
  margin: 10px 10px;
}
.rightRow {
  position: relative;
  margin-left: 80%;
}
</style>
