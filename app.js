const express = require('express')  //加载框架
const path = require('path') //加载path核心模块
const bodyParser = require('body-parser')  //解析post请求体
const session = require('express-session')  //加载session插件
const router = require('./router')

let app = express()  //实例化http服务器

//开放public,node_modules资源
//__dirname动态获取当前文件目录，用绝对路径以避免文件操作中的相对路径其他node目录下执行出错，模块路径不受影响
app.use('/public', express.static(path.join(__dirname, './public/'))) 
app.use('/node_modules', express.static(path.join(__dirname, './node_modules/')))  

//配置解析post请求体插件
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//配置模板引擎
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/'))

//配置session插件
app.use(session({
  secret: 'jojo',
  resave: false,
  saveUninitialized: true
}))

app.use(router)  //挂载路由

app.listen(3000, function(){
  console.log('app is running at port 3000...')
})

