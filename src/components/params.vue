<template>
  <el-card class="zh_card">
    <my-bread leaveone="商品管理" leavetwo="分类参数"></my-bread>
    <el-alert title="注意：只允许为三级商品设置参数" type="warning" left show-icon class="zh_alert"></el-alert>
    <el-cascader
      :show-all-levels="false"
      clearable
      :options="options"
      v-model="selectedOptions"
      :props="goodsval"
      @change="handelChange"
    ></el-cascader>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
          <el-table :data="arrDy" style="width: 100%" class="zh_table">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="i"
                  v-for="(v,i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row,v)"
                >{{v}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleAdd(scope.row)"
                  @blur="handleInputConfirm"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增参数</el-button>
              </template>
            </el-table-column>
            <el-table-column label="商品序号" type="index" width="100"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name" width="300"></el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <el-table :data="arrStatic" style="width: 100%" class="zh_table">
            <el-table-column label="商品序号" type="index" width="100"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name" width="300"></el-table-column>
            <el-table-column label="参数名称" prop="attr_vals" width="300"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      options: [], //<-级联选择->的数据来源
      selectedOptions: [1, 3, 6], //<-级联选择->中被选中的一二三级的id，可以设值默认值
      goodsval: {
        //<-级联选择->UI组件选项
        value: "cat_id", //<-级联选择->设置每一级对应的id
        children: "children", //<-级联选择->设置每一级对应的子数据
        label: "cat_name" //<-级联选择->设置每一级对应的描述
      },
      activeName: '2',    //tap切换默认选中静态参数的展示
      arrDy: [],   //动态参数数据
      arrStatic: [],   //静态参数数据
      inputVisible: false, //动态tag（输入框和添加按钮的切换）
      inputValue: ''    //动态tag为输入框时绑定的输入数据
    };
  },
  created() {
    this.getGoodsCate();
    this.getArrStatic();
  },
  methods: {
    showInput() {                       //点击动态tag时切换为输入框
      this.inputVisible = true;
      this.$nextTick(_ => {
        //点击的时候自动获取焦点
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {            //动态tag失焦时出发的事件
      this.inputVisible = false;          //动态tag变为按钮
    },
    async handleAdd(attr) {                     //tag点击回车键时，发送请求添加参数的请求
      this.inputVisible = false;      
       let inputValue = this.inputValue;   
        if (inputValue) {                 //在vals数组中动态添加当前的tag的输入内容
          attr.attr_vals.push(inputValue);
        }
        this.inputValue = '';
      const putData = {                   //后台要求的请求体参数
        attr_name: attr.attr_name,        //当前的
        attr_sel: "many",                 //参数类型（many）
        attr_vals: attr.attr_vals.join(",")    //tag数组
      };
      const res = await this.$http.put(
        `categories/${
          this.selectedOptions[this.selectedOptions.length - 1]
        }/attributes/${attr.cat_id}`,
        putData
      );
      const {data:{meta:{msg,status}}} = res;
      if(status == 200) {
        this.$message.success(msg)
      }else{
        thsi.$message.error(mag)
      }
    },
    async handleClose(attr, val) {        //点击tag里面的X号发送删除参数的请求
      attr.attr_vals.splice(attr.attr_vals.indexOf(val), 1);    //在vals数组中动态移除当前的tag
      const putData = {                   //后台要求的请求体参数
        attr_name: attr.attr_name,        //当前的
        attr_sel: "many",                 //参数类型（many）
        attr_vals: attr.attr_vals.join(",")    //tag数组
      };
      const res = await this.$http.put(
        `categories/${
          this.selectedOptions[this.selectedOptions.length - 1]
        }/attributes/${attr.cat_id}`,
        putData
      );
      const {data:{meta:{msg,status}}} = res;
      if(status == 200) {
        this.$message.success(msg)
      }else{
        this.$message.error(mag)
      }
    },
    async getGoodsCate() {
      //获取级联选择器的数据来源
      const res = await this.$http.get(`categories?type=3`);
      this.options = res.data.data; //同步级联选择器的数据
    },
    handleClick() {
      if(this.activeName == 1){
        this.getArrDy();   //点击tap动态数据时获取动态参数数据
      }else{
        this.getArrStatic();   //点击tap静态数据时获取静态参数数据
      }
    },
    handelChange() {          //级联选择的项改变时
       if(this.activeName == 1){
        this.getArrDy();   //点击tap动态数据时获取动态参数数据
      }else{
        this.getArrStatic();   //点击tap静态数据时获取静态参数数据
      }
    },
    async getArrDy() {      //获取商品参数动态的数据
      const res = await this.$http.get(
        `categories/${
          this.selectedOptions[this.selectedOptions.length - 1]
        }/attributes?sel=many`
      );
      if(res.data.data == null){  //如果当前查询到数据为空
        return this.arrDy = [];    //将动态数据改为空，因为动态改变时，下边的foreach会报错（不能遍历空数组）
      };
      res.data.data.forEach(item => {
        //把带有商品属性的字符串修改为数组
        item.attr_vals = item.attr_vals.split(",");
      });
      this.arrDy = res.data.data;     //同步动态数据
    },
    async getArrStatic() {            //获取商品参数静态的数据
      const res = await this.$http.get(
        `categories/${
          this.selectedOptions[this.selectedOptions.length - 1]
        }/attributes?sel=only`
      );
      this.arrStatic = res.data.data;  //同步静态数据
    },
  }
};
</script>

<style>
.zh_alert {
  margin: 20px 0px;
}
.zh_card {
  height: 100%;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.zh_table {
  height: 275px;
  overflow: auto;
}
</style>
