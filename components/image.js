const { Image } = require('../models/localImage')
const https = require('https');
const fs = require('fs');
const path = require('path');

const saveDirectory = './data/image'
const absolutePath = path.resolve(saveDirectory);
console.log(absolutePath)

const baseImgUrl = 'https://arona.cdn.diyigemt.com/image'

const getImage = async (data) => {
  const item = await Image.findOne({
    name: data.name
  })
  if (!item) {
    // 确保保存目录存在
    if (!fs.existsSync(absolutePath)) {
      fs.mkdirSync(absolutePath);
    }
    // 提取图片文件名
    console.log('data.path:', data.path)
    const fileName = path.basename(`${baseImgUrl}${data.path}`);
    // 创建可写流
    const fileStream = fs.createWriteStream(path.join(absolutePath, fileName));
    // 发起 HTTP 请求
    const httpsync = await new Promise((resolve, reject) => {
      https.get(`${baseImgUrl}${data.path}`,(response) => {
        // 将响应管道到可写流
        response.pipe(fileStream);

        // 监听下载完成事件
        fileStream.on('finish', function () {
          fileStream.close();
          return resolve()
        });
      }).on('error', function (err) {
        console.error('下载图片时出现错误:', err);
        return reject()
      });
    })
    const imgPath = `${absolutePath}\\${fileName}`
    try {
      const items = await Image.create({
        name: data.name,
        hash: data.hash,
        path: imgPath
      })
      console.log('创建成功:')
      return items.path
    } catch (err) {
      console.log('创建失败:')
      return 'error'
    }
  } else {
    if (item.hash === data.hash) {
      return item.path
    }
    else {
      // 若数据库中已有数据则比较 hash 值，相同则直接本地读取，不同则再次请求并覆盖本地数据
      if (!fs.existsSync(absolutePath)) {
        fs.mkdirSync(absolutePath);
      }
      // 提取图片文件名
      const fileName = path.basename(`${baseImgUrl}?name=${data.name}`);
      // 创建可写流
      const fileStream = fs.createWriteStream(path.join(absolutePath, fileName));
      // 发起 HTTP 请求
      const httpsync = await new Promise((resolve, reject) => {
        https.get(`${baseImgUrl}${data.path}`,(response) => {
          // 将响应管道到可写流
          response.pipe(fileStream);
  
          // 监听下载完成事件
          fileStream.on('finish', function () {
            fileStream.close();
            return resolve()
          });
        }).on('error', function (err) {
          console.error('下载图片时出现错误:', err);
          return reject()
        });
      })
      const imgPath = `${absolutePath}\\${fileName}`
      try {
        const items = await Image.updateOne({
          name: item.name
        }, {
          name: data.name,
          hash: data.hash,
          path: imgPath
        })
        console.log('更新成功:')
        return items.path
      } catch (err) {
        console.log('更新失败:', err)
        return 'error'
      }
    }
  }
}

module.exports = { getImage }