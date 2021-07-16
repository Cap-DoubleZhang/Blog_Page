<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
/**
 *以下样式将单选框隐藏，并绝对定位与文字内容一样大小，这样点击时可以点击整行文字。
 */
<style lang="scss">
.el-cascader-panel .el-radio {
  width: 132px;
  height: 34px;
  line-height: 34px;
  padding: 0 10px;
  z-index: 10;
  position: absolute;
}
.el-cascader-panel .el-radio__input {
  visibility: hidden;
}
.el-cascader-panel .el-cascader-node__postfix {
  top: 10px;
}
.el-scrollbar__wrap{
  width: auto;
}
</style>
