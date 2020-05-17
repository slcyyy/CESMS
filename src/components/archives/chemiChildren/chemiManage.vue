<template>
  <div>
    <el-row :gutter="25">
        <el-col :span="7">
          <el-input
            placeholder="请输入存储区域的全称或关键字"
            class="input-with-select"
            clearable
            v-model="query"
            @clear="getTableData"
            >
            <el-button slot="append" icon="el-icon-search" @click="getTableData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addProperVisible = true">添加化学品信息</el-button>
        </el-col>
      </el-row>
    <el-table :data="tableData" border :cell-style="cellStyle"
      :header-cell-style="rowClass" :span-method="arraySpanMethod" height="380" >
       <el-table-column prop="chemi_unitId" label="存储地点" width="180">
         <template v-slot="scope">
           {{unitName(scope.$index)}}
         </template>
       </el-table-column>
      <el-table-column prop="chemi_name" label="化学品名" ></el-table-column>
     <el-table-column prop="chemi_device" label="设备" ></el-table-column>
     <el-table-column prop="chemi_allowance" label="余量/吨" ></el-table-column>
      <el-table-column prop="chemi_total" label="总量/吨">
        <template v-slot="scope">
          {{totalStorage(scope.$index)}}
        </template>
      </el-table-column>
      <el-table-column prop="updataTime" label="更新时间" >
      </el-table-column>
      <el-table-column label="操作" width="100" v-if="disabletemp">
        <template slot-scope="scope">
          <!-- //@click.native.prevent是为了使用父组件的事件 -->
          <el-button @click ="showEditForm(scope.row.chemi_unitId)" type="text" size="medium">修改</el-button>
          <el-button @click="deleteData(scope.row.chemi_unitId,'all')" type="text" size="medium">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 添加对话框 -->
     <el-dialog title="添加化学品存储信息" :visible.sync="addProperVisible" width="80%">
      <el-form 
      ref="addFormRef" 
      :model="addForm" 
      label-width="100px" 
      style="text-align:left;">
        <el-divider content-position="right">化学品存储区域</el-divider>
          <p style="width:100%;color:#FDBE63">
          <i class="el-icon-warning"></i> 可以选择下拉框中提供的选项，也可以自定义输入创建标签
        </p>
        <el-form-item 
         label="存储单元"
         style="font-size:16px" 
         >
          <el-select v-model="addForm.chemi_unit" allow-create filterable placeholder="请选择存储区域标签">
            <el-option
              v-for="item in unitOptions"
              :key="item.unit_id"
              :label="item.unit_name"
              :value="item.unit_name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-divider content-position="right" style="font-size:13px;">该单元存储的化学品信息</el-divider>
        <el-form-item
          v-for="(chemical,index) in addForm.children"
          :key="index"
          :label="'化学品信息'+(index+1)"
        >
          <el-row>
            <el-input v-model="chemical.chemi_name" placeholder="化学品名称" style="width:30%"></el-input>
            <span style="margin:0 1%">-</span>
            <el-input v-model="chemical.chemi_device" placeholder="设备(选填)" style="width:30%"></el-input>
            <span style="margin:0 1%">-</span>
            <el-input
              type="number"
              v-model.number="chemical.chemi_allowance"
              placeholder="该化学品存储量(吨)"
              style="width:25%"
            ></el-input>
            <span class="icon" style="color:red">
              <i class="el-icon-remove-outline" @click="removeDomain(chemical,addForm)"></i>
            </span>
          </el-row>
        </el-form-item>
        <el-form-item style="text-align:center" label-width="0">
          <p class="icon" @click="addDomain('add')">
            <i class="el-icon-circle-plus-outline">添加化学品存储信息</i>
          </p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addFormRef');addProperVisible = false;">取 消</el-button>
        <el-button type="primary" @click="addData">提 交</el-button>
      </span>
    </el-dialog>

 <!-- 修改对话框 --> 
    <el-dialog title="修改化学品存储信息" :visible.sync="editProperVisible" width="60%">
      <el-form ref="editFormRef" :model="editForm" label-width="100px">
        <el-form-item label="存储单元">
          <el-input v-model="editForm.chemi_unit" style="width:40%" disabled></el-input>
        </el-form-item>
        <p style="width:100%;color:#FDBE63">
          <i class="el-icon-warning"></i> 如果要进行修改操作，请确保不再进行删除操作，否则会导致重新输入修改数据的后果
        </p>
        <el-form-item
          v-for="(chemical,index) in editForm.children"
          :key="index"
          :label="'存储信息'+(index+1)"
        >
        <!-- 只能修改单个化学品的存储量 -->
          <el-row :gutter="1">
            <el-input v-model="chemical.chemi_name" placeholder="化学品名称" style="width:30%"  ></el-input>
            <span style="margin:0 1%">-</span>
            <el-input v-model="chemical.chemi_device" placeholder="设备" style="width:30%" ></el-input>
            <span style="margin:0 1%">-</span>
            <el-input
              v-model.number="chemical.chemi_allowance"
              type="number"
              placeholder="该化学品存储量(吨)"
              style="width:25%"
            ></el-input>
              <span class="icon" style="color:red">
              <!-- 判断这个数据是否在原来的数据中，如果在说明是旧数据那就用删除标志，如果没在那就用移除标志 -->
              <i v-show="oldEditForm.children[index]!=undefined?true:false" class='el-icon-delete' @click="deleteData(chemical,'one',index)"></i>
              <i v-show="oldEditForm.children[index]!=undefined?false:true" class='el-icon-remove-outline' @click="removeDomain(chemical,editForm)"></i>
            </span>
          </el-row>
        </el-form-item>
         <el-form-item style="text-align:center;" label-width="0">
          <p class="icon"  @click="addDomain('edit')" >
            <i class="el-icon-circle-plus-outline">添加化学品存储信息</i>
          </p>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editProperVisible  = false;resetForm('editFormRef')">取 消</el-button>
        <el-button type="primary" @click="editData" >确 定</el-button>
      </div>
    </el-dialog>
   
   
  </div>
