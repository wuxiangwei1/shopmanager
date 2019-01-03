// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入elementUI和需要的css样式文件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入自定义base.css文件
import '@/assets/base.css'
// 引入设置后的的axios插件(将axios设置为vue的插件)
import Http from './assets/plugins/http.js';
// 引入moment时间格式插件
import moment from 'moment'
// 使用Http
Vue.use(Http);
// 使用elementUI
Vue.use(ElementUI);
// 创建一个全局过滤器
Vue.filter('fmDate',function (v) {
  return moment(v).format('YYYY-MM-DD')
});
// 开发阶段是否显示报错
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
