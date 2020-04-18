import Vue from 'vue'
import {Button, TabPane,Collapse,CollapseItem, ButtonGroup} from 'element-ui'
import {Drawer,Form,FormItem} from 'element-ui'
import {Input} from 'element-ui'
import {Message} from 'element-ui'
import {Header,Container,Main,Aside} from 'element-ui'
import {Menu,Submenu,MenuItemGroup,MenuItem} from 'element-ui'
import {Breadcrumb,BreadcrumbItem,Checkbox} from 'element-ui'
import {Card,Alert,OptionGroup} from 'element-ui'
import {Row,Col,PageHeader} from 'element-ui'
import {Table,TableColumn,Tabs,Upload,Tag,Divider,Radio,RadioButton,RadioGroup,Image}  from 'element-ui'
import {Switch,Tooltip,Pagination,Dialog,Select,Option,MessageBox,Tree,Cascader,Link}  from 'element-ui'
Vue.use(PageHeader)
Vue.use(Image)
Vue.use(ButtonGroup)
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
Vue.use(Checkbox)
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
Vue.use(OptionGroup)
Vue.use(Option)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Upload)
Vue.use(Tag)
Vue.use(Divider)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Link)
Vue.use(Drawer)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Alert)
//把弹窗组件Message挂载到Vue的原型对象上
Vue.prototype.$message =  Message
//确认消息
Vue.prototype.$confirm = MessageBox.confirm