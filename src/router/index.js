import Vue from 'vue'                         //引入vue
import Router from 'vue-router'               //引入路由
import Login from '@/components/login'        // 登录页
import Home from '../components/home'         //主页
import  User from '../components/user'        //用户列表
import Rights from '../components/rights'     //权限列表
import Roles from '../components/roles'       //角色列表

Vue.use(Router)                               //使用路由（vue-router）

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
      },{
        name: 'rights',           //权限列表
        path: '/rights',
        component: Rights
      },{
        name: 'roles',
        path: '/roles',
        component: Roles
      }]
    },
    {
      name: 'login',              //登录页
      path: '/login',
      component: Login
    }
  ]
})
