import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// naver-map api
import naver from 'vue-naver-maps';

import vuetify from './plugins/vuetify';
import router from './router'
Vue.use(naver, {
  clientID: 'gv7ysohqky',
  useGovAPI: false, //공공 클라우드 API 사용 (선택)
  subModules:'' // 서브모듈 (선택)
});

// vue-router
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//bootstrap-vue
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

//
new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
