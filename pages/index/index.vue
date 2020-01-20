<template>
	<view class="content">
		<detail v-if="nowIndex == 0" :allTypes="types"></detail>
		<statistics v-if="nowIndex == 2"></statistics>
		<my-footer @switch-page="switchPage"></my-footer>
		<uni-popup ref="addDetail" type="bottom">
			<add-detail :types="types"></add-detail>
		</uni-popup>
	</view>
</template>

<script>
	import MyFooter from "../../components/footer.vue"
	import Detail from "../../components/detail.vue"
	import Statistics from "../../components/statistics.vue"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import addDetail from "@/components/add-detail.vue"
	export default {
		data() {
			return {
				title: 'Hello',
				nowIndex: 0,
				types: []
			}
		},
		onLoad() {
			this.getTypes();
			this.$util.Bus.$on('add-finish', this.$refs.addDetail.close)
			this.$util.Bus.$on('add-type', this.getTypes)
		},
		methods: {
			async getTypes() {
				let res = await this.$myRequest('/getType', {}, 'GET');
				if (res) {
					this.types = res;
				}
			},
			switchPage(index) {
				if (index == 1) {
					this.$refs.addDetail.open()
				} else {
					this.nowIndex = index;
				}
			}
		},
		components: {
			MyFooter,
			Detail,
			Statistics,
			uniPopup,
			addDetail
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../static/iconfont.css";
	@import "../../static/common.scss";

	.content {
		padding-bottom: 100rpx;
	}
</style>
