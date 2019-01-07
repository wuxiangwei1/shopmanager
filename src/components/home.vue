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
        <el-menu router default-active="2" :unique-opened="true" class="el-menu-vertical-demo">
          <el-submenu :index="''+ i" v-for="(v,i) in rights" :key="i">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{v.authName}}</span>
            </template>
            <el-menu-item :index="v1.path" v-for="(v1,i1) in v.children" :key="i1">
              <i class="el-icon-setting"></i>{{v1.authName}}
            </el-menu-item>
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
  data() {
    return {
      rights: []
    }
  },
  // 在渲染之前检查localStorage中有没有用户信息
  beforeCreate() {
    if (!localStorage.getItem("token")) {
      this.$router.push({
        name: "login"
      });
      this.$message.error("请先登录");
    }
  },
  created(){
    this.getrights();
  },
  methods: {
    // 退出功能
    handelLoginout: function() {
      // 清除 localStorage 保存的信息
      localStorage.clear();
      // 重定向到登录页面
      this.$router.push({
        name: "login"
      });
      this.$message.success("退出登录成功");
    },
    async getrights() {   //获取当前角色所拥有的权限，用来展示左侧菜单的权限
      const res = await this.$http.get('menus')  //直接发请求就好，因为当前登录角色发送的请求（后台已经根据token处理过了）
      this.rights = res.data.data;
      // console.log(this.rights)
    }
  }
};
</script>

<style>
.container {
  height: 100%;
}
.container .header {
  background: #b3c0d1;
  line-height: 50px;
}
</style>
