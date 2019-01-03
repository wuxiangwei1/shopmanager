<template>
  <el-card class="box-card">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="input_dad">
      <el-col :span="10">
        <el-input
          clearable
          placeholder="请输入内容"
          v-model="query"
          @clear="clearVal"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click.prevent="searchUser(query)"></el-button>
        </el-input>
      </el-col>
      <el-col :span="10">
        <el-button type="primary" class="input_add" @click="dialogFormVisibleadd = true">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%" class="table_mm">
      <el-table-column prop="id" label="用户ID" width="80"></el-table-column>
      <el-table-column prop="username" label="用户名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
      <el-table-column label="创建日期" width="120">
        <!-- 因为element不支持在prop中使用过滤器，因此使用template ，需要把外层的prop属性删掉，想要在组件中显示数据，除了使用属性传值，还可以使用template-->
        <!--数据父传子要使用slot-scope="scope"，"scope"的值会自动锁定为 父绑定的数据，scope.row 会自动取出数组中每个元素(对象) -->
        <template slot-scope="scope">{{scope.row.create_time | fmDate()}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUserState(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- 操作三按钮 -->
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-row>
            <el-button
              plain
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditUser(scope.row)"
              circle
            ></el-button>
            <el-button
              plain
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delUser(scope.row.id)"
              circle
            ></el-button>
            <el-button
              plain
              size="mini"
              type="success"
              icon="el-icon-check"
              @click="showUserRole(scope.row)"
              circle
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="8"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleadd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleadd = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除用户弹出框 -->
    <template></template>
    <!-- 修改用户弹出框 -->
    <el-dialog title="修改用户" :visible.sync="dialogFormVisibleedit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleedit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户角色弹出框 -->
    <el-dialog title="修改用户角色" :visible.sync="dialogFormVisiblerole">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户权限" :label-width="formLabelWidth">
          <el-select v-model="currUserRoleId">
            <el-option :value="-1" label="请选择用户角色" disabled></el-option>
            <el-option v-for="(v,i) in roles" :key="i" :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblerole = false">取 消</el-button>
        <el-button type="primary" @click="editUserRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 8,
      total: -1,
      dialogFormVisibleadd: false, //添加用户弹出框默认隐藏
      dialogFormVisibleedit: false, //修改用户弹出框默认隐藏
      dialogFormVisiblerole: false, //修改用户权限弹出框默认隐藏
      form: {
        username: "",
        password: "",
        email: "",
        mobile: "",
        mg_state: ""
      },
      formLabelWidth: "100px",
      currUserRoleId: -1,
      roles: {}       //角色列表信息
    };
  },
  created() {
    this.getTabledata();
  },
  methods: {
    //修改当前用户角色
    async editUserRole() {
      // 发送请求，参数一：当前用户id，参数二：修改后的角色id
      const res = await this.$http.put(`users/${this.form.id}/role`,{rid: this.currUserRoleId})
      const {data:{meta:{msg,status}}} = res;
      if(status === 200) {
        this.$message.success(msg);
        this.dialogFormVisiblerole = false; //关闭修改对话框
        this.getTabledata();
      }else{
        this.$message.error(msg);
      }
      
    },
    // 打开当前用户角色的弹出框
    async showUserRole(user) {
      this.dialogFormVisiblerole = true;
      this.form = user;
      const res = await this.$http.get('roles');
      const res2 = await this.$http.get(`users/${user.id}`);
      this.currUserRoleId = res2.data.data.rid;
      this.roles = res.data.data;
    },
    // 修改当前用户状态
    changeUserState(user) {
      this.$http.put(`users/${user.id}/state/${user.mg_state}`).then(res => {
        console.log(res);
      });
    },
    //打开当修改用户弹出框，展示要修改的用户信息
    showEditUser(user) {
      this.form = user;
      this.dialogFormVisibleedit = true;
    },
    // 修改用户信息
    async editUser() {
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      const {
        data: {
          meta: { msg, status }
        }
      } = res;
      if (status == 200) {
        this.dialogFormVisibleedit = false;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 删除用户
    delUser(userID) {
      console.log(userID);
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${userID}`);
          const {
            data: {
              meta: { msg, status }
            }
          } = res;
          if (status == 200) {
            this.getTabledata(); //重新渲染删除后的数据
            this.$message.success(msg);
          } else {
            this.$message.error(msg);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 添加用户
    addUser() {
      this.$http.post("users", this.form).then(res => {
        console.log(res);
        const {
          data: {
            meta: { msg, status }
          }
        } = res;
        if (status == 201) {
          this.$message.success(msg);
          this.dialogFormVisibleadd = false; //关闭添加用户弹出框
          this.getTabledata(); //添加数据后重新渲染数据
          this.form = {};
        } else {
          this.$message.error(msg);
        }
      });
    },
    // 当前页显示条数改变时
    handleSizeChange(val) {
      this.pagesize = val;
      this.getTabledata();
    },
    // 当前页码改变时
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getTabledata();
    },
    // 搜索用户
    searchUser(val) {
      this.getTabledata();
    },
    // 清除搜索关键字
    clearVal() {
      this.query = "";
      this.getTabledata();
    },
    // 显示用户列表数据
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
      this.total = total;
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
.table_mm {
  height: 340px;
  overflow: auto;
}
</style>
