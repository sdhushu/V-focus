<template>
	<view class="V_home" @touchmove="addCard" @touchend="motalCard">
		<!-- 头部 -->
		<view class="V_home_header">
			<!-- 左侧日期 -->
			<view class="left_time">
				<view class="day_font">
					{{day}}
				</view>
				<view class="year_font">
					{{year}}
				</view>
				<view class="month_font">
					{{wordMounth}}
				</view>
			</view>
			<!-- 右侧时间 -->
			<view class="right_time">
				{{hours}}:{{miuite}}
			</view>
		</view>
		<!-- 没有内容时展示 -->
		<u-divider v-if="cardData == ''" text="右滑新增清单" :textSize="30"></u-divider>
		<!-- 卡片列表 -->
		<HM-dragSorts :list="cardData" :isLongTouch="false" :isAutoScroll="true" :feedbackGeneratorState="true"
			:listHeight="80" :rowHeight="200" @change="change" @confirm="confirm" @onclick="onclick">
			<template slot="rowContent" slot-scope="{row}">
				<!-- 标题 -->
				<view class="card_title" :style="{backgroundColor:row.titleColor}" @click="titleClick(row.title)">
					<text v-if="titleFlag !== row.title">{{row.title}}</text>
					<u--input v-if="titleFlag === row.title" :value="row.title" border="none" :focus="true"
						maxlength="15" @change="titleChange" @blur="titleBlur(row)"></u--input>
				</view>
				<!-- 内容 -->
				<view class="wrap" @longpress="cardLongPress(row)">
					<u-row v-for="(item,index) in row.data" :key="index">
						<u-col span="6" @click="textClick(item.content,item.id)">
							<view class="card_text" :class="item.status == true ? 'notouch':''"
								v-if="testFlag !== item.content || contentId != item.id">
								{{item.content || '双击修改内容'}}
							</view>
							<u--input v-if="testFlag === item.content && contentId == item.id" :value="item.content"
								border="none" fontSize="15px" maxlength="15" class="card_input" @change="inputChange"
								placeholder="请输入计划" @blur="inputBlur(row,index)"></u--input>
						</u-col>
						<u-col span="6">
							<radio-group @change="radioChange(index,row)" class="card_radio">
								<label class="radio card_radio">
									<radio :checked="item.status" :color="row.titleColor" />
								</label>
							</radio-group>
						</u-col>
					</u-row>
				</view>

			</template>
		</HM-dragSorts>

		<!-- 是否添加todo任务 -->
		<u-modal :show="Model.ismodel" :content="Model.content" :showConfirmButton="Model.ismodel"
			:showCancelButton="Model.ismodel" confirmText="添加" cancelText="手滑了" @confirm="modelAdd"
			@cancel="modelCancel">
		</u-modal>

		<!-- 添加card -->
		<u-popup :show="pageStatus === 'right'" mode="center" :round="10"
			:customStyle="{'height':'190px','box-shadow':'1px 3px 10px black','width':'70vw','padding-left':'30rpx','padding-top':'30rpx','padding-right':'30rpx'}"
			@open="popupOpen" @close="popupClose">
			<!-- 卡片标题 -->
			<view class="">
				<u-input prefixIcon="标题:" :value="newCard.title" @change="newCardTitle" placeholder="请输入卡片标题"
					border="none" maxlength="15"></u-input>
				<view class="" style="margin-top: 20rpx;margin-bottom: 30rpx;">
					<u-text text="颜色"></u-text>
				</view>

				<u-row customStyle="margin-bottom: 10px" justify="between">
					<u-col span="4">
						<!-- <view style="width: 25%;white-space: nowrap;"> -->
						<u-tag text="primary" type="primary" :plain="!(radios==1)" :name="1" @click="radioClick">
						</u-tag>
						<!-- </view> -->
					</u-col>
					<u-col span="3">
						<!-- <view style="width: 25%;white-space: nowrap;"> -->
						<u-tag text="info" type="info" :plain="!(radios==2)" :name="2" @click="radioClick"></u-tag>
						<!-- </view> -->
					</u-col>

					<u-col span="4">
						<!-- <view style="width: 25%;white-space: nowrap;"> -->
						<u-tag text="warning" type="warning" :plain="!(radios==3)" :name="3" @click="radioClick">
						</u-tag>
						<!-- </view> -->
					</u-col>
				</u-row>
				<u-row customStyle="margin-bottom: 10px" justify="around">
					<u-col span="3">
						<u-tag text="error" type="error" :plain="!(radios==4)" :name="4" @click="radioClick"></u-tag>
					</u-col>
					<u-col span="4">
						<u-input :value="newCard.color" @change="newCardColor" placeholder="自定义颜色" border="none"
							maxlength="10"></u-input>
					</u-col>
				</u-row>

				<u-row justify="between">
					<u-col span="3">
						<u-button text="取消" @click="pageStatus = false"></u-button>
					</u-col>
					<u-col span="3">
						<u-button type="primary" text="添加" @click="addNewCard"></u-button>
					</u-col>
				</u-row>
			</view>

			<!-- 卡片颜色 -->
		</u-popup>

		<!-- 右滑切换页面 -->
		<u-popup :show="pageStatus==='left'" mode="right" :safeAreaInsetTop="true" :customStyle="{'width':'50vw'}" @close="pageStatus=false">
			<!-- 用户名 时间 -->
			<view class="">
				<view class="pathHeader">
					<text style="font-size: 40rpx;color: #FFFFFF;margin-left: 20%;">{{username}}</text>
					<text style="font-size: 25rpx;margin-left: 15rpx;">{{timestrap}}好</text>
				</view>

				<!-- icon -->
				<!-- 页面标题 -->
				<u-cell-group>
					<u-cell icon="setting-fill" title="清单" :iconStyle="{'margin-right':'30px'}"></u-cell>
					<u-cell icon="integral-fill" title="敬览" :iconStyle="{'margin-right':'30px'}"></u-cell>
					<u-cell icon="setting-fill" title="入眠" :iconStyle="{'margin-right':'30px'}"></u-cell>
					<u-cell icon="integral-fill" title="统计" :iconStyle="{'margin-right':'30px'}"></u-cell>
					<u-cell icon="integral-fill" title="退出" :iconStyle="{'margin-right':'30px'}" @click="getOut"></u-cell>
				</u-cell-group>
			</view>
			<!-- 路径 -->
			<!-- todo -->
			<!-- 敬览 -->
			<!-- 入眠 -->
			<!-- 统计 -->
			<!-- 退出 -->
		</u-popup>

	</view>
