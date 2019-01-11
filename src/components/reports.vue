<template>
  <el-card>
    <my-bread leaveone="订单管理" laevetwo="订单列表" class="zh_bread"></my-bread>
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="main" style="width: 650px;height:400px;"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";
export default {
  mounted() {
    this.geteacharts();
  },
  methods: {
    async geteacharts() {
      const res = await this.$http.get('reports/type/1')  //获取数据报表的数据
      const {data:{data}} = res;  
      //使用图表
      const myChart = echarts.init(document.getElementById("main"));
      // 指定图表的配置项和数据
      const option2 = {
        title: {
          text: "堆叠区域图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          //保存图片功能
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          //样式设置
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        }
      };
      const option = {...option2,...data}      //总和图表配置和图表数据来源
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  }
};
</script>

<style>
.zh_bread {
  margin: 20px 0;
}
</style>
