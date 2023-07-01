// 引入 mongoose 
const mongoose = require('mongoose')

// 连接数据库，自动新建图片信息库，避免重复请求图片
mongoose.connect('mongodb://127.0.0.1:27017/works', {
  useNewUrlParser: true, // 避免“不建议使用当前URL字符串解析器”
  useUnifiedTopology: true, // 解决连接报错问题
})

mongoose.set('strictQuery', false)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB 连接错误：'))

module.exports = mongoose