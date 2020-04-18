<template>
  <div>
			<p>依据标准文件： <el-link type="info"   href= "http://www.bzmfxz.com/Common/ShowDownloadUrl.aspx?urlid=0&id=214071" target="_blank">《危险化学品重大危险源辨识》(GB18218-2018)</el-link></p>
      <el-collapse v-model="activeName" class="scrolldiv">
        <el-collapse-item title="辨识依据" name="1" style="backgroud-color:#dddddd"> 
				  <p style="text-indent:2em">长期或临时生产、加工、使用或贮存危险化学品，且危险化学品的数量等于或超过临界量的单元均为危险化学品的重大危险源：</p>
					<p style="text-indent:2em">1.单元内存在的危险化学品为单一品种，则该危险化学品的数量即为单元内危险化学品的总量，若等于或超过相应的临界量，则定位重大危险源。</p>
					<p style="text-indent:2em">单元内存在的危险化学品为多品种时，则按下式计算，若>=1，则定为重大危险源,反之则为非重大危险源：</p>
					<p style="text-indent:2em">S=q1/Q1+q2/Q2+...+qn/Qn>=1</p>
        </el-collapse-item>
        <el-collapse-item title="分级依据" name="2">
          <p style="text-indent:2em"></p>
           <p style="text-indent:2em">对辨识出的重大危险源再进行危险等级评定,以R值作为重大危险源分级指标,按照如下公式和表格进行计算：</p>
           <p style="text-indent:2em">
             R=α×(β1*q1/Q1+β1*q2/Q2+...+βn*qn/Qn) 
           </p>
           <p style="text-indent:2em">校正系数α和等级判断如下表格所示(β的取值请下载文件《危险化学品重大危险源辨识》(GB18218-2018)》查看)：</p>
             <div class="horibox" style="justify-content:center">
              <img src="@/utils/image/α取值.png"/>
              <img src="@/utils/image/R值判断等级.png" /> 
              </div>
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