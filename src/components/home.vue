<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="11">
          <div class="grid-content bg-purple">
            <img src="../assets/img/logo.png" alt>
          </div>
        </el-col>
        <el-col :span="11">
          <div class="grid-content bg-purple-light">
            <h2>电商后台管理系统</h2>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <a @click.prevent="handelLoginout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu
          router
          default-active="2"
          :unique-opened = "true"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
              <el-menu-item index="users"><i class="el-icon-setting"></i>用户列表</el-menu-item>
          </el-submenu>
           <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
              <el-menu-item index=""><i class="el-icon-setting"></i>角色列表</el-menu-item>
              <el-menu-item index="rights"><i class="el-icon-setting"></i>权限列表</el-menu-item>
          </el-submenu>
           <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
              <el-menu-item index="3-1"><i class="el-icon-setting"></i>商品列表</el-menu-item>
              <el-menu-item index="3-2"><i class="el-icon-setting"></i>分类参数</el-menu-item>
              <el-menu-item index="3-2"><i class="el-icon-setting"></i>商品分类</el-menu-item>

          </el-submenu>
           <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
              <el-menu-item index="4-1"><i class="el-icon-setting"></i>订单列表</el-menu-item>
          </el-submenu>
           <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
              <el-menu-item index="5-1"><i class="el-icon-setting"></i>数据报表</el-menu-item>
          </el-submenu>
          
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 在渲染之前检查localStorage中有没有用户信息
  beforeCreate() {
    if(!localStorage.getItem('token')){
      this.$router.push({
        name: 'login'
      })
      this.$message.error('请先登录')
    }
  },
  methods: {
    // 退出功能
    handelLoginout: function () {
    // 清除 localStorage 保存的信息
      localStorage.clear();
      // 重定向到登录页面
      this.$router.push({
        name: 'login'
      });
       this.$message.success('退出登录成功');
    }
  }
};
</script>

<style>
.container {
  height: 100%;
  line-height: 50px;
}
.container .header {
  background: #b3c0d1;
}
</style>
