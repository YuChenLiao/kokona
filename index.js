import axios from "axios"
import { h } from 'zhin'
module.exports = {
	name: 'kokona',
	/**
	* 
	* @param ctx {import('zhin').Context} zhin的上下文
	* @return dispose {import('zhin').Dispose|void}
	*/
	install(ctx) {
		// 在这儿实现你的插件逻辑
		// 功能样例：
		// 1.定义指令
		/*
		ctx.command('test')
				.option('foo','-f <bar:string>')
				.action(({session,options})=>{
						console.log('options',options);
						return 'hello world'
				})
		*/
		ctx.command('攻略 <key:string>')
			.action(async ({session},key) => {
				let name = key
				const res = await axios.get(`https://arona.diyigemt.com/api/v1/image?name=${name}`)
				const data = res.data.data
				if (data.length === 1) {
					// let img = await axios.get(`https://arona.cdn.diyigemt.com/image${data[0].path}`)
					// console.log(segment.image(`https://arona.cdn.diyigemt.com/image${data[0].path}`))
					return h('image',{src:`https://arona.cdn.diyigemt.com/image${data[0].path}`})
				}
				else {
					let msg = ''
					for(let i = 0;i < data.length;i++) {
						msg += (i+1) + '.' + data[i].name + '\n'
					}
					const id = await session.prompt.number(`未找到相关信息，是否在查找以下信息：\n${msg}\n请输入对应数字`)
					return h('image',{src:`https://arona.cdn.diyigemt.com/image${data[id-1].path}`})
				}
			})

		// 2.定义中间件
		/*
		ctx.middleware(async (session,next)=>{
				if(true){ //需要判断的条件
				//逻辑执行代码
				}else{
						next() // 不next，则不会流入下一个中间件
				}
		});
		*/
		// 3. 监听事件
		/*
		ctx.on(eventName,callback);
		ctx.once(eventName,callback);
		ctx.on(eventName,callback);
		*/
		// 4. 定义服务
		/*
		ctx.service('serviceName',{}) // 往bot上添加可全局访问的属性
		*/
		// 5. 添加自定插件副作用(在插件卸载时需要执行的代码)
		// 如果不需要，可以不return
		/*
		return ()=>{
				// 如果你使用过react的useEffect 那你应该知道这是在干嘛
				// 函数内容将会在插件卸载时自动卸载
		}
		*/
	}
}