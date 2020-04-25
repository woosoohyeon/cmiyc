import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
// naver-map api
import naver from 'vue-naver-maps';
Vue.use(naver, {
  clientID: 'gv7ysohqky',
  useGovAPI: false, //공공 클라우드 API 사용 (선택)
  subModules:'' // 서브모듈 (선택)
});

new Vue({
  render: h => h(App),
}).$mount('#app')
