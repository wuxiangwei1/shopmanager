import Vue from 'vue'                         //引入vue
import Router from 'vue-router'               //引入路由
import Login from '@/components/login'        // 登录页
import Home from '../components/home'         //主页
import  User from '../components/user'        //用户列表
import Rights from '../components/rights'     //权限列表
import Roles from '../components/roles'       //角色列表
import Goods from '../components/goods'       //商品列表
import GoodsAdd from '../components/goodsadd'       //添加商品页面
import Params from '../components/params'      //分类参数页面
import {Message} from 'element-ui'            //该页面想使用一个提示框
Vue.use(Router)                               //使用路由（vue-router）

const router = new Router({
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
        name: 'roles',            //角色列表
        path: '/roles',
        component: Roles
      },{
        name: 'goods',            //商品列表
        path: '/goods',
        component: Goods
      },{
        name: 'goodsadd',          //添加商品
        path: '/goodsadd',
        component: GoodsAdd
      },{
        name: 'params',
        path: '/params',
        component: Params
      }]
    },
    {
      name: 'login',              //登录页
      path: '/login',
      component: Login
    },{
      name: '/',              //登录页
      path: '/login',
      component: Login
    }
  ]
});

router.beforeEach((to, from, next) => {         // 全局守卫功能
  if(to.name === 'login'){     //去的是登录页面
    next()                   //去吧
  }else{                       //不是的话
    if(!localStorage.getItem('token')){     //检查token信息不存在
      router.push({                         //不存在，
        name: 'login'                       //不能去，把路由改到登录页
      });
      Message.error('请先登录');             //友好提示，请先登录
    }else{                                  //检查token信息存在
      next();                               //该去哪去哪
    }
  }
});

export default router;    // 导出路由