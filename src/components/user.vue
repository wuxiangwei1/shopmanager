<template>
  <el-card class="box-card">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="input_dad">
      <el-col :span="10">
        <el-input placeholder="请输入内容" v-model="input5" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="10">
        <el-button type="primary" class="input_add">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="用户ID" width="80"></el-table-column>
      <el-table-column prop="username" label="用户名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
      <el-table-column prop="create_time" label="创建日期" width="120"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态" width="80"></el-table-column>
      <el-table-column prop="name" label="操作" width="180"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 2
    };
  },
  created() {
    this.getTabledata();
  },
  methods: {
    getTabledata: async function() {
      this.$http.defaults.headers.common[
        "Authorization"
      ] = localStorage.getItem("token");
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      const {
        data: {
          data: { total, users },
          meta: { status, msg }
        }
      } = res;
      console.log(users);
      this.tableData = users;
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}
.input_dad {
  margin-top: 20px;
}
.input_add {
  margin-left: 10px;
}
</style>
