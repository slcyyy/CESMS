import Vue from 'vue'
import {Button, TabPane} from 'element-ui'
import {Form,FormItem} from 'element-ui'
import {Input} from 'element-ui'
import {Message} from 'element-ui'
import {Header,Container,Main,Aside} from 'element-ui'
import {Menu,Submenu,MenuItemGroup,MenuItem} from 'element-ui'
import {Breadcrumb,BreadcrumbItem} from 'element-ui'
import {Card} from 'element-ui'
import {Row,Col} from 'element-ui'
import {Table,TableColumn,Tabs,Upload,Tag,Divider}  from 'element-ui'
import {Switch,Tooltip,Pagination,Dialog,Select,Option,MessageBox,Tree,Cascader}  from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Header)
Vue.use(Container)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Upload)
Vue.use(Tag)
Vue.use(Divider)
//把弹窗组件Message挂载到Vue的原型对象上
Vue.prototype.$message =  Message
//确认消息
Vue.prototype.$confirm = MessageBox.confirm