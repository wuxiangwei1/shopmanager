<template>
  <el-card class="roles_card">
    <my-bread leaveone="权限管理" leavetwo="角色管理"></my-bread>
    <el-button type="primary" class="addRoleBtn">添加角色</el-button>
    <el-table :data="roles" style="width: 100%" class="table_mm">
      <el-table-column type="expand" width="50">
        <template slot-scope="right">
          <el-row v-for="(v,i) in right.row.children" :key="i">
            <el-col :span="4">
              <el-tag type="success">{{v.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
                <el-row v-for="(v1,i1) in v.children" :key="i1">
                  <el-col :span="4">
                    <el-row>
                      <el-tag>{{v1.authName}}</el-tag>
                      </el-row>
                  </el-col>
                  <el-col :span="20">
                     <span v-for="(v2,i2) in v1.children" :key="i2">
                      <el-tag type="info">{{v2.authName}}</el-tag>
                     </span>
                  </el-col>
                </el-row>
              <!-- <el-col :span="19">
                <el-row>
                  <el-col v-for="(v2,i2) in v.children.children" :key="i2" :span="5">
                  <span>{{v.children.children}}</span>
                </el-col>
                </el-row>
              </el-col> -->
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="120"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="240"></el-table-column>
      <!-- 操作三按钮 -->
      <el-table-column label="操作" width="370">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
          <el-button plain size="mini" type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: []
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    async getRoles() {
      const res = await this.$http.get("roles");
      const {
        data: {
          data,
          meta: { msg, status }
        }
      } = res;
      if (status === 200) {
        this.roles = data;
        console.log(data);
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.roles_card {
  height: 100%;
}
.addRoleBtn {
  margin-top: 20px;
}
</style>
