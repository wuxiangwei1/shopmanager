import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '../components/home'
import  User from '../components/user'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'home',                //主页
      path: '/home',
      component: Home,
      children: [{
        name: 'users',            //用户管理
        path: '/users',
        component: User
      }]
    },
    {
      name: 'login',              //登录
      path: '/login',
      component: Login
    }
  ]
})
