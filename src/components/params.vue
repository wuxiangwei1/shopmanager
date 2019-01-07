<template>
  <el-card class="zh_card">
    <my-bread leaveone="商品管理" leavetwo="分类参数"></my-bread>
    <el-alert title="注意：只允许为三级商品设置参数" type="warning" left show-icon class="zh_alert"></el-alert>
    <el-cascader  :show-all-levels="false" clearable :options="options" v-model="selectedOptions" :props="goodsval"></el-cascader>

  </el-card>
</template>

<script>
export default {
  data() {
    return {
      options: [],                 //<-级联选择->的数据来源
      selectedOptions: [1, 3, 6],  //<-级联选择->中被选中的一二三级的id，可以设值默认值
      goodsval: {                  //<-级联选择->UI组件选项
        value: "cat_id",           //<-级联选择->设置每一级对应的id
        children: "children",      //<-级联选择->设置每一级对应的子数据
        label: "cat_name"          //<-级联选择->设置每一级对应的描述
      },
    }
  },
  created() {
    this.getGoodsCate();
  },
  methods:{
    async getGoodsCate(){
      const res = await this.$http.get(`categories?type=3`);
      this.options = res.data.data
      console.log(res)
    }
  }
}
</script>

<style>
.zh_alert{
  margin: 20px 0px;
}
.zh_card{
  height: 100%;
}
</style>
