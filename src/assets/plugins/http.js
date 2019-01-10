// 引入axios
import axios from 'axios'
// 设置baseurl
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
// 设置请求拦截器，请求在发起后首先走到该位置
axios.interceptors.request.use(function (config) {
  // 在发送请求之前设置token信息
  if(!(config.url=='login')){
    config.headers.Authorization = localStorage.getItem("token");
  }
  // 切记要把请求return出去，此处发生bug
  return config;
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 如果响应数据的状态码不为200或者201
  if(response.status !== 200 && response.status !== 201)
  alert(response.data.meta.msg)
  return response;
});
const Http = {};
Http.install = function (Vue) {
  // 添加实例方法
  Vue.prototype.$http = axios;
}
// 导出Http
export default Http;