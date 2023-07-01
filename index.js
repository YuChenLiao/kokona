import axios from "axios"
import { h } from 'zhin'
import fs from 'fs'

const { getImage } = require('./components/image')
module.exports = {
	name: 'kokona',
	/**
	* 
	* @param ctx {import('zhin').Context} zhin的上下文
	* @return dispose {import('zhin').Dispose|void}
	*/
	install(ctx) {
		ctx.command('攻略 <key:string>')
			.action(async ({ session }, key) => {
				let name = key
				const res = await ctx.request.get(`https://arona.diyigemt.com/api/v1/image?name=${name}`)
				const data = res.data
				console.log(data)
				if (data.length === 1) {
					const path = await getImage(data[0])
					if (fs.existsSync(path)) {
						console.log('文件存在');
					} else {
						console.error('文件不存在');
					}
					const bufferImg = fs.readFileSync(path)
					return h('image', { src: bufferImg })
				}
				else {
					let msg = ''
					for (let i = 0; i < data.length; i++) {
						msg += (i + 1) + '.' + data[i].name + '\n'
					}
					const id = await session.prompt.select(`未找到相关信息，是否在查找以下信息`, {
						child_type: "number",
						multiple: false,
						options: data.map((item, index) => ({
							label: `${index + 1}.${item.name}`,
							value: item
						}))
					})
					let item = id - 1
					const reCheck = await ctx.request.get(`https://arona.diyigemt.com/api/v1/image?name=${data[item].name}`)
					const reCheckData = reCheck.data
					const path = await getImage(reCheckData[0])
					if (fs.existsSync(path)) {
						console.log('文件存在');
					} else {
						console.error('文件不存在');
					}
					const bufferImg = fs.readFileSync(path)
					return h('image', { src: bufferImg })
				}
			})
	}
}