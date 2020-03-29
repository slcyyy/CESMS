<template>
  <div>
		<el-tag type="warning" style="width:100%;">选择两个下拉框之一,查看"填表人"/"企业"填写状态</el-tag>
    <el-row>
			<el-col :span="3"  style="marign-top:-20px">
				<p>查看专家填写状态:</p>
			</el-col>
      <el-col :span="5" mar>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3"	>
         <el-button type="primary"  @click="dialogFormVisible = true"  icon="el-icon-search"></el-button>
      </el-col>
    </el-row>

       <el-row>
				 	<el-col :span="3" style="marign-top:-5px">
				<p >查看企业填写状态:</p>
			</el-col>
      <el-col :span="5">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
         <el-button type="primary"  @click="dialogFormVisible = true"  icon="el-icon-search"></el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {}
</script>

<style>
</style>