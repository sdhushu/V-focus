<template>
	<view class="login_page">
		<!-- 登录注册按钮 -->
		<u-button shape="circle" size="large" class="allButton">
			<u-text v-if="loginStatus == 'loginText'" class="loginButtons headButton loginText" text="登录" color="#fff"
				@click="loginTextHandle('loginButtons','registerText',true)"></u-text>
			<u-button v-if="loginStatus == 'loginButtons'" text="登录" shape="circle" size="large"
				class="loginButtons headButton" @click=""></u-button>
			<u-text v-if="registerStatus == 'registerText'" class="registerButton headButton registerText" text="注册"
				color="#fff" @click="loginTextHandle('loginText','registerButtons',true)"></u-text>
			<u-button v-if="registerStatus == 'registerButtons'" text="注册" shape="circle" size="large"
				class="registerButton headButton" @click=""></u-button>
		</u-button>
		<!-- 卡片 -->
		<view class="card" v-if="loginStatus == 'loginButtons'">
			<!-- 登陆账号 -->
			<u--input placeholder="陌上花开 可缓缓归矣" prefixIcon="account-fill"
				prefixIconStyle="font-size: 22px;color: #909399;margin-right:10px;" border="none" v-model="value"
				@change="change" type="text" clearable></u--input>
			<u-line length="80%" class="login-line"></u-line>
			<!-- 登陆密码 -->
			<u--input placeholder="不言之秘" prefixIcon="lock-fill"
				prefixIconStyle="font-size: 22px;color: #909399;margin-right:10px;" border="none" v-model="password"
				@change="changePassword" type="password" clearable></u--input>
		</view>

		<!-- 注册表单 -->
		<view class="card" v-if="registerStatus == 'registerButtons'">
			<!-- 注册账号 -->
			<u--input placeholder="寒塘渡鹤影" prefixIcon="account"
				prefixIconStyle="font-size: 22px;color: #909399;margin-right:10px;" border="none" v-model="value"
				@change="change" type="text" clearable></u--input>
			<u-line length="80%" class="login-line"></u-line>
			<!-- 注册密码 -->
			<u--input placeholder="冷月葬花魂" prefixIcon="lock"
				prefixIconStyle="font-size: 22px;color: #909399;margin-right:10px;" border="none" v-model="password"
				@change="changePassword" type="password" clearable></u--input>
		</view>

		<!-- 登录按钮 -->
		<u-button :text="loginStatus == 'loginButtons' ? '登录':'注册'" size="large" class="loginButton" type="primary"
			@click="login"></u-button>
		<!-- 错误信息提示 -->
		<u-toast ref="uToast"></u-toast>


	</view>
</template>

<script>
	import cryptoJSObj from '../../external_files/encryption.js'
	export default {
		data() {
			return {
				value: '',
				password: '',
				loginStatus: 'loginButtons',
				registerStatus: 'registerText',
				toast: [{
					type: 'error',
					icon: false,
					title: '验证失败',
					message: "密码必须6位包含小写字母与数字",
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
				}, {
					type: 'error',
					icon: false,
					title: '验证失败',
					message: "账户和密码不能为空",
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
				},{
					type: 'error',
					icon: false,
					title: '验证失败',
					message: "账户密码错误",
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
				},{
					type: 'success',
					message: `欢迎登录!`,
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
				}]
			}
		},
		onLoad() {

		},
		methods: {
			change(e) {
				console.log(e)
			},
			changePassword(e) {
				console.log(e)
			},
			loginTextHandle(login_status, register_status,status) {
				// 切换 置空输入框
				if (status) {
					this.value = ''
					this.password = ''
				}
				this.loginStatus = login_status
				this.registerStatus = register_status
			},
			// 显示消息提示框
			showToast(params) {
				this.$refs.uToast.show({
					...params
				})
			},
			// 请求数据库 登录验证
			async db_Client() {
				const db = uniCloud.database({})
				let res = await db.collection('users').where({
				  username: this.value
				}).get()
				console.log(res.result.data[0])
				if (!res.result.data || res.result.data[0].password !== cryptoJSObj.encryptFunc(this.password) || res.result.data[0].username !== this.value) {
					// 数据不存在
					this.password = ''
					return this.showToast(this.toast[2])
				}
				// 提示登陆成功
				this.toast[3].message = `${this.value} 欢迎登录!`
				return this.showToast(this.toast[3])
				
			},
			// 请求数据库 注册数据
			async db_Register() {
				const db = uniCloud.database({})
				// 注册数据库
				try{
					let res = await db.collection('users').add({username:this.value,password:cryptoJSObj.encryptFunc(this.password)})
					if (res.result.id) {
						this.loginTextHandle('loginButtons','registerText',false)
						return uni.showToast({
							title: '注册成功 请登录'
						})
					}
				}catch(e){
					uni.showToast({
						title:'用户名重复'
					})
				}


			},
			
			//  登录请求地址
			login_request() {
				console.log('请求验证', this.value, this.password)
				this.value === '' || this.password === '' ?
					//  预验证失败 提示错误
					this.showToast(this.toast[1]) :
					this.db_Client()
			},
			// 注册验证
			regisetr_validate() {
				let neg = new RegExp('(?!^([0-9]+|[a-zA-Z]+|[!#*_]+)$)^[a-zA-Z0-9!#*_]{6,16}$').test(this.password)
				console.log(this.value, this.password, neg)
				this.value === '' || this.password === '' || neg === false ?
					//  预验证失败 提示错误
					this.showToast(this.toast[0]) :
					console.log('预验证成功')
					this.db_Register()
			},
			// 点击注册 或者登录
			login() {
				this.loginStatus === 'loginButtons' ?
					this.login_request() :
					this.regisetr_validate()
			}
		}
	}
</script>

<style>
	.login_page {
		height: 100vh;
		width: 100vw;
		background-color: #e8e8e8;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.card {
		width: 70%;
		height: 30%;
		background-color: #FFFFFF;
		border-radius: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 50rpx;
		/* padding: 50rpx 50rpx; */
		/* line-height: 30%; */
	}

	.loginButton {
		flex: none;
		position: absolute;
		bottom: 30%;
		width: 40%;
	}

	.allButton {
		width: 50%;
		background-color: gray;
		position: absolute;
		top: 20%;
		opacity: 0.3;

	}

	.headButton {
		z-index: 2000;
		position: absolute;
		width: 50%;
		height: 85%;
	}

	.loginButtons {
		left: 15rpx;
	}

	.loginText {
		left: 18%;
	}

	.registerButton {
		right: 15rpx;
		/* opacity: 0.5; */
	}

	.registerText {
		left: 65%;
	}
</style>
