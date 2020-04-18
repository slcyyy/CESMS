<template>
  <div class = "chart">
		<div style="width:45%;height:500px;">
			<h1>各活动的风险频率分布:</h1>
    	<div id="bar" style="width:100%;height:95%"></div>
		</div>
		<div style="width:45%;height:600px">
			<h1>各风险的频率及百分比:</h1>
		<div id="pie" style="width:100%;height:100%;"></div>
		</div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  data() {
    return {
      activeName: 'first'
    }
  },
  mounted() {
    //此时页面上的元素，已经被渲染完毕了
    //基于准备好的DOM,初始化echarts实例
    var barChart = echarts.init(document.getElementById('bar'))
    //准备数据和配置项
    var bar = {
      legend: {},
			tooltip: {},
      dataset: {
        dimensions: ['risk', '低风险', '中风险', '高风险', '极高风险'],
        source: [
          { risk: '进料', 低风险: 1, 中风险: 9, 高风险: 7, 极高风险: 2 },
          { risk: '出料', 低风险: 0, 中风险: 2, 高风险: 3, 极高风险: 1 },
          { risk: '投料', 低风险: 1, 中风险: 6, 高风险: 5, 极高风险: 0 },
          { risk: '使用叉车', 低风险: 1, 中风险: 4, 高风险: 3, 极高风险: 5 }
				],
      },
      xAxis: { type: 'category' },
			yAxis: {},
      series: [
        { type: 'bar', color: '#9AFF9A' },
        { type: 'bar', color: '#87CEFA' },
        { type: 'bar', color: '#FFD700' },
        { type: 'bar', color: '#EE4000' }
      ]
    }
    //展示数据
    barChart.setOption(bar)
	
	var pieChart =  echarts.init(document.getElementById('pie'))
		//准备数据和配置项
  var pie = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} / {d}%'
    },
    legend: {
        orient: 'vertical',
        left: 10,
        data: ['低风险','中风险','高风险','极高风险']
    },
    series: [
        {
            name: '风险频率/百分比',
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
            color:['#9AFF9A','#87CEFA', '#FFD700', '#EE4000'],
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [
                {value: 15, name: '低风险'},
                {value: 49, name: '中风险'},
                {value: 30, name: '高风险'},
                {value: 5, name: '极高风险'},
            ]
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
	justify-content: space-around
}

</style>
