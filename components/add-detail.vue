<template>
	<view class="add-detail">
		<uni-calendar ref="calendar" :insert="false" @confirm="timeConfirm"></uni-calendar>
		<view class="top">
			<view class="option">
				<view @click="changeStatus(1)" :class="['single', status == 1 ? 'active' : '']" style="margin-right: 15rpx;">支出</view>
				<view @click="changeStatus(0)" :class="['single', status == 0 ? 'active' : '']">收入</view>
			</view>
			<view class="choose-time" @click="openCalendar" v-if="date">
				<!-- {{`${date.split('-')[1]}月${date.split('-')[2]}日`}} -->
				{{date}}
				<i class="iconfont icon-suggest font-small"></i></view>
		</view>
		<view class="middle">
			<view class="money-input flex-between">
				<text>¥</text>
				<input type="digit" value="" v-model="money" />
			</view>
			<scroll-view class="types" scroll-x="true">
				<view class="type" v-for="(item,index) in types" :key="index" @click="clickType(index)" @longpress='typeLongPress(index)'>
					<view :class="['back-font', typeActive == index ? 'active' : '']">
						<i class="iconfont icon-suggest font-middle"></i>
					</view>
					{{item.type}}
				</view>
				<view class="type" @click="clickAddType">
					<view class="back-font">
						<i class="iconfont icon-suggest font-middle"></i>
					</view>
					添加
				</view>
			</scroll-view>
		</view>
		<view class="bottom">
			<view class="tip">备注</view>
			<input type="text" placeholder="请输入账务具体说明" v-model="desc" />
			<view class="full-button" @click="addRecord">确认</view>
		</view>
		<uni-popup ref="addType" type="center">
			<view class="add-type">
				<input type="text" v-model="newType" placeholder="输入4字以内新分类" />
				<button class="full-button" @click="addType">确认</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {
			uniCalendar,
			uniPopup
		},
		props: {
			types: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {
				status: 1,
				date: null,
				typeActive: 0,
				desc: "",
				money: "",
				newType: ""
			};
		},
		created() {
			this.date = this.$util.dateFormat('YYYY-mm-dd', new Date());
		},
		methods: {
			async addRecord() {
				if (!this.desc || !this.money || !this.types.length) {
					this.$util.myToast('请完善数据')
					return;
				}
				let data = {
					"type": this.types[this.typeActive].type,
					"typeId": this.types[this.typeActive].typeId,
					"desc": this.desc,
					"money": this.money,
					"date": this.date,
					"isOut": this.status,
				}
				let res = await this.$myRequest('/addRecord', data, 'POST');
				if (res) {
					this.money = "";
					this.desc = "";
					this.$util.Bus.$emit('add-finish')
					this.$util.myToast('记账成功')
				}
			},
			async addType() {
				if (!this.newType || this.newType.length > 4) {
					this.$util.myToast('请输入4字以内新分类名称')
					return;
				}
				let res = await this.$myRequest('/addType', {
					typeName: this.newType
				}, 'POST');
				if (res) {
					this.$refs.addType.close();
					this.$util.myToast('添加成功');
					this.$util.Bus.$emit('add-type');
				}
			},
			changeStatus(status) {
				this.status = status;
			},
			openCalendar() {
				this.$refs.calendar.open();
			},
			timeConfirm(time) {
				this.date = time.fulldate;
			},
			clickType(index) {
				this.typeActive = index;
			},
			clickAddType() {
				this.$refs.addType.open();
			},
			typeLongPress(index) {
				let type = this.types[index]
				uni.showModal({
					title: '删除分类',
					content: `是否确认删除分类-${type.type}`,
					success: async res => {
						if (res.confirm) {
							let ret = await this.$myRequest('/delType', {
								typeId: type.typeId
							}, 'DELETE');
							if (ret) {
								this.$util.myToast('删除成功');
								this.$util.Bus.$emit('add-type');
							}
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../static/iconfont.css";
	@import "../static/common.scss";

	.add-detail {
		background: white;
		padding: 40rpx;
		border-radius: 20rpx 20rpx 0 0;

		.top {
			display: flex;
			justify-content: space-between;

			.option {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 220rpx;

				.single {
					text-align: center;
					width: 106rpx;
					height: 60rpx;
					line-height: 60rpx;
					font-size: 26rpx;
					border-radius: 30rpx;
					background: #ededed;
					color: $gray3;
				}

				.active {
					color: $green;
					border: 1rpx solid $green;
					background: #ebf7f1;
				}
			}

			.choose-time {
				width: 146;
				height: 60rpx;
				background: #ededed;
				line-height: 60rpx;
				text-align: center;
				border-radius: 30rpx;
				padding: 0 30rpx;
				display: flex;
				align-items: center;

				i {
					margin-left: 5rpx;
				}
			}
		}

		.middle {
			.money-input {
				height: 146rpx;
				line-height: 146rpx;
				border-bottom: 1rpx solid $gray2;

				text {
					font-size: 50rpx;
					font-weight: bold;
				}

				input {
					font-size: 80rpx;
					margin-left: 20rpx;
					font-weight: bold;
					flex: 1;
					color: $black;
					height: 146rpx;
					line-height: 146rpx;
				}
			}

			.types {
				width: 100%;
				display: flex;
				flex-direction: row;
				align-items: center;
				white-space: nowrap;
				margin-top: 50rpx;

				.type {
					width: 114rpx;
					display: inline-block;
					font-size: 22rpx;
					color: $gray3;
					text-align: center;

					.back-font {
						margin: 0 auto;
						margin-bottom: 10rpx;
						width: 70rpx;
						height: 70rpx;
						border-radius: 50%;
						lighting-color: 70rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						background: $gray2;
						color: $gray3;
					}

					.active {
						background: $green;
						color: white;
					}
				}
			}
		}

		.bottom {
			font-size: 26rpx;

			.tip {
				font-size: 32rpx;
				margin-top: 30rpx;
				margin-bottom: 20rpx;
			}

			input {
				border-bottom: 1rpx solid $gray2;
				width: 100%;
				height: 60rpx;
				height: 60rpx;
			}
		}

		.add-type {
			padding: 30rpx;
			width: 500rpx;
			height: 200rpx;
			border-radius: 10rpx;
			background: white;

			input {
				border-bottom: 1rpx solid $gray2;
				height: 100rpx;
				line-height: 100rpx;
			}
		}
	}
</style>
