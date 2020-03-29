<template>
  <div>
		 <el-card class="box-card">
    <el-button type="primary" @click="addProperVisible= true">添加存储数据</el-button>
    <!-- 危险辨识结果表 -->
    <table cellspacing="0" border="1" style="margin-top:20px;">
      <thead>
        <tr>
          <th width="5%">是否重大危险源</th>
          <th>区域</th>
          <th>物质</th>
          <th>设备</th>
          <th>数量</th>
          <th width="11%">单个物质存储量</th>
          <th>物质总存储量</th>
          <th>临界量</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
				 </el-card>
    <!-- 添加对话框 -->
    <el-dialog title="添加存储数据" :visible.sync="addProperVisible" width="55%">
   	 
      <el-form ref="addFormRef" :model="addForm">
				 <el-divider content-position="right" style="font-size:13px;">化学品存储区域</el-divider>
        <el-tag type="warning" style="width:100%;"><i class="el-icon-warning"></i>可以选择下拉框中的所选项，也可以自定义输入创建</el-tag>
				<el-form-item label="区域" :label-width="formLabelWidth" prop="major_unit" style="font-size:16px">  
          <el-select
            v-model="addForm.major_unit"
            filterable
            allow-create
            placeholder="请选择存储区域标签"
          >
            <el-option
              v-for="item in areaOptions"
              :key="item.major_unit"
              :label="item.major_unit"
              :value="item.major_unit"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-divider content-position="right" style="font-size:13px;">该区域存储的化学品信息</el-divider>
        <el-form-item
          v-for="(material,index) in addForm.materialInfo"
          :key="material.key"
          :label="'化学品信息'+(index+1)"
          :label-width="formLabelWidth"
          style="text-align:centers;font-size:16px"
					
        >
          <!-- //	:prop="'matrial.' + index + '.major_material'" -->
          <!-- :rules="{ required: true, message: '请输入邮箱地址', trigger: 'blur' }" -->
          <el-row :gutter="1">
            <el-input v-model="material.major_chemicals" placeholder="化学品名称" style="width:30%"></el-input>
            <span style="margin:0 1%">-</span>
            <el-input v-model="material.major_device" placeholder="设备" style="width:30%"></el-input>
            <span style="margin:0 1%">-</span>
            <el-input
              v-model="material.major_singleStorage"
              placeholder="该化学品存储量(吨)"
              style="width:27%"
            ></el-input>
            <span style="font-size:14px;margin:0 10px">
              <i class="el-icon-remove-outline iconAdd" @click="removeDomain(material)"></i>
            </span>
          </el-row>
        </el-form-item>
        <p style="font-size:14px;text-align:center">
          <i class="el-icon-circle-plus-outline iconAdd" @click="addDomain">添加化学品存储信息</i>
        </p>
        <!-- <div style="text-align"><el-link icon="el-icon-circle-plus-outline iconAdd">编辑</el-link></div> -->
        <el-form-item style="text-align:center"></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$refs.addFormRef.resetFields();addProperVisible = false">取 消</el-button>
        <el-button type="primary">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->

		 
  </div>
</template>

<script>
import InputMaterial from '@/components/globalChildComp/inputMaterial'
export default {
  data() {
    return {
      addProperVisible: false,
      formLabelWidth: '110px',
      addForm: {
        major_unit: '',
        materialInfo: [
          {
            major_chemicals: '',
            major_device: '',
            major_singleStorage: '',
            key: 1
          }
        ]
      },
      areaOptions: [
        {
          major_unit: 'HTML',
          label: 'HTML'
        },
        {
          major_unit: 'CSS',
          label: 'CSS'
        }
      ]
    }
  },
  methods: {
    removeDomain(item) {
      var index = this.addForm.materialInfo.indexOf(item)
      if (index !== -1) {
        this.addForm.materialInfo.splice(index, 1)
      }
    },
    addDomain() {
      this.addForm.materialInfo.push({
        major_chemicals: '',
        major_device: '',
        major_singleStorage: '',
        key: Date.now()
      })
    }
  }
}
</script>

<style>
.iconAdd:hover {
  color: #66b1ff;
}
</style>