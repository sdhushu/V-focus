<template>
	<view class="">
		<scroll-view scroll-y="true" style="height: 80%;">
			<view class="cu-item" :id="'cu-' + index" v-for="(item, index) in itemList" :key="index" @touchstart="start($event,index)"
			 @touchmove.stop.prevent="move" @touchend="stops($event,index)" :style="{ 'background-color':item.color }">
				<view class="staffimage">
					<image :src="item.src" mode="aspectFill"></image>
				</view>
				<view class="">{{ item.name }}</view>
			</view>
		</scroll-view>

		<!-- 移动悬浮 begin -->
		<view v-if="showMoveImage">
			<view class="cu-item" style="position: absolute" :style="{ left: moveLeft + 'px', top: moveTop + 'px','background-color':moveItem.color }">
				<view class="staffimage">
					<image :src="moveItem.src" mode="aspectFill"></image>
				</view>
				<view class="">{{ moveItem.name }}</view>
			</view>
		</view>
		<!-- 移动悬浮 end -->
	</view>
</template>

<script>
	export default {
		name: 'exchange',
		model: {
			prop: "showPop",
			event: "change"
		},
		props: {
			list: { // 数据交换列表
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {
				itemTop: 0,
				itemLeft: 0,
				itemHeight: 0, // 移动元素的高度
				itemWidth: 0, // 移动元素的宽度
				showMoveImage: false,
				moveItem: '',
				moveLeft: 0,
				moveTop: 0,
				deltaLeft: 0,
				deltaTop: 0,
				marginDis: 0,
				beginleft: 0,
				begintop: 0,
				itemList: []
			}
		},
		mounted: function() {
			this.$nextTick(function() {
				this.itemList = this.list;
			});
			setTimeout(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select(`#cu-0`).boundingClientRect(data => {
					console.log(data)
					this.begintop = data.top
					this.beginleft = data.left
				}).exec();
				query.select(`#cu-1`).boundingClientRect(data => {
					this.marginDis = (data.top - this.begintop - data.height) / 2 // 元素之间的margin值
				}).exec();
			})

		},
		watch: {
			list(val, oldVal) {
				this.itemList = val;
			},
		},
		created() {

		},
		methods: {
			start(e, index) {
				const query = uni.createSelectorQuery().in(this);
				query.select(`#cu-${index}`).boundingClientRect(data => {
					//#ifdef H5
					this.moveTop = data.top - data.height
					//#endif
					//#ifndef H5
					this.moveTop = data.top
					//#endif
					this.moveLeft = data.left
					this.moveItem = this.itemList[index]
					this.itemWidth = data.width
					this.itemHeight = data.height
					this.showMoveImage = true; //悬浮开始
				}).exec();
			},
			move(e) {
				const touch = e.touches[0];
				if (this.deltaLeft == 0) { // 获得本身的移动
					this.deltaLeft = touch.pageX - this.moveLeft;
					this.deltaTop = touch.pageY - this.moveTop;
				}
				this.moveLeft = touch.pageX - this.deltaLeft;
				this.moveTop = touch.pageY - this.deltaTop;
			},
			stops(e, index) {
				const touch = e.mp.changedTouches[0]
				let lastIndex = lastIndex = this.findOverIndex(touch.pageY);
				// 交换两个值
				let Value = this.itemList[index]
				this.itemList[index] = this.itemList[lastIndex]
				this.itemList[lastIndex] = Value
				this.deltaLeft == 0
				this.showMoveImage = false;
				this.$emit('change', this.itemList)
			},
			// 找到停下的元素的下标
			findOverIndex(posY) {
				let leng = this.itemList.length * this.itemHeight + this.marginDis * 2 * (this.itemList.length - 1); // 最后一个元素距离顶部的距离
				for (var i = 0; i < this.itemList.length; i++) {
					let begin = this.itemHeight * i + this.begintop
					let end = this.itemHeight * i + this.begintop + this.itemHeight + this.marginDis * 2 * i
					if (begin <= posY && end >= posY) {
						return i;
					}
				}
				if (posY > leng) { // 交换最后一个
					return this.itemList.length - 1
				} else if (posY < this.begintop) {
					return 0
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	.cu-item {
		width: 70%;
		border-radius: 5px;
		margin: 10px auto;
		color: #fff;
		display: flex;
		align-items: center;
		padding: 5px 0;
		font-size: 14px;
	}

	.staffimage {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin: 0 20px;
	}

	.staffimage image {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}
</style>
