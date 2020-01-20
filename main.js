import Vue from 'vue'
import App from './App'
import util from './static/util.js'
Vue.config.productionTip = false
Vue.prototype.$util = util
Vue.prototype.$myRequest = util.myRequest;
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