</template>

<script>
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi'
export default {
  data(){
    return{
      roleId:'',
      tableData:[],
      query:'',
      unitOptions:[],
      
      addProperVisible:false,
      addForm:{
        chemi_unitId:'',
        chemi_unit:'',
        children:[]
      },
      formLabelWidth: '100px',
      addRule:{
       chemi_name: [{required: true, message: '请输入化学品名', trigger: 'blur'}],
       chemi_property:[{required: true, message: '请输入化学品特性', trigger: 'blur'}],
       chemi_location:[{required: true, message: '请输入存储地点', trigger: 'blur'}],
       chemi_allowance:[{required: true, message: '请输入余量', trigger: 'blur'}],
       chemi_refreshTime: [{required: true, message: '请输入更新时间', trigger: 'blur'}],
       chemi_refreshRecord: [{required: true, message: '请输入更新记录', trigger: 'blur'}],
      },
      editProperVisible:false,
      oldEditForm:[],
      editForm:{
        chemi_unitId: '',
        chemi_unit:'',
        children:[]
      },
      disabletemp:true
    }
  },
      components:{
        BreadCrumbNavi,
    
      },
  created(){
    this.roleId = window.sessionStorage.getItem('roleId')
    if(this.roleId=='6')
      this.disabletemp =false
    //先获得Unit列表，这样好通过这个数组去模糊查询
    this.getUnitOptions()
    this.getTableData()
  },
  computed:{
    unitName(){
      return function(i){
        //从unit列表找到为unitID的名字
        let unitname=''
        for(let j=0;j<this.unitOptions.length;j++){
          if(this.unitOptions[j].unit_id==this.tableData[i].chemi_unitId){
            this.tableData[i].chemi_unit = this.unitOptions[j].unit_name
            return this.unitOptions[j].unit_name
          }
        }
      }
    },
    totalStorage(){
      return function(i){
         let chemilen = this.tableData[i].chemiLength
         let total = 0
         for(let j=0;j<chemilen;j++){
           total += this.tableData[i+j].chemi_allowance
         }
         return total
      }
    }
  },
  methods:{
     cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },
    rowClass({ row, rowIndex }) {
      return 'text-align:center'
    },
    resetForm(refname) {
      this.$refs[refname].resetFields()
    },
    async getUnitOptions(){
       const { data: res } = await this.$http.get('/archives/getUnitOptions')
       this.unitOptions = res.unitOptions
    },
     async getTableData(){
      //首先找到这个query的存储名称对应的Id
      let query = new RegExp(this.query)
      let arrUnitID=[] //满足条件的所有unitID
      //match当找到数组的时候会返回一个数组，里面是找到的数据
      for(let i=0;i<this.unitOptions.length;i++){
        if(this.unitOptions[i].unit_name.match(query) !=null){
          let obj = {chemi_unitId:this.unitOptions[i].unit_id} //以对象的方式插入进数组这样方便or查询
           arrUnitID.push(obj)
        }
      }
      const { data: res } = await this.$http.get('/archives/getChemiStorage',{params:{arrUnitID}})
      if (res.meta.err == -1)
        return this.$message.error('获取化学品管理列表失败')
      this.computeSpanUnit(res.chemiStorage)
      this.computeSpanChemi(res.chemiStorage)
      this.tableData = res.chemiStorage
      console.log(this.tableData)
    },
    computeSpanUnit(table) {
      //unitIndex用于记录要把合并长度添加在这个数据出现的第一次的位置
      let updataTime = this.unitOptions[0].unit_updataTime
      let k=0
      let oldUnit = table[0].chemi_unitId,
        unitLength = 1,
        unitIndex = 0
      if(table.length==1){
        table[0].unitLength = 1
      }
      for (let i = 0; i <table.length; i++) {
        //当与上一行的数据相同，并且不为第一行（已经默认给第一行的长度设为1），说明这一行需要合并，合并行数加一
        if (table[i].chemi_unitId == oldUnit && i != 0) {
          unitLength++
          //当都是相同的数据已经遍历到了尾部
          if (i + 1 === table.length) {
            table[unitIndex].unitLength = unitLength
            table[unitIndex].updataTime = updataTime
          }
        }
        //当数据与上一行的数据不相同，说明是到了一个新的区域，可以为上一个需要合并的数据添加合并长度了
        else if (table[i].chemi_unitId != oldUnit) {
          //为上一个数据出现的第一次的数据中添加需要合并的长度
          table[unitIndex].unitLength = unitLength
          table[unitIndex].updataTime = updataTime
          //重新赋值长度，数据和记录当前这个数据的位置（这是这个数据首次出现的位置）
          unitLength = 1
          unitIndex = i
          oldUnit = table[i].chemi_unitId
          updataTime = this.unitOptions[++k].unit_updataTime
          //当是不一样的数据已经遍历到了尾部,这条不一样的数据只有一条
          if (i + 1 === table.length) {
            //为这一个数据赋值合并的长度
            table[i].unitLength = unitLength
            table[unitIndex].updataTime = updataTime
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
     arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if ( columnIndex === 6 || columnIndex === 0 || columnIndex===5) {
        if (row.unitLength) {
          return [row.unitLength, 1]
        } 
        else return [0, 0]
      }
      if(columnIndex === 1 || columnIndex === 4 ){
        if(row.chemiLength){
          return [row.chemiLength,1]
        }
        else return [0,0]
      }
    },
    showEditForm(unitID){
      //获得当前存储区域的名称和ID,ID是为了好存入数据库
       for(let i=0;i<this.unitOptions.length;i++){
          if(this.unitOptions[i].unit_id == unitID){
            this.editForm.chemi_unit = this.unitOptions[i].unit_name
            this.editForm.chemi_unitId = this.unitOptions[i].unit_id
          }
        }
         //清空当前的编辑表单的所有化学品信息，重新载入该单元内的数据
      this.editForm.children.splice(0, this.editForm.children.length)
      //把这一个区域里的内容装入editForm中
       for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].chemi_unitId == this.editForm.chemi_unitId) {
          let tForm = {
            chemi_name: this.tableData[i].chemi_name,
            chemi_device: this.tableData[i].chemi_device,
            chemi_allowance: this.tableData[i].chemi_allowance,
          }
          this.editForm.children.push(tForm)
        }
      }
      //不能用...因为这里需要深拷贝
      let deepCopy = JSON.stringify(this.editForm)
      //使用一个数组来记录现在的状态，等会点确定时进行对比如果没有改变就不用再传入数据库
      this.oldEditForm = JSON.parse(deepCopy)
      this.editProperVisible=true
    },

    //表单动态移除数据
     removeDomain(item, form) {
      let index = form.children.indexOf(item)
      if (index !== -1) {
        form.children.splice(index, 1)
      }
    },
    //表单动态增加数据
    addDomain(type) {
      //如果是添加数据
      if (type === 'add') {
        this.addForm.children.push({
          chemi_name: '',
          chemi_device: '',
          chemi_allowance: '',
        })
      } else {
        //如果是修改数据
        this.editForm.children.push({
          chemi_name: '',
          chemi_device: '',
          chemi_allowance: '',
        })
      }
    },
     async deleteData(deleteData, type,index) {
      if (type == 'all') {
        let t = await this.$confirm(
          '此操作将永久删除该区域内所有存储信息, 是否继续?(如果要删除单个数据，请点击编辑操作)',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)
        if (t !== 'confirm') return
        //传入单元ID用以删除
        var { data: res } = await this.$http.delete('/archives/deleteStorage', {
          params: { deleteData, type }
        })
        if (res.meta.err == -1) return this.$message.error('删除失败')
        this.getTableData()
      }
      //从数据库中只删除这个区域里面的其中一项内容
      else if (type == 'one') {
          let t = await this.$confirm(
            '此操作将永久删除该存储区域内的此条存储信息, 是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).catch(err => err)
        if (t !== 'confirm') return
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth();//得到月份
        var date = now.getDate();//得到日期
        var day = now.getDay();//得到周几
        var hour = now.getHours();//得到小时
        var minu = now.getMinutes();//得到分钟
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        if (hour < 10) hour = "0" + hour;
        if (minu < 10) minu = "0" + minu;
        deleteData.updataTime = year+'/'+month+'/'+date+' '+hour+':'+minu
          //只删除一个时传入的是整一行的数据
          deleteData.chemi_unitId = this.editForm.chemi_unitId
          //从数据库中删除该数据
          var { data: res } = await this.$http.delete(
            '/archives/deleteStorage',
            {
              params: { deleteData, type}
            }
          )
          if (res.meta.err == -1) return this.$message.error('删除失败')
          this.getUnitOptions()
          this.getTableData()
          .then(data=>{
              this.showEditForm(this.editForm.chemi_unitId)
              this.$message.success('删除成功')
          })

        }
      },
       async editData() {
      //判断是否进行修改，如果没有进行修改就不用继续进行数据库操作了
      if (JSON.stringify(this.editForm) == JSON.stringify(this.oldEditForm)) {
        this.editProperVisible = false
        return
      } 
      else {
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth();//得到月份
        var date = now.getDate();//得到日期
        var day = now.getDay();//得到周几
        var hour = now.getHours();//得到小时
        var minu = now.getMinutes();//得到分钟
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        if (hour < 10) hour = "0" + hour;
        if (minu < 10) minu = "0" + minu;
        this.editForm.updataTime = year+'/'+month+'/'+date+'/'+' '+hour+':'+minu
        let { data: res } = await this.$http.put('/archives/putStorage', {
          editForm: this.editForm
        })
        if (res.meta.err == -1) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.getTableData().then(async res => {
          this.editProperVisible = false
        })
      }
    },
    async addData() {
      var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth();//得到月份
        var date = now.getDate();//得到日期
        var day = now.getDay();//得到周几
        var hour = now.getHours();//得到小时
        var minu = now.getMinutes();//得到分钟
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        if (hour < 10) hour = "0" + hour;
        if (minu < 10) minu = "0" + minu;
        this.addForm.updataTime = year+'/'+month+'/'+date+'/'+' '+hour+':'+minu
      let isNew = true
      for(let i=0;i<this.unitOptions.length;i++){
        if(this.addForm.chemi_unit == this.unitOptions[i].unit_name){
          this.addForm.chemi_unitId = this.unitOptions[i].unit_id
          isNew = false
          break;
        }
      }
      if(isNew){
        this.addForm.chemi_unitId = this.unitOptions.length+1
      }
      let { data: res } = await this.$http.post('/archives/addChemiStorage', {
        addForm: this.addForm,isNew
      })
      if (res.meta.err == -1) this.$message.error('提交数据失败')
      this.$message.success('添加存储信息成功')   
      this.getUnitOptions()
      this.getTableData()
      this.addProperVisible = false
      this.resetForm('addFormRef')
      this.addForm.chemi_unit = ''
      this.addForm.children.splice(0,this.addForm.children.length)
    },
  }
}
</script>

<style>
</style>