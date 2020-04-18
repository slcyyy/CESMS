const riskMenu= [
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
			{id:33,name:'自定义安全计划表',path:'safetyPlan'}
		]
	}
]

export default riskMenu