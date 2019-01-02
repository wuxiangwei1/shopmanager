<template>
  <div class="login_form">
    <el-form class="form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="登录密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button type="info" @click.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    handleLogin: async function() {
      const res = await this.$http.post("login", this.formdata);
      const {
        data: {
          data,
          meta: { msg, status }
        }
      } = res;
      if (status === 200) {
        localStorage.setItem('token',data.token)
        this.$router.push({
          name: "home"
        });
      } else {
        // 消息提示框，this.$message 是element提供的写法
        this.$message.error(msg);
      }
    }
  }
};
</script>
<style>
.login_form {
  background: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_form .form {
  height: 330px;
  width: 400px;
  background: #ffffff;
  border-radius: 10px;
  padding: 30px;
}
.login_form .form button {
  width: 100%;
}
</style>
