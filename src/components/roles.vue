<template>
  <el-card class="roles_card">
    <my-bread leaveone="权限管理" leavetwo="角色管理"></my-bread>
    <el-button type="primary" class="addRoleBtn">添加角色</el-button>
    <el-table :data="roles" style="width: 100%" class="table_mm">
      <el-table-column type="expand" width="50">
        <template slot-scope="right">
          <el-row>
            <!-- 如果弹出框没有数据 -->
            <span v-if="right.row.children.length === 0">该角色没有分配权限</span>
          </el-row>
          <el-row v-for="(v) in right.row.children" :key="v.id">
            <el-col :span="4">
              <el-tag type="success" closable @close="delRights(right.row,v.id)">{{v.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(v1) in v.children" :key="v1.id">
                <el-col :span="4">
                  <el-tag closable @close="delRights(right.row,v1.id)">{{v1.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <span v-for="(v2) in v1.children" :key="v2.id">
                    <el-tag type="info" closable @close="delRights(right.row,v2.id)">{{v2.authName}}</el-tag>
                  </span>
                </el-col>
              </el-row>
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
          <el-button
            plain
            size="mini"
            @click="shopRight(scope)"
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑角色权限的弹出框 -->
    <el-dialog title="设置当前用户权限" :visible.sync="dialogVisible" width="500px">
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedArr"	
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setright()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [], //全部角色和其拥有的全部一二三级权限
      dialogVisible: false, //编辑角色权限的对话框的显示和隐藏
      currRoleId: '',  //打开修改权限对话框时的角色id
      treeData: [],  //树形权限展示的所有权限
      checkedArr: [], //以选中的状态显示当前角色拥有过的权限，数组中是当前角色拥有的三级权限id（三级权限选中时，一二级会自动选中）
      defaultProps: {label:'authName',children:'children'}   //树形结构中，lable为当前节点描述，children为当前节点的直接点数据
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    async shopRight(rights) {      //展示所有权限，以选中状态展示当前角色所拥有的权限
      this.currRoleId = rights.row.id;   //同步data中的打开修改权限对话框时的当前角色id
      // console.log('当前角色权限',rights.row.children)
      const res = await this.$http.get('rights/tree')  // 获取角色全部的权限数据
      // console.log('树形结构权限数据',res.data);
      this.treeData = res.data.data;   //把获取到的树形结构权限数据赋值给树形结构数据
      this.dialogVisible = true;
      const rightsItem = [];  //定义一个当前角色所拥有的权限数组
      // const res1 = await this.$http.get('roles');
      // const res2 = res1.data.data.filter( item => item.id === rights.row.id);
      // console.log(res2[0].children)
      // console.log('重新获取',res1.data.data)
      // console.log('旧的',rights.row.children)
      rights.row.children.forEach(item => {   //把当前角色拥有的所有三级权限id通过循环嵌套遍历出来赋值给一个新数组rightsItem
        item.children.forEach(item1 => {
          item1.children.forEach(item2 => {
            rightsItem.push(item2.id);
          })
        })
      });
      this.checkedArr = rightsItem;  //同步当前角色拥有的三级权限id
    },
    async setright() {
      const arr1 = this.$refs.tree.getCheckedKeys();  //获取全选状态的权限状态id
      const arr2 = this.$refs.tree.getHalfCheckedNodes();   //获取半选状态的权限状态id
      const Arr = [...arr1, ...arr2];   //总和全选和半选状态的权限id
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`,{rids: Arr.join(',')});  //发送修改权限的请求
      const {data:{meta:{msg,status}}} = res;
      if(status === 200){
        this.$message.success(msg);
        this.getRoles();             //切记重新获取当前角色的权限，因为shopRight()并没有
        this.dialogVisible = false ; //关闭修改权限的对话框
      }else{
        this.$message.error(msg)
      }
    },
    async getRoles() {
      //获取角色权限数据
      const res = await this.$http.get("roles");
      const {
        data: {
          data,
          meta: { msg, status }
        }
      } = res;
      if (status === 200) {
        this.roles = data;
      } else {
        this.$message.error(msg);
      }
    },
    async delRights(role, rightId) {
      //删除角色指定权限
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      const {
        data: {
          data,
          meta: { msg, status }
        }
      } = res;
      if (status === 200) {
        this.$message.success(msg);
        role.children = data; //把后台返回来的角色剩余权限数组赋值给当前角色权限数组，达到更新视图的目的
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
.table_mm {
  height: 400px;
  overflow: auto;
}
</style>
