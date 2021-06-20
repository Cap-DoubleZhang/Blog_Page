<template>
  <div class="app-container">
    <el-upload
      class="upload-demo"
      drag
      action="/waterfallImage/image"
      multiple
      :on-success="uploadSuccess"
      :on-error="uploadError"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <router-link :to="'/system/waterfallImages'">
      <el-button type="primary">
        查看瀑布流
      </el-button>
    </router-link>
  </div>
</template>
<script>

export default {
  data() {
    return {

    }
  },
  methods: {
    // 上传图片成功后
    uploadSuccess(respone) {
      this.$message({
        message: '保存成功.',
        type: 'success',
        duration: 2000
      })
    },
    uploadError(respone) {
      this.$message({
        message: respone.errors,
        type: 'error',
        duration: 2000
      })
    }
  }
}
</script>

