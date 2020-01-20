<template>
	<view class="footer-wrapper">
		<!-- <i class="iconfont icon-suggest font-small"></i> -->
		<view class="middle">
		</view>
		<view class="footer">
			<view :class="['left', nowIndex == 0 ? 'color-green' : '']" @click="switchPage(0)">
				<i class="iconfont icon-suggest font-big"></i>
				<view class="left-text font-small">明细</view>
			</view>
			<view class="midder-wrapper" @click="switchPage(1)">
				<view class="middle-back">
					<i class="iconfont icon-suggest font-big"></i>
				</view>
			</view>
			<view :class="['left', nowIndex == 2 ? 'color-green' : '']" @click="switchPage(2)">
				<i class="iconfont icon-suggest font-big"></i>
				<view class="left-text font-small">统计</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nowIndex: 0
			};
		},
		methods: {
			switchPage(index) {
				this.nowIndex = index;
				this.$emit('switch-page', index);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../static/iconfont.css";
	@import "../static/common.scss";

	.footer-wrapper {
		.footer {
			position: fixed;
			bottom: 0;
			height: 114rpx;
			width: 100%;
			border-top: 2rpx solid $gray1;
			background: white;
			z-index: 2;
			display: flex;
			align-items: center;
			justify-content: space-around;
			color: $gray3;
			.left {
				width: 136rpx;
				height: 114rpx;
				text-align: center;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.left-text {
					line-height: 30rpx;
				}
			}
			.midder-wrapper {
				width: 136rpx;
				height: 136rpx;
				background: white;
				margin-top: -26rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				.middle-back {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					background: $green;
					color: white;
					line-height: 100rpx;
					text-align: center;
				}
			}
		}

		.middle {
			width: 136rpx;
			margin: 0 auto;
			height: 136rpx;
			border-radius: 50%;
			position: fixed;
			border: 2px solid $gray1;
			margin-top: -20rpx;
			display: flex;
			left: 305rpx;
			bottom: 0;
			background: white;
			z-index: 1;
		}
	}
</style>
