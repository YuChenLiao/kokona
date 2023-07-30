import { h } from 'zhin'
import fs from 'fs'
import getImage from './components/image'
module.exports = {
	name: 'kokona',
	/**
	* 
	* @param ctx {import('zhin').Context} zhin的上下文
	* @return dispose {import('zhin').Dispose|void}
	*/
	install(ctx) {
		ctx.command('攻略 <key:string>')
			.desc('查询主线地图、hard地图、学生以及活动攻略，未实装学生请勿查询')
			.action(async ({ session }, key) => {
				let name = key
				console.log('用户id:',session.user_id)
				const res = await ctx.request.get(`https://arona.diyigemt.com/api/v1/image?name=${name}`)
				const data = res.data
				if (data.length === 1) {
					const path = await getImage(data[0])
					if (fs.existsSync(path)) {
						console.log('文件存在');
					} else {
						console.error('文件不存在');
					}
					try {
						const bufferImg = fs.readFileSync(path)
						return h('image', { src: bufferImg })
					} catch (error) {
						console.log('错误：', error)
					}
				}
				else {
					let msg = ''
					for (let i = 0; i < data.length; i++) {
						msg += data[i].name + '\n'
					}
					const id = await session.prompt.select(`未找到相关信息，是否在查找以下信息,请输入序号查找`, {
						child_type: "number",
						multiple: false,
						options: data.map((item, index) => ({
							label: `${item.name}`,
							value: item
						}))
					})
					const reCheck = await ctx.request.get(`https://arona.diyigemt.com/api/v1/image?name=${id.name}`)
					const reCheckData = reCheck.data
					const path = await getImage(reCheckData[0])
					if (fs.existsSync(path)) {
						console.log('文件存在');
					} else {
						console.error('文件不存在');
					}
					try {
						const bufferImg = fs.readFileSync(path)
						console.log('读取成功')
						return h('image', { src: bufferImg })
					} catch (error) {
						console.log('错误：', error)
					}
				}
			})
		ctx.command('活动日历')
			.action(async () => {
				return '没找到合适数据源，先鸽了'
			})
		// 图片过大，后面再想办法解决
		// ctx.command('节奏榜')
		// 	.desc('查询所有学生的一图流评价')
		// 	.action(async () => {
		// 		try {
		// 			console.log('try')
		// 			return h('image', { src: 'https://bawiki.lgc.cyberczy.xyz/img/student/_all.png' })
		// 		} catch (error) {
		// 			return '查询失败，请稍后再试'
		// 		}
		// 	})
	}
}