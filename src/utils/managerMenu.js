const managerMenu= [
	{
		id:1,
		name:'个人管理',
		path:'users',
		children:[
			{id:11,name:'账号与安全',path:'account'},
			{id:12,name:'个人信息',path:'vertifyEmail'}
		]
	},
	{
		id:2,
		name:'档案管理',
		path:'archives',
		children:[
			{id:21,name:'危险化学品管理',path:'chemicals'},
			{id:22,name:'法律法规标准规范',path:'laws'},
			{id:23,name:'作业安全证',path:'orgnization'},
		]
	},
	{
		id:3,
		name:'风险管理',
		path:'risk',
		children:[
			{id:31,name:'重大危险源判断',path:'majorHazard'},
			{id:32,name:'风险评估',path:'hazardAssess'},
			{id:33,name:'自定义安全计划表',path:'hazardAssess'}
		]
	},
	{
		id:4,
		name:'企业评价',
		path:'grade',
		children:[	
			{id:41,name:'填写评分表',path:'fillTable'},
			{id:42,name:'查看填写状态',path:'getFillStatus'},
			{id:43,name:'导出企业评价内容',path:'getEvaluateContent'}, //specific fill status
			{id:44,name:'查看评分结果',path:'getScore'}, //last score
			{id:45,name:'导入评价表',path:'importEvaluateTable'}, 
			{id:46,name:'导出评价文档',path:'exportEvaluateDoc'} //word
		]
	},
	{
		id:5,
		name:'用户管理',
		path:'manager',
		children:[
			{id:51,name:'用户列表',path:'usersList'},
			{id:52,name:'权限列表',path:'roleList'},
		]	
	}
]

export default managerMenu