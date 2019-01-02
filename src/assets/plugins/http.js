// 引入axios
import axios from 'axios'
// 设置baseurl
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
const Http = {};
Http.install = function (Vue) {
  // 添加实例方法
  Vue.prototype.$http = axios;
}
// 导出Http
export default Http;