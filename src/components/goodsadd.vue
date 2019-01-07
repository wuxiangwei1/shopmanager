<template>
  <el-card class="zh_card">
    <my-bread leaveone="商品管理" leavetwo="添加商品"></my-bread>
    <el-row class="alert">
      <el-col>
        <el-alert title="添加商品" type="info" center show-icon></el-alert>
      </el-col>
    </el-row>
    <el-steps :active="1*active" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 绑定的全部的！全部的！全部的！的表单数据，只能用一个el-form 里面嵌套el-form-item-->
    <el-form :model="form" class="zh_form" label-position="top">
      <el-tabs @tab-click="tap_click()" tab-position="left" class="tap_left" v-model="active">
        <el-tab-pane label="基本信息" name="1">
          <el-form-item label="名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <span>{{selectedOptions}}</span>
            <el-cascader clearable :options="options" v-model="selectedOptions" :props="goodsval"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="2">
          <el-form-item :label="v.attr_name" v-for="v in arrDy" :key="v.attr_id">
            <el-checkbox-group v-model="v.attr_vals">
              <el-checkbox :label="v1" v-for="(v1,i) in v.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="3">
          <el-form-item :label="v.attr_name" v-for="v in arrStatic" :key="v.attr_id">
            <el-input v-model="v.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="4">
          <el-upload
            class="upload-demo"
            action="http://localhost:8888/api/private/v1/upload"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headers"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">
          <quill-editor v-model="form.goods_introduce"></quill-editor>
          <el-button type="primary" @click="addGoods()">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
// 引入富文本编辑器所需要的css样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入富文本编辑器
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {  //局部组件---> 富文本编辑器
    quillEditor
  },
  data() {
    return {
      active: "1", //选中(展示)的当前tap页
      form: {
        //总绑定的数据，最终提交的数据
        goods_name: "",  //商品名称
        goods_price: "",   //商品价格
        goods_number: "",   //数量
        goods_weight: "",   //重量
        goods_introduce: "",   //描述
        goods_cat: "",      //三级商品分类的id
        pics: [],          //上传完成后的图片路径数组
        attrs: []          //商品参数和商品属性组成的数组
      },
      headers:{
        Authorization: localStorage.getItem('token')
      },
      arrDy: [],                        //动态数据
      arrStatic: [],                    //静态数据
      goodsval: {
        //UI组件选项
        value: "cat_id", //设置每一级的id
        children: "children", //设置每一级的子数据
        label: "cat_name" // 设置每一级的描述
      },
      options: [], //级联选择的数据来源
      selectedOptions: [1, 3, 6] //级联选择中被选中的一二三级的id，可以设值默认值
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    async addGoods() {           //添加商品
      this.form.goods_cat = this.selectedOptions.join(',')  //处理请求中需要的商品分类id的数据类型
      const arr = [];       //商品参数，和商品属性组合成的对象
      this.arrDy.filter(item => {    //  把需要提交的商品参数转成数组里边的对象
        arr.push({attr_id:item.attr_id,attr_values:item.attr_vals.join(',')})
      });
      this.arrStatic.filter(item => {    //  把需要提交的商品属性转成数组里边的对象
        arr.push({attr_id:item.attr_id,attr_values:item.attr_vals})
      });
      this.form.attrs = arr;
      const res = await this.$http.post('goods',this.form);   //万事大吉，开始提交添加商品数据
      const {data:{meta:{msg,status}}} = res;
      if(status == 201) {         //友情提示添加成功或失败
        this.$message.success(msg);
        this.$router.push({        //调回商品列表页面
          name: 'goods'         
        })
      }else{
        this.$message.error(msg)
      }
    },
    handleSuccess(response,file) {   //图片上传成功时触发的钩子
    this.form.pics.push({   //把上传成功的图片临时路径，添加到表单相应的数组中
      pic: response.data.tmp_path
    })

    },
    handleRemove(file) {     //图片移除时触发的钩子
    const INDEX = this.form.pics.findIndex((item) => {  //找到删除成功的图片路径在相应表单数组中的索引
      return item.pic === file.response.data.tmp_path
    });
    this.form.pics.splice(INDEX,1)  //把删除成功的图片临时路径，从表单相应的数组中移除
    },
    async getGoodsCate() {
      //拿到3层嵌套的商品数据列表
      const res = await this.$http.get("categories", [3]);
      this.options = res.data.data; //同步级联数据
    },
    async tap_click() {
      //点击tep切换时触发的钩子
      if (this.active != 1) {
        //如果点击的不是第一个tep切换(基本信息)
        if (this.selectedOptions.length == 0)
          //判断级联选择是否选择了商品分类
          return this.$message.error("请选择商品分类"); //没有的话return出去，友好提示一下
      }
      if (this.active == 2) {
        //当点击的是（商品参数）时
        const res = await this.$http.get(
          //获取商品参数的数据
          `categories/${
            this.selectedOptions[this.selectedOptions.length - 1]
          }/attributes?sel=many`
        );
        res.data.data.forEach(item => {
          //把带有商品属性的字符串修改为数组
          item.attr_vals = item.attr_vals.split(",");
        });
        this.arrDy = res.data.data; //同步动态商品参数的数据
      }
      if (this.active == 3) {
        //当点击的是（商品属性）时
        const res = await this.$http.get(
          //获取商品属性的静态数据
          `categories/${
            this.selectedOptions[this.selectedOptions.length - 1]
          }/attributes?sel=only`
        );
        this.arrStatic = res.data.data; //同步静态数据
      }
    }
  }
};
</script>

<style>
.zh_card {
  height: 100%;
}
.alert {
  margin-top: 15px;
  margin-bottom: 15px;
}
.tap_left {
  margin-top: 15px;
}
.zh_form {
  height: 330px;
  overflow: auto;
}
.ql-editor{
  height: 200px;
}
</style>
