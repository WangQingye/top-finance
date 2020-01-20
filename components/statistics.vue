<template>
	<view class="statistics">
		<uni-calendar ref="calendar" :range="true" :insert="false" @confirm="timeConfirm"></uni-calendar>
		<view class="top">
			<view class="top-text">
				分类统计
			</view>
			<!-- 			<view class="top-text" style="opacity: 0.5;border: none;">
				按月统计
			</view> -->
		</view>
		<view class="middle">
			<view class="midder-date" @click="openCalendar">
				<text>{{timeStart.slice(2)}}</text> <text class="icon-text">-</text> <text>{{timeEnd.slice(2)}}</text> <text class="icon-text">|</text>
				<i class="iconfont icon-suggest font-middle"></i>
			</view>
			<view class="money">
				<view class="title">共收入</view>
				<view class="text-1"><text>¥ </text>{{allInMoney}}</view>
				<view class="text-2">
					共支出 ¥{{allOutMoney}}
				</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="bottom">
			<view class="title">
				<view class="text">收支构成</view>
				<view class="option">
					<view @click="changeStatus(0)" :class="['single', status == 0 ? 'active' : '']" style="margin-right: 15rpx;">支出</view>
					<view @click="changeStatus(1)" :class="['single', status == 1 ? 'active' : '']">收入</view>
				</view>
			</view>
			<view class="types">
				<view class="single-type" v-for="(item,index) in types" :key="index">
					<view class="type-icon">
						<i class="iconfont icon-suggest font-middle"></i>
					</view>
					<view class="type-text">{{item.type}}</view>
					<view class="type-percent">{{status ? item.inPercent : item.outPercent}}%</view>
					<view class="type-line">
						<view class="green-line" :style="'width:' + Math.floor((status ? item.inPercent : item.outPercent) * 2) + 'rpx'"></view>
					</view>
					<view class="money">¥ {{ status ? item.inMoney : item.outMoney}}</view>
					<i class="iconfont icon-suggest font-middle" style="color: #b8b8b8;"></i>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	export default {
		components: {
			uniCalendar
		},
		data() {
			return {
				types: [{
						type: 1,
						title: '均摊',
						percent: 50.71,
						money: 221.00
					},
					{
						type: 1,
						title: '提成',
						percent: 30.1,
						money: 221.00
					}, {
						type: 1,
						title: '外部渲染',
						percent: 10.71,
						money: 221.00
					}, {
						type: 1,
						title: '其他',
						percent: 5.71,
						money: 221.00
					}
				],
				status: 0,
				timeStart: null,
				timeEnd: null,
				allOutMoney: 0,
				allInMoney: 0
			};
		},
		created() {
			this.timeEnd = this.$util.dateFormat('YYYY-mm-dd', new Date());
			this.timeStart = this.timeEnd.slice(0, 8) + '01';
			this.getTypeStatistic();
		},
		methods: {
			changeStatus(status) {
				this.status = status;
				this.sortTypes();
			},
			timeConfirm(time) {
				this.timeStart = time.range.data[0];
				this.timeEnd = time.range.data[time.range.data.length - 1];
				this.getTypeStatistic();
			},
			openCalendar() {
				this.$refs.calendar.open();
			},
			async getTypeStatistic() {
				let res = await this.$myRequest('/getTypeStatistic', {
					date: [this.timeStart, this.timeEnd]
				}, 'GET');
				if (res) {
					this.allInMoney = res.allInMoney;
					this.allOutMoney = res.allOutMoney;
					this.types = res.types;
					this.sortTypes();
				}
			},
			// 根据当前是支出还是收入，排序一下百分比
			sortTypes() {
				if (this.status) {
					this.types.sort((a, b) => {
						return b.inPercent - a.inPercent
					})
				} else {
					this.types.sort((a, b) => {
						return b.outPercent - a.outPercent
					})
				}
			}
		},
		components: {}
	}
</script>

<style lang="scss">
	@import "../static/iconfont.css";
	@import "../static/common.scss";

	.statistics {
		background: $green;
		width: 750rpx;

		.top {
			padding: 30rpx 50rpx 20rpx 50rpx;
			background: $green;
			color: white;
			display: flex;
			align-items: center;
			justify-content: space-around;

			.top-text {
				color: white;
				border-bottom: 4rpx solid white;
				font-size: $font-small;
				padding-bottom: 20rpx;
				width: auto;
				display: block;
			}
		}

		.middle {
			background: white;
			border-radius: 20rpx 20rpx 0 0;
			padding: 0 50rpx;
			padding-top: 66rpx;
			padding-bottom: 66rpx;
			text-align: center;

			.midder-date {
				padding: 0 22rpx;
				width: 400rpx;
				height: 60rpx;
				margin: 0 auto;
				font-size: $font-small;
				color: $black;
				background: #f7f7f7;
				border-radius: 10rpx;
				display: flex;
				align-items: center;

				.icon-text {
					color: $gray3;
					margin: 0 10rpx;
					line-height: 60rpx;
					font-size: 22rpx;
				}
			}

			.money {
				margin-top: 50rpx;

				.title {
					color: $green;
					font-size: $font-small;
				}

				.text-1 {
					vertical-align: top;
					font-weight: bold;
					color: $green;
					font-size: $font-big;
					margin-top: 20rpx;
					margin-bottom: 20rpx;

					text {
						vertical-align: top;
						font-size: 30rpx;
					}
				}

				.text-2 {
					font-size: $font-small;
					color: $gray3;
				}
			}
		}

		.bottom {
			background: white;
			padding: 0 50rpx;
			padding-top: 40rpx;

			.title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;

				.text {
					font-size: 34rpx;
					color: $black;
				}

				.option {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.single {
						text-align: center;
						width: 86rpx;
						height: 50rpx;
						line-height: 50rpx;
						font-size: 24rpx;
						border-radius: 25rpx;
						background: #ededed;
						color: $gray3;
					}

					.active {
						color: $green;
						border: 1rpx solid $green;
						background: #ebf7f1;
					}
				}
			}

			.types {
				padding-bottom: 60rpx;

				.single-type {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 100rpx;
					font-size: 24rpx;

					.type-icon {
						background: $green;
						border-radius: 50%;
						width: 50rpx;
						height: 50rpx;
						text-align: center;

						i {
							line-height: 50rpx;
							color: white;
						}
					}

					.type-text {
						margin-left: 10rpx;
						width: 100rpx;
					}

					.type-percent {
						color: $gray3;
						font-size: 22rpx;
						margin-left: 10rpx;
						min-width: 60rpx;
					}

					.type-line {
						width: 200rpx;
						height: 14rpx;
						border-radius: 7rpx;
						background: #e5e5e5;
						overflow: hidden;
						margin-right: 10rpx;

						.green-line {
							width: 100rpx;
							height: 14rpx;
							background: $green;
						}
					}

					.money {
						font-weight: bold;
						font-size: 24rpx;
					}
				}
			}

		}
	}
</style>
