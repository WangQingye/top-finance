import Vue from 'vue'
const BaseUrl = "http://localhost:2333";
async function myRequest(api, data, method, needToken = false) {
	if (needToken) data.token = store.state.token
	let [err, res] = await uni.request({
		url: BaseUrl + api,
		method,
		data,
		header: {
			'Accept': 'application/json',
		}
	});

	if (!err && res.data && !res.data.msg) {
		return res.data;
	} else {
		uni.showToast({
			title: err || res.data.msg || '请求失败，请稍后再试',
			duration: 2000,
			icon: 'none'
		})
	}
}

function dateFormat(fmt, date) {
	let ret;
	const opt = {
		"Y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"H+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"S+": date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
}
function myToast(text, time = 2000, finish) {
	uni.showToast({
		title: text,
		duration: time,
		icon: 'none'
	})
	if (finish) {
		setTimeout(() => {
			return finish();
		}, time)
	}
}
const Bus = new Vue();
export default {
	dateFormat,
	myRequest,
	myToast,
	Bus
}
