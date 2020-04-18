<template>
  <div class = "chart" >

		<div style="width:40%;height:400px;margin-top:-20px">
			<h1>危险源分布饼图:</h1>
		<div id="pie" style="width:100%;height:100%"></div>
		</div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  data() {
    return {
     pieData:[{value:2, name: '重大危险源'},
             {value: 2, name: '非重大危险源'}],
    }
  },
  mounted() {
    //此时页面上的元素，已经被渲染完毕了
    //基于准备好的DOM,初始化echarts实例
    //准备数据和配置项
	
	var pieChart =  echarts.init(document.getElementById('pie'))
		//准备数据和配置项
  var pie = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}'   //{d}占比
    },
    legend: {
        orient: 'vertical',
        left: 10,
        data: ['重大危险源','非重大危险源']  //类目值{b}
    },
    series: [
        {
            name: '危险单元',  //系列名称 {a}
            type: 'pie',
            radius: ['50%', '70%'],
						avoidLabelOverlap: false,
						top:-50,
						left:50,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            color:['#9AFF9A', '#EE4000'],
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: this.pieData
        }
    ]
};
 pieChart.setOption(pie)
	}
}
</script>

<style>
.chart{
	display: flex;
	flex-direction: row;
	flex-wrap:wrap;
  justify-content: space-around;
  max-height:400px;
  overflow:auto;
}

</style>
