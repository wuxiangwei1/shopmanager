<template>
  <el-card>
    <my-bread leaveone="订单管理" laevetwo="订单列表"></my-bread>
    <el-table :data="list" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="订单序号" width="80"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="220"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>
      <el-table-column prop="order_pay" label="是否付款" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay==='0'">已付款</el-tag>
          <el-tag type="danger" v-if="scope.row.order_pay==='1'">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="80"></el-table-column>
      <el-table-column label="下单时间" width="140">
        <template slot-scope="scope">{{scope.row.create_time | fmDate}}</template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
            @click="showEditdia(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="省市区" label-width="120px">
          <el-cascader
            expand-trigger="hover"
            clearable
            :options="catlist"
            :props="defaultProp"
            v-model="selectedOptions"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="120px">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import catlist from "@/assets/city_data2017_element.js";


export default {
  data() {
    return {
      loading: true,   //表格数据没加载出来的动画
      list: [],
      dialogFormVisible: false,
      form: {
        address: ""
      },
      // defaultProp:{   //级联选择器数据对应的key名，引入数据默认key名和级联选择器默认key名相同，因此不必修改
      //   value:"value",
      //   label:"label",
      //   children:"children"
      // },
      catlist: [],   // 级联选择器要绑定的数据
      selectedOptions: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$http.get(`orders?pagenum=1&pagesize=10`);
      // console.log(res);
      this.list = res.data.data.goods;
      this.loading = false;     //数据加载完成后关闭加载动画
    },
    showEditdia() {
      this.catlist = catlist;      //把引入的城市数据赋给级联选择器所需要的数据
      this.dialogFormVisible = true;
    }
  }
};
</script>

<style>
</style>
