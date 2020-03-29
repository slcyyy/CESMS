<template>
  <div>
    <BreadCrumbNavi></BreadCrumbNavi>
    <div style="border:1px solid #DDDDDD">
      <el-card class="box-card">
        <input :model="formName" class="noBorderInput" type="text" placeholder="请输入表单标题" required />
        <input :model="description" class="noBorderInput" type="text" placeholder="请输入详细说明" />
      </el-card>
      <!-- 人员计划表 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>人员培训教育</span>
          <el-button style="float: right; padding: 3px 0;border:none" type="text" @click="changeDrawer=true"><i class="el-icon-more" style="color:#F5F5FE"></i></el-button>
        </div>
        <!-- style="margin-top:20px; -->
        <table cellspacing="0" border="1">
          <caption style="font-weight:bold;margin:10px 0;">人员培训教育</caption>
          <thead>
            <tr>
              <th>序号</th>
              <th>部门</th>
              <th>培训计划-项目</th>
              <th>培训计划-时间</th>
              <th>培训计划-内容</th>
              <th>考核结果</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </el-card>
      <!-- 设备检修 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>设备检修</span>
            <el-button style="float: right; padding: 3px 0;border:none" type="text"  @click="changeDrawer=true"><i class="el-icon-more" style="color:#F5F5FE"></i></el-button>
        </div>
        <!-- style="margin-top:20px; -->
        <table cellspacing="0" border="1">
          <caption style="font-weight:bold;margin:10px 0;">设备检修</caption>
          <thead>
            <tr>
              <th>序号</th>
              <th>部门</th>
              <th>检修计划-项目</th>
              <th>检修计划-时间</th>
              <th>检修计划-内容</th>
              <th>考核结果</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </el-card>
      <!-- 安全检查 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>安全检查</span>
  <el-button style="float: right; padding: 3px 0;border:none" type="text"  @click="changeDrawer=true"><i class="el-icon-more" style="color:#F5F5FE"></i></el-button>
        </div>
        <!-- style="margin-top:20px; -->
        <table cellspacing="0" border="1">
          <caption style="font-weight:bold;margin:10px 0;">安全检查</caption>
          <thead>
            <tr>
              <th>序号</th>
              <th>部门</th>
              <th>检查计划-项目</th>
              <th>检查计划-时间</th>
              <th>检查计划-内容</th>
              <th>考核结果</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </el-card>
      <!-- 自定义计划表样式卡片 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <input :model="diyName" class="noBorderInput" type="text" placeholder="请输入计划表名称" required />
          <el-button style="float: right; padding: 3px 0;border:none" type="text" @click="changeDrawer=true"><i class="el-icon-more" style="color:#F5F5FE"></i></el-button>
        </div>
        <!-- style="margin-top:20px; -->
        <table cellspacing="0" border="1">
          <caption style="font-weight:bold;margin:10px 0;">xxx</caption>
          <thead>
            <tr>
              <th>序号</th>
              <th>部门</th>
              <th>检查计划-项目</th>
              <th>检查计划-时间</th>
              <th>检查计划-内容</th>
              <th>考核结果</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </el-card>
    </div>
    <!-- 修改下拉框抽屉 -->
    <el-drawer
      title="我是标题"
      :with-header="false"
      :visible.sync="changeDrawer"
      direction="btt"
      style="text-align:center">
      <div class="drawerSelect" @click="style='border:1px solid #f5f5fe'"><p>删除表格</p></div>
      <div class="drawerSelect" @click="style='border:1px solid #f5f5fe'"> <p>新建行数</p></div>
      <div class="drawerSelect" @click="style='border:1px solid #f5f5fe'"><p>删除行数</p></div>      
    </el-drawer>
    <!-- 添加表格按钮 -->
    <el-button size="medium" round>
      <i class="el-icon-circle-plus" style="color: #66b1ff;" @click="addPlanDrawer=true">添加下一题</i>
    </el-button>
    <!-- 添加计划表抽屉 -->
    <el-drawer
    title="添加计划表"
    :with-header="false"
    :visible.sync="addPlanDrawer"
    direction="btt"
    >
    <div class="addBox" v-for="(name,index) in planName"
    :key=index
    >
     <el-button @click="createTable(name)">{{name}}</el-button>
    </div>
   </el-drawer>
    <!-- 添加自定义计划表弹框 -->
    <el-dialog title="新建自定义计划表" :visible.sync="diyDialogVisible" width="30%" center>
      <el-form label-position="left" label-width="80px" :model="diyForm">
        <el-form-item label="计划表标题">
          <el-input v-model="diyForm.name" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="表头">
          <el-input v-model="diyForm.header" placeholder="请输入表头（以空格分割）"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    

  </div>
</template>

<script>
import BreadCrumbNavi from '@/components/globalChildComp/breadCrumbNavi'
export default {
  data() {
    return {
      formName: '',
      diyName: '',
      diyDialogVisible: false,
      diyForm:{
        name:'',
        header:''
      },
      changeDrawer:false,
      addPlanDrawer:false,
      planName:['人员维修','设备检修','自定义计划表'],
    }
  },
  components: {
    BreadCrumbNavi
  },
  methods:{
    createTable(name){
     console.log(name)
    }
  }
}
</script>

<style>
.noBorder-input {
  border: none;
  outline: medium;
  border-bottom: 1px solid #F5F5FE
}
.drawer-select{
  width:80%;
  border:none;
}
.add-box{
  display: flex;
  flex-wrap:wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
}
</style>