</template>

<script>
	import Data from '../../external_files/date.js'
	import Gesture from '../../components/xiaocongmang-gesture/xiaocongmang-gesture.vue'
	export default {
		data() {
			return {
				count: 0,
				newCard: {
					title: '',
					color: '',
					id: '',
					select: ''
				},
				// 页面滑动状态
				pageStatus: '',
				radios: 1,
				// 模态框触发
				Model: {
					ismodel: false
				},
				// 改变后的任务栏
				changeTitle: '',
				// 改变后的内容框
				changeData: '',
				// 内容id
				contentId: null,
				// 内容框判断
				testFlag: false,
				// 标题框判断
				titleFlag: false,
				hours: '',
				miuite: '',
				day: '',
				year: '',
				month: '',
				wordMounth: '',
				cardData: [],
				cardDataId: [],
				timer:'',
				username:'',
				timestrap:''
			}
		},
		components: {
			Gesture
		},
		created() {
			const value = uni.getStorageSync('username');
			if (value) {
				this.username = value
				// 获取时间
				this.getTime()
				this.timer = setInterval(()=>{
					this.getTime()
				},500)
				// 发起数据库请求
				this.dbInit()
			}else {
				uni.redirectTo({
					url:'../login/login',
					success() {
						uni.showToast({
							title:'用户未登录'
						})
					}
				})
			}

		},
		onHide() {
			clearInterval(this.timer)
		},
		methods: {
			getTime() {
				const {
					year,
					month,
					day,
					hour,
					miuite,
					timestrap,
					wordMounth
				} = Data()
				this.hours = hour
				this.miuite = miuite
				this.day = day
				this.year = year
				this.month = month
				this.wordMounth = wordMounth
				this.timestrap = timestrap
			},
			// 用户退出
			getOut () {
				uni.removeStorage({
				    key: 'username',
				    success: function (res) {
				        console.log(res)
						uni.redirectTo({
							url:'../login/login'
						})
				    }
				});
			},
			// 新卡片添加
			async addNewCard() {
				// 关闭弹出层
				this.pageStatus = false
				this.radios == 1 ?
					this.radios = '#3c9cff' :
					this.radios == 2 ?
					this.radios = '#909399' :
					this.radios == 3 ?
					this.radios = '#f9ae3d' :
					this.radios == 4 ?
					this.radios = '#f56c6c' :
					this.radios = 'skyblue'
				let data = {
					title: this.newCard.title || 'To Do',
					titleColor: this.newCard.color || this.radios,
					data: [{
						"content": "双击修改任务",
						"status": false,
						"id": 0
					}],
					// 用户需要获取
					user: this.username,
					id: this.cardData.length + ""
				}
				// 新增数据
				let res = await this.dbAdd(data)
				if (res.result.id) {
					// 新增成功
					this.newCard.title = this.newCard.color = this.newCard.id = ''
					uni.showToast({
						title: '新增卡片成功'
					})
					this.dbInit()
				} else {
					uni.showToast({
						title: '新增卡片失败'
					})
				}
			},
			// 标题框的添加
			newCardTitle(e) {
				this.newCard.title = e
			},
			// 颜色框的添加
			newCardColor(e) {
				this.newCard.color = e
			},
			// 弹出框标题颜色选择
			radioClick(name) {
				this.radios = name
				this.newCard.select = name
			},
			// 弹出框关闭事件
			popupClose() {
				console.log('弹出框关闭')
			},
			// 弹出框开启事件
			popupOpen() {
				console.log('弹出框开启')
			},
			// 页面滑动抬起
			motalCard() {
				if (this.pageStatus === 'right') {
					// 出现路径 切换页面
				}
				console.log('抬起')
			},
			//  整个页面右滑 添加卡片
			addCard(e) {
				const query = uni.createSelectorQuery().in(this);
				query.select('.V_home').boundingClientRect(data => {
					if (this.pageStatus != false) {
						return ''
					}
					if (e.changedTouches[0].clientX < JSON.stringify(data.width) / 2) {
						// 右滑添加卡片
						this.pageStatus = 'right'
						console.log('右滑')
					} else {
						// 左滑显示页面切换
						this.pageStatus = 'left'
						console.log('左滑')
					}
				}).exec();

			},
			// 任务框取消事件
			modelCancel() {
				this.Model.ismodel = false
				console.log('取消')
			},
			// 任务框确认事件
			async modelAdd() {
				// 判断当前状态是否为添加
				// 当前长按卡片的所有data
				let data = this.Model.data
				let row = this.Model.row
				let todoId = row._id + row.title + (data[data.length - 1].id + 1)
				let newData = {
					"content": "双击修改内容",
					"status": false,
					"id": todoId
				}
				console.log(data,112)
				// 将新增数据加入原数组
				data.push(newData)
				console.log(data ,3232)
				// 更新逻辑
				let res = await this.dbUpdate(row._id, {
					data: data
				})
				console.log(res)
				if (res.result.updated > 0) {
					// 重绘页面
					this.dbInit()
				}
				this.Model.ismodel = false
				console.log('确认添加')
			},
			// 任务框长按事件
			cardLongPress(row) {
				// 触发模态框 提示用户是否添加
				// 新增卡片任务
				let data = null;
				let key = null
				this.cardData.forEach((item, index) => {
					if (item._id === row._id) {
						data = item.data
						key = item.title
					}
				})
				console.log('card',this.cardData)
				this.Model.row = row
				this.Model.data = data
				this.Model.ismodel = true
				this.Model.content = `是否为卡片${key}添加新的任务`
				console.log('长按', this.Model)
			},
			onclick(e) {
				console.log('=== onclick start ===');
				// console.log("被点击行: " + JSON.stringify(e.value));
				// console.log("被点击下标: " + JSON.stringify(e.index));
				// console.log('=== onclick end ===');
			},
			change(e) {
				console.log('=== change start ===');
				// console.log("被拖动行: " + JSON.stringify(e.moveRow));
				// console.log('原始下标：', e.index);
				// console.log('移动到：', e.moveTo);
				// console.log('=== change end ===');
			},
			confirm(e) {
				// 删除服务器旧数据 直接使用新数据
				const db = uniCloud.database();
				// 删除数据表
				this.cardData.forEach(async (item) => {
					let res = await db.collection('todo_list').where({
						_id: item._id
					}).remove()
					console.log(res, '删除')
				})
				// 新增数据
				// e.list.push({'user':'vike'})
				setTimeout(() => {
					e.list.forEach((item) => {
						console.log(item, typeof item.data)
						this.dbAdd(item).then((res) => {
							console.log(res, '新增数据')
						}).catch((err) => {
							console.log(err, '错误')
						})
					})
				}, 3000)


			},
			// 卡片内容框点击
			textClick(item, id) {
				// 单击事件
				this.contentId = id
				this.count++
				let times = setTimeout(() => {
					this.count > 1
						// 双击事件
						?
						this.testFlag = item
						// 单击事件 不处理
						:
						''
					clearTimeout(times)
					this.count = 0
				}, 500)

			},
			// input 修改值
			inputChange(e) {
				this.changeData = e
			},
			// input 框失焦
			async inputBlur(row, key) {
				// 失焦获取改变的值发起请求修改
				row.data[key].content = this.changeData
				console.log(row.data)
				let res = await this.dbUpdate(row._id, {
					data: row.data
				})
				console.log('失焦',res)
				// 重新渲染
				this.dbInit()
				this.testFlag = false
			},
			// 卡片标题框点击
			titleClick(e) {
				this.count++
				let times = setTimeout(() => {
					this.count > 1
						// 双击事件
						?
						this.titleFlag = e
						// 单击事件 不处理
						:
						''
					clearTimeout(times)
					this.count = 0
				}, 500)
			},
			// 卡片标题变值
			titleChange(e) {
				this.changeTitle = e
			},
			async radioChange(index, row) {
				// 进来点击了
				row.data[index].status = true
				let res = await this.dbUpdate(row._id, {
					data: row.data
				})
				if (res.result.updated > 0) {
					// 重新渲染
					this.dbInit()
				}
			},
			// 卡片标题失焦
			async titleBlur(row) {
				// 修改title
				// 更新数据
				let res = await this.dbUpdate(row._id, {
					"title": this.changeTitle
				})
				if (res.result.code == 0) {
					// 修改成功 重新渲染
					this.dbInit()
				}
				this.titleFlag = false

			},
			// 数据库初始化请求数据
			async dbInit() {
				const db = uniCloud.database()
				let res = await db.collection('todo_list').where({
					user: this.username
				}).get()
				if (res.result.code === 0) {
					// 接口请求成功
					this.cardData = [...res.result.data]
				}
				console.log(res.result.data,'res_data')
				console.log(this.cardData,'cardData')
			},
			// 新增数据
			async dbAdd(data) {
				const db = uniCloud.database()
				const collection = db.collection('todo_list');
				let res = await collection.add(data)
				return res
			},
			// 更新数据
			async dbUpdate(cardID, data) {
				const db = uniCloud.database()
				const collection = db.collection('todo_list').doc(cardID).update(data)
				return collection
			}
		}
	}
