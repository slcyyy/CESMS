<template>
  <div>
    <el-alert title="双击打开模板进行编辑，点击右方的导出、删除按钮可以进行批量导出和删除" type="info" show-icon></el-alert>
    <el-row style="margin-left:90%;margin-top:10px">
      <el-tooltip content="导出模板" placement="top" style="margin-right:10px">
        <el-button type="primary" icon="el-icon-download" circle @click="exportData"></el-button>
      </el-tooltip>
      <el-tooltip content="删除" placement="top">
        <el-button type="danger" icon="el-icon-delete" circle @click="deleteData"></el-button>
      </el-tooltip>
    </el-row>
    <div class="HorizonBox" style="margin-top:20px;">
      <div class="planIcon"  v-for="(item,index) in planInfo" :key="index">
        <!-- 图标 -->
        <i class="el-icon-document" style="font-size:50px;" @dblclick="showPlan(item)"></i>
        <!-- 文字和checkbox -->
        <div class="HorizonBox" style="margin-top: 5px;">
          <el-checkbox v-model="item.checked" v-show="checkShow"></el-checkbox>
          <span style="padding-left:3px;">{{item.plan_title}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkShow: false,
      planInfo:[
        {
          checked: false,
          name:'模板1'
        },
        {
          checked:false,
          name:'模板2'
        }
      ],
     
      userId:''
    }
  },

  created(){
    this.getMyPlans()
  },
  methods:{
    async getMyPlans(){
      this.userId=window.sessionStorage.getItem('userId')
      let { data: res } = await this.$http.get('/plans/getPlan',{params:{userId:this.userId}})
      if (res.meta.err == -1) this.$message.error('获取数据失败')
      this.planInfo = res.plans
  
      this.planInfo.forEach(item=>{
        item.checked=false
      })
          console.log(this.planInfo)
    },
    showPlan(plan){
      this.$router.push({
        path: '/safetyPlan/editPlan',
        query: {
          userId:this.userId,
          planId:plan.plan_id,
          planTitle:plan.plan_title,
          tables:plan.plan_tables
        }
      })
    },
    exportData(){
      //如果没有显示checkbox
      if(!this.checkShow){  
        this.checkShow=!this.checkShow
      }
      //如果显示了则说明这一次的点击是为了提交数据
      else{
        this.checkShow=!this.checkShow
        //置位
        this.planInfo.forEach(item=>{
          if(item.checked)
            item.checked = false
        })
      }
    },
    deleteData(){
      if(!this.checkShow){
        this.checkShow=!this.checkShow
      }
      //如果显示了则说明这一次的点击是为了提交数据
      else{
        this.checkShow=!this.checkShow
        //置位
        this.planInfo.forEach(item=>{
          if(item.checked)
            item.checked = false
        })
      }
    }
  }
}
</script>

<style>
.HorizonBox {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
}
.planIcon {
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin:10px 20px;
}
.planIcon:hover {
  color: #66b1ff;
}
.rightRow {
  position: relative;
  margin-left: 80%;
}
</style>
