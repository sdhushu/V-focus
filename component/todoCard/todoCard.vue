<template>
	<view class="todo-Wrap" ref="todoWrap">
		<view class="simple-todoCard" ref="todoCard">
			{{name}}
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			name:{
				type:String,
				default:'card'
			}
		},
		data() {
			return {
				drag:{
					isdown: false,
					move:false,
					moveClientX:0,
					moveClientY:0,
					elementClientX:0,
					elementClientY:0
				}
			}
		},
		methods: {
			isMove(e) {
				// 按下改变状态
				this.drag.isdown = true
				this.drag.moveClientX = e.changedTouches[0].clientX
				this.drag.moveClientY = e.changedTouches[0].clientY
				console.log(this.$refs.todoWrap,22)
				let Eleroot = this.$el.getBoundingClientRect()
				this.drag.elementClientX = Eleroot.x
				this.drag.elementClientY = Eleroot.y
			},
			Move(e) {
				if (this.drag.isdown) {
					// 计算移动值
					let Eleroot = this.$el
					console.log(Eleroot)
					let x = e.changedTouches[0].clientX - this.drag.moveClientX
					let y = e.changedTouches[0].clientY - this.drag.moveClientY
					// 拖拽触发条件
					if (y > 10) {
						// 判断是否是首次触发
						if (!this.drag.move) {
							this.drag.move = true
							// this.$refs.todoCard.$el.style.height = Eleroot.offsetHeight+'px'
							Eleroot.style.position = 'absolute'
							Eleroot.style.zindex = 9999
							Eleroot.style.transform = 'rotate(5deg)'
							this.$emit('dragStart',{component:this})
						}
						// 一直移动
						console.log(x,y)
						Eleroot.style.left = this.drag.moveClientX + x +'px'
						Eleroot.style.top = this.drag.moveClientY + y +'px'
						this.$emit('dragMove',{
							component:this,
							x:e.changedTouches[0].clientX,
							y:e.changedTouches[0].clientY
							})
					}
				}
				
			},
			MoveDown(e) {
				console.log('移动结束')
				if (this.drag.isdown) {
					// 触发过拖拽逻辑
					if (this.drag.move) {
						// 碰撞逻辑 
						let Eleroot = this.$el
						Eleroot.style.position = 'relative'
						Eleroot.style.zindex = 0
						Eleroot.style.left = '50%'
						Eleroot.style.top = 0
						Eleroot.style.transform = 'translateX(-50%)'
						this.$emit('dragEnd',{component:this})
					}else {
						// y移动距离不足10
					}
				}
				// 抬起恢复初始值
				this.drag.isdown = this.drag.move = false
			}
		}
	}
</script>

<style>
.todo-Wrap {
	width: 75%;
	position: relative;
	left: 50%;
	transform: translateX(-50%);
}
.simple-todoCard {
	width: 100%;
	height: 300rpx;
	padding: 20rpx;
	border-radius: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 1px 2px 5px #888888;
}
</style>
