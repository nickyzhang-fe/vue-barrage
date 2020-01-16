import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vconsole from 'vconsole'

Vue.config.productionTip = false
Vue.prototype.$Vconsole = new Vconsole()
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
