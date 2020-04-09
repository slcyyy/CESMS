<template>
  <div>
    <el-card>
      <p style="font-weight:bold;">工作危害分析法（JHA）等级判定：风险度R=可能性L×后果严重性S</p>
      <el-collapse v-model="activeName">
        <el-collapse-item title="可能性等级判断" name="1" >
          <el-table
            :data="LRule"
            border
            style="width:50%"
            :cell-style="cellStyle"
            :header-cell-style="rowClass"
          >
            <el-table-column prop="level" label="等级" width="200"></el-table-column>
            <el-table-column prop="frequency" label="频率"></el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="后果严重性等级判断" name="2">
          <el-table
            :data="SRule"
            border
            style="width: 100%"
            :cell-style="cellStyle"
            :header-cell-style="rowClass"
          >
            <el-table-column prop="level" label="等级" width="180"></el-table-column>
            <el-table-column prop="lawReq" label="法律、法规及其他要求"></el-table-column>
            <el-table-column prop="people" label="人" width="180"></el-table-column>
            <el-table-column prop="estate" label="财产（万元）" width="180"></el-table-column>
            <el-table-column prop="pollution" label="环境污染、资源消耗" width="180"></el-table-column>
            <el-table-column prop="image" label="企业形象" width="180"></el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="风险应对措施" name="3">
          <el-table
            :data="measureRule"
            border
            style="width: 100%"
            :cell-style="cellStyle"
            :header-cell-style="rowClass"
          >
            <el-table-column prop="R" label="风险度" width="120"></el-table-column>
            <el-table-column prop="level" label="等级" width="180"></el-table-column>
            <el-table-column prop="measure" label="应采取的行动/控制措施" width="450"></el-table-column>
            <el-table-column prop="period" label="实施期限" ></el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName:false,
      LRule: [
        {
          level: 1,
          frequency: '0-5'
        },
        {
          level: 2,
          frequency: '6-10'
        },
        {
          level: 3,
          frequency: '11-15'
        },
        {
          level: 4,
          frequency: '16-20'
        },
        {
          level: 5,
          frequency: '21-'
        }
      ],
      SRule: [
        {
          level: 1,
          lawReq: '完全符合',
          people: '无伤亡',
          estate: '无损失',
          stop: '没有停工',
          pollution: '没有污染',
          image: '形象没有受损'
        },
        {
          level: 2,
          lawReq: '不符合工厂的操作程序、规定',
          people: '轻微受伤、间歇不舒适',
          estate: '<10',
          stop: '受影响不大，几乎不停工',
          pollution: '装置范围污染',
          image: '企业及周边范围'
        },
        {
          level: 3,
          lawReq: '不符合集团公司的安全方针、制度、规定',
          people: '截肢、骨折、听力丧失、慢性病',
          estate: '<50',
          stop: '部分设备停工',
          pollution: '工厂范围内中等污染',
          image: '集团公司影响'
        },
        {
          level: 4,
          lawReq: '潜在违反法规',
          people: '丧失劳动',
          estate: '<=300',
          stop: '部分装置停工',
          pollution: '企业内严重污染',
          image: '地区内影响'
        },
        {
          level: 5,
          lawReq: '违反法律、法规',
          people: '发生死亡',
          estate: '>300',
          stop: '全系统停车',
          pollution: '大规模、企业外',
          image: '重大国内影响'
        }
      ],
      measureRule: [
        {
          R: '<4',
          level: '轻微或可忽略的风险',
          measure: '无需采用控制措施，但需要保存记录',
          period: '引起重视，日常岗检监管'
        },
        {
          R: '4~8',
          level: '可接受风险',
          measure: '可考虑建立操作规程、作业指导书，但需定期检查',
          period: '有条件、有经费时治理'
        },
        {
          R: '9~12',
          level: '中等风险',
          measure: '可考虑建立目标、建立操作规程，加强培训及沟通',
          period: '1~2年内治理'
        },
        {
          R: '15~16',
          level: '重大风险',
          measure:
            '采取紧急措施降低风险，建立运行控制程序，定期立即或近期整改检查、测量及评估',
          period: '立即或近期整改'
        },
        {
          R: '20~25',
          level: '巨大风险',
          measure: '在采取措施降低危害前，不能继续作业，对改进措施进行评估',
          period: '立刻整改'
        }
      ]
    }
  },
  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },

    rowClass({ row, rowIndex }) {
      return 'text-align:center'
    }
  }
}
</script>

<style>
</style>