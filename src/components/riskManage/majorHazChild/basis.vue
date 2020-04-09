<template>
  <div>
    <!-- <el-card style="font-size:16px;"> -->
			<p>依据标准文件： <el-link href= "http://www.bzmfxz.com/Common/ShowDownloadUrl.aspx?urlid=0&id=214071" target="_blank">《危险化学品重大危险源辨识》(GB18218-2018)</el-link></p>
      <el-collapse v-model="activeName">
        <el-collapse-item title="辨识依据" name="1" style="backgroud-color:#dddddd"> 
				  <p style="text-indent:2em">长期或临时生产、加工、使用或贮存危险化学品，且危险化学品的数量等于
					或超过临界量的单元均为危险化学品的重大危险源：</p>
					<p style="text-indent:2em">1.单元内存在的危险化学品为单一品种，则该危险化学品的数量即为单元内
						危险化学品的总量，若等于或超过相应的临界量，则定位重大危险源。</p>
					<p style="text-indent:2em">单元内存在的危险化学品为多品种时，则按下式计算，若满足公式2-1，则定为重大危险源：</p>
					<p style="text-indent:2em">q1/Q1+q2/Q2+...+qn/Qn>=1</p>
        </el-collapse-item>
        <el-collapse-item title="分级依据" name="2">
          <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
          <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        </el-collapse-item>
        <el-collapse-item title="单元划分" name="3">
          <div>简化流程：设计简洁直观的操作流程；</div>
          <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
          <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
        </el-collapse-item>
      </el-collapse>
    <!-- </el-card> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: '1'
    }
  }
}
</script>

<style>
</style>