<template>
	<view class="detail">
		<view class="top">
			<view class="top-text font-small" @click="showChooseType">{{types[typeActive].type}}
				<i class="iconfont icon-suggest font-big"></i></view>
		</view>
		<view class="middle">
			<view class="middle-text font-small" @click="showCalendar">
				{{`${timeStart.slice(5)}至${timeEnd.slice(5)}`}}
				<i class="iconfont icon-suggest font-big"></i></view>
			<view class="middle-text-right font-small">{{`支出¥${allOut} 收入¥${allIn}`}}</view>
		</view>
		<view class="bottom">
			<view class="day" v-for="(day,index) in listData" :key="index">
				<view class="day-text">
					<view class="date">{{`${day.date.slice(5)} 周${day.day}`}}</view>
					<view class="price">{{`支出¥${day.outMoney} 收入¥${day.inMoney}`}}</view>
				</view>
				<uni-swipe-action v-for="(item,key) in day.items" :key="key">
					<uni-swipe-action-item :options="options" @click="delRecord(item._id)">
						<view class='single'>
							<view class="back-font">
								<i class="iconfont icon-suggest font-middle"></i>
							</view>
							<view class="single-right">
								<view class="left">
									<view class="title">{{item.type}}</view>
									<view class="desc">{{item.desc}}</view>
								</view>
								<view class="right">{{`${item.isOut ? '-' : ''}${item.money}`}}</view>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
		</view>

		<uni-popup ref="chooseType" type="bottom">
			<view class="types-wrapper">
				<view class="type-top">
					请选择分类
				</view>
				<view class="wrapper">
					<view @click="clickType(index)" :class="['type',typeActive == index ? 'active' : '', (index-1) % 3 == 0 ? 'margin-left':'']"
					 v-for="(item, index) in types" :key="index">
						{{item.type}}
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-calendar ref="calendar" :range="true" :insert="false" @confirm="timeConfirm"></uni-calendar>
	</view>
</template>

<script>
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	export default {
		props: {
			allTypes: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: 'red'
					}
				}],
				types: [{
					type: '全部类型',
					typeId: null
				}],
				typeActive: 0,
				timeStart: null,
				timeEnd: null,
				typeId: null,
				listData: [],
				allOut: 0,
				allIn: 0
			};
		},
		created() {
			this.timeEnd = this.$util.dateFormat('YYYY-mm-dd', new Date());
			this.timeStart = this.timeEnd.slice(0, 8) + '01';
			this.getList();
			this.$util.Bus.$on('add-finish', this.getList)
		},
		methods: {
			async getList() {
				let res = await this.$myRequest('/getRecord', {
					page: 1,
					pageLimit: 1000,
					typeId: this.typeId,
					date: [this.timeStart, this.timeEnd]
				}, 'GET');
				if (res) {
					this.convertData(res);
				}
			},
			convertData(res) {
				// [{
				// 	date: 2020-01-14,
				// 	day: '周三',
				// 	outMoney: 3000,
				// 	inMoney: 1000,
				// 	items: [
				//	   ...
				// 	]
				// }]
				let ret = [];
				this.allIn = 0;
				this.allOut = 0
				let days = ['日', '一', '二', '三', '四', '五', '六']
				res.forEach(item => {
					if (item.isOut) {
						this.allOut += item.money
					} else {
						this.allIn += item.money
					}
					let index = ret.findIndex((d) => {
						return d.date == item.date
					});
					// 说明还没有这一条
					if (index == -1) {
						ret.push({
							date: item.date,
							day: days[new Date(item.date).getDay()],
							outMoney: item.isOut ? item.money : 0,
							inMoney: item.isOut ? 0 : item.money,
							items: [item]
						})
					} else {
						let data = ret[index];
						if (item.isOut) {
							data.outMoney += item.money;
						} else {
							data.inMoney += item.money;
						}
						data.items.push(item);
						data.items.sort((a, b) => {
							return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
						})
					}
				})
				this.listData = ret;
			},
			async delRecord(id) {
				let res = await this.$myRequest('/delRecord', {
					id
				}, 'DELETE');
				if (res) {
					this.$util.myToast('删除成功');
					this.getList();
				}
			},
			showChooseType() {
				this.types = this.types.concat(this.allTypes);
				this.$refs.chooseType.open()
			},
			clickType(index) {
				this.typeActive = index;
				this.typeId = this.types[index].typeId;
				this.$refs.chooseType.close()
				this.getList();
			},
			timeConfirm(time) {
				this.timeStart = time.range.data[0];
				this.timeEnd = time.range.data[time.range.data.length - 1];
				this.getList();
			},
			showCalendar() {
				this.$refs.calendar.open();
			}
		},
		components: {
			uniSwipeAction,
			uniSwipeActionItem,
			uniPopup,
			uniCalendar
		}
	}
</script>

<style lang="scss">
	@import "../static/iconfont.css";
	@import "../static/common.scss";

	.detail {
		background: $green;
		width: 750rpx;

		.top {
			padding: 50rpx 50rpx 20rpx 50rpx;
			background: $green;
			vertical-align: middle;
			color: white;

			i {
				margin-left: 5rpx;
				vertical-align: middle;
				display: inline-block;
				font-size: 40rpx;
				opacity: 0.5;
			}
		}

		.middle {
			background: #f7f7f7;
			height: 118rpx;
			border-radius: 20rpx 20rpx 0 0;
			padding: 0 50rpx;
			display: flex;
			justify-content: space-between;
			line-height: 118rpx;

			.middle-text {
				vertical-align: middle;
				color: $black;

				i {
					margin-left: 5rpx;
					vertical-align: middle;
					display: inline-block;
					font-size: 40rpx;
					opacity: 0.5;
					color: $gray3;
				}
			}
		}

		.bottom {
			padding: 36rpx 50rpx;
			background: white;

			.day {
				margin-bottom: 30rpx;
				;
			}

			.day-text {
				color: $gray3;
				display: flex;
				justify-content: space-between;
				font-size: $font-small;
			}

			.single {
				height: 138rpx;
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.back-font {
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
					background: $green;
					lighting-color: 70rpx;
					color: white;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.single-right {
					height: 136rpx;
					border-bottom: 1rpx solid $gray2;
					flex: 1;
					margin-left: 20rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.left {
						.title {
							color: $black;
							font-size: 26rpx;
						}

						.desc {
							color: $gray3;
							font-size: 24rpx;
							margin-top: 10rpx;
						}
					}

					.right {
						color: $black;
						font-size: 30rpx;
						font-weight: bold;
					}
				}
			}
		}

		.types-wrapper {
			background: #fafafa;
			padding: 30rpx;
			border-radius: 20rpx 20rpx 0 0;

			.type-top {
				text-align: center;
				border-bottom: 1rpx solid $gray1;
				padding-bottom: 30rpx;
			}

			.wrapper {
				margin-top: 50rpx;

				.type {
					display: inline-block;
					height: 106rpx;
					width: 220rpx;
					background: white;
					color: $black;
					line-height: 106rpx;
					text-align: center;
					display: inline-block;
					border-radius: 10rpx;
					margin-bottom: 20rpx;
				}

				.margin-left {
					margin: 0 15rpx;
				}

				.active {
					background: $green;
					color: white;
				}
			}
		}
	}
</style>