</script>

<style>
	.V_home {
		width: 100vw;
		height: 100vh;
		background-color: #E1E1E1;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.V_home_header {
		padding: 40rpx;
		height: 8vh;
		width: 100vw;
	}

	.left_time {
		position: absolute;
	}

	.day_font {
		font-size: 80rpx;

	}

	.year_font {
		font-size: 35rpx;
		position: absolute;
		left: 120%;
		top: 50%;
		color: gray;
	}

	.month_font {
		font-size: 30rpx;
		position: absolute;
		left: 120%;
		top: 10%;
		color: gray;
	}

	.right_time {
		font-size: 80rpx;
		position: absolute;
		right: 6%;
	}


	.card_radio {
		/* 		position: absolute;
		right: 15%; */
		padding-top: 20rpx;
		/* margin-top: 45rpx; */
		margin-right: 10rpx;
		transform: translate(30%);
	}

	.card_text {
		width: 90vw;
		/* position: absolute; */
		margin-left: 15px;
		/* margin-top: 45rpx; */
		padding-top: 20rpx;
		font-size: 15px;
	}

	.wrap {
		position: absolute;
		height: 170px;
		padding-top: 30rpx;
		/* padding-bottom: 60rpx; */
		overflow-x: hidden;
		overflow-y: auto;
	}

	.card_input {
		width: 80%;
		margin-left: 16px;
		margin-top: 20rpx;
	}

	.card_title {
		width: auto;
		padding: 20rpx 30rpx;
		background-color: skyblue;
		color: #FFFFFF;
		position: absolute;
		border-radius: 20rpx;
		left: 18%;
		font-size: 35rpx;
		transform: translateY(-50%);
	}

	.notouch {
		color: #d3d3d3;
		pointer-events: none;
		text-decoration: line-through;
	}

	.pathHeader {
		width: 100%;
		height: 100rpx;
		background-color: #1785FF;
		padding-top: 10%;
	}
</style>
