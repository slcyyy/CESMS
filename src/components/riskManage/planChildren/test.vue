exportExcel(){
      let tableData=[{col:'',col:'',col:'',col:'',col:'',col:''}]
      let excelDatas=[]
      for(let i=0;i<this.planData.children.length;i++){
        let filterVal=[]
        // let tableData=[]
        for(let j=0;j<this.planData.children[i].header.length;j++){
          filterVal.push('col')
          // tableData.push('')
        }
        let tableData={
          tHeader:this.planData.children[i].header,// sheet表一头部
          filterVal:filterVal,// 表一的数据字段
          tableDatas:tableData,// 表一的整体json数据
          sheetName:this.planData.children[i].tableName
        }
        excelDatas.push(tableData)
      }

       this.json2excel(excelDatas, this.planData.planTitle, true, "xlsx")
    },





    	try {
		let powerList = await Power.find({
			power_level: 0,
		}, {
			power_id: 1,
			power_name: 1,
			power_level: 1,
			_id: 0
		}, {
			lean: true
		})
		let second = await Power.find({
			power_level: 1
		}, null, {
			lean: true
		})
		for (let i = 0; i < powerList.length; i++) {
			powerList[i]['children'] = []
			for (let j = 0; j < second.length; j++) {
				if (second[j]['power_pId'] == powerList[i]['power_id']) {
					powerList[i]['children'].push(second[j])
				}
			}
		}
		let third = await Power.find({
			power_level: 2
		}, null, {
			lean: true
		})
		for (let i = 0; i < powerList.length; i++) {
			for (let j = 0; j < (powerList[i]['children']).length; j++) {
				powerList[i]['children'][j]['children'] = []
				for (let k = 0; k < third.length; k++) {
					if (third[k]['power_pId'] == powerList[i]['children'][j]['power_id']) {
						powerList[i]['children'][j]['children'].push(third[k])
					}
				}
			}
		}