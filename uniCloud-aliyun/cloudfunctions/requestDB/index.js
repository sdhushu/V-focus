'use strict';
	//event为客户端上传的参数
const db = uniCloud.database();
exports.main = async (event, context) => {
	// 获取 `user` 集合的引用
	const res = await db.collection('todo_list').where({user :'vike'}).get();
	return res
	
	//返回数据给客户端

};
