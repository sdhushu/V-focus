import Vue from 'vue'
import App from './App'


// 引入全局uView
import uView from '@/uni_modules/uview-ui'


console.log(uView,111)
Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView)

const app = new Vue({
    ...App
})


app.$mount()
