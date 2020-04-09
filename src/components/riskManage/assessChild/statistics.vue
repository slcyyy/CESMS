<template>
  <div>
    <el-card>
      <el-button type="primary" @click="addProperVisible= true">添加工作/步骤</el-button>
      <el-table
        :data="statistics"
        :span-method="arraySpanMethod"
        border
        :cell-style="cellStyle"
        :header-cell-style="rowClass"
      >
        <el-table-column prop="hazard_task" label="工作"></el-table-column>
        <el-table-column prop="hazard_step" label="步骤"></el-table-column>
        <el-table-column prop="hazard_name" label="危害"></el-table-column>
        <el-table-column prop="hazard_result" label="主要后果"></el-table-column>
        <el-table-column prop="hazard_frequency" sortable label="频率"></el-table-column>
        <el-table-column prop="hazard_measure" label="现有安全措施"></el-table-column>

        <el-table-column label="操作">
          <template v-slot="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditForm(scope.row.hazard_task)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                type="warning"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(scope.row.hazard_task)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="添加任务" :visible.sync="addProperVisible" width="95%">
      <el-form :model="addForm">
        <el-tag type="warning" style="width:100%;">
          <i class="el-icon-warning" style="font-size:16px;"></i> 可以选择下拉框中的所选项，也可以自定义输入创建
        </el-tag>

        <el-form-item label="工作" :label-width="formLabelWidth">
          <el-select v-model="addForm.hazard_task" filterable allow-create placeholder="请选择工作标签">
            <el-option
              v-for="item in hazardSteps"
              :key="item.hazard_task"
              :label="item.hazard_task"
              :value="item.hazard_task"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-divider content-position="right" style="font-size:13px;">该工作中各步骤的危害信息</el-divider>
        <el-form-item
          v-for="(child,index) in addForm.children"
          :key="child.key"
          :label="'危害信息'+(index+1)"
          :label-width="formLabelWidth"
          style="text-align:left;font-size:16px"
        >
				<div style="width:100%;display:flex;justify-content:center;wrap:wrap">
				<el-input v-model="addForm.children.hazard_steps" placeholder="步骤" style="width:20%"></el-input>
                    <span style="margin:0 1%">-</span>
									  <el-input v-model="addForm.hazard_name" placeholder="危害" style="width:30%"></el-input>
 <span style="margin:0 1%">-</span>
<el-input v-model="addForm.hazard_result" placeholder="主要后果" style="width:30%"></el-input>
						 <span style="margin:0 1%">-</span>
						<el-input v-model="addForm.hazard_frequency" placeholder="频率" style="width:8%"></el-input>
						 <span style="margin:0 1%">-</span>
							<el-input v-model="addForm.hazard_measure" placeholder="现有控制措施" style="width:30%"></el-input>
<span style="font-size:14px;margin:0 10px">
              <i class="el-icon-remove-outline iconAdd" @click="removeDomain(child)"></i>
            </span>
</div>
			
        </el-form-item>
        <p style="font-size:14px;text-align:center">
          <i class="el-icon-circle-plus-outline iconAdd" @click="addDomain">添加化学品存储信息</i>
        </p>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addProperVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProperVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      statistics: [
        {
          hazard_task: '氯乙烯单体回收贮槽维修',
          hazard_step: '设备排空',
          hazard_name: 'VCM抽不净;VCM排入大气',
          hazard_result: '有毒气体污染环境',
          hazard_frequency: 2,
          hazard_measure:
            '抽真空0.08MPa后，打开放空管阀门，空气补充继续抽真空2小时'
        },
        {
          hazard_task: '氯乙烯单体回收贮槽维修',
          hazard_step: '堵盲板',
          hazard_name: '盲板不合格或部位不对',
          hazard_result: 'VCM气体外泄污染环境',
          hazard_frequency: 3,
          hazard_measure: '用“眼镜型”盲板处理盲板作业单'
        },
         {
          hazard_task: 'test',
          hazard_step: '堵盲板',
          hazard_name: '盲板不合格或部位不对',
          hazard_result: 'VCM气体外泄污染环境',
          hazard_frequency: 3,
          hazard_measure: '用“眼镜型”盲板处理盲板作业单'
        },
         {
          hazard_task: 'test',
          hazard_step: '堵盲板',
          hazard_name: '盲板不合格或部位不对',
          hazard_result: 'VCM气体外泄污染环境',
          hazard_frequency: 3,
          hazard_measure: '用“眼镜型”盲板处理盲板作业单'
        },


      ],
      hazardSteps: [
        {
          hazard_task: '氯乙烯单体回收贮槽维修',
          steps: 2
        },
        {
          hazard_task:'test',
          steps:2
        }
      ],
      addProperVisible: false,
      oldTask: '',
      index: 0,  //用来记录当前遍历到的数组的下标
      addForm: {
        hazard_task: '',
        children: [
          {
            hazard_step: '',
            hazard_name: '',
            hazard_result: '',
            hazard_frequency: 0,
            hazard_measure: '',
            key: 1
          }
        ]
      },
      formLabelWidth: '80px'
    }
  },
  created() {
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      console.log(rowIndex,columnIndex)
      if (columnIndex === 0) {
        let i = this.index
        if (rowIndex === 0) {
          this.oldTask = row.hazard_task
          return [this.hazardSteps[i].steps, 1]
        } 
        if (row.hazard_task == this.oldTask) {
          return [0, 0]
        } else {
          this.index++ //只有不一样的时候才跳入下一个元素
          this.oldTask = row.hazard_task
          return [this.hazardSteps[i].steps, 1]
        }
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'
    },

    rowClass({ row, rowIndex }) {
      return 'text-align:center'
    },
    showEditForm(index) {},
    deleteUser(index) {
      console.log(index)
    },
    removeDomain(child) {
      var index = this.addForm.children.indexOf(child)
      if (index !== -1) {
        this.addForm.children.splice(index, 1)
      }
    },
    addDomain() {
      this.addForm.children.push({
        hazard_step: '',
        hazard_name: '',
        hazard_result: '',
        hazard_frequency: 0,
        hazard_measure: '',
        key: Date.now()
      })
    }
  }
}
</script>


<style>
</style>
