<template>
  <el-card class="big_card">
    <my-bread leaveone="权限管理" leavetwo="权限列表"></my-bread>
    <el-table v-loading="loading" :data="rightsList" stripe style="width: 100%" class="table">
      <el-table-column type="index" label="序号" width="150"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="230"></el-table-column>
      <el-table-column prop="path" label="路径" width="230"></el-table-column>
      <el-table-column  label="层级" width="230">
          <template slot-scope="scope">
          <div>
            <span v-if="scope.row.level == 0">一级</span>
            <span v-if="scope.row.level == 1">二级</span>
            <span v-if="scope.row.level == 2">三级</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
      loading: true
    };
  },
  created() {
    this.getRights();
  },
  methods: {
    async getRights() {
      const res = await this.$http.get("rights/list");
      const{data:{data,meta:{msg,status}}} = res;
      if(status === 200){
        this.loading = false
        this.rightsList = data;
      }else{
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.big_card {
  height: 100%;
}
.table{
  height: 450px;
  overflow: auto;
}
</style>
