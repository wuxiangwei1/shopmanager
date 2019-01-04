<template>
  <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{leaveone}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{leavetwo}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  props:['leaveone','leavetwo'],
  name: 'my-bread'
}
</script>

<style>

</style>
