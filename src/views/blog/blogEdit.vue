<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" class="form-container">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px" prop="title">
              <!-- <MDinput
                v-model="postForm.title"
                :maxlength="100"
                name="name"
                required
              >
                标题
              </MDinput> -->
              <label class="lbl-title">标题</label>
              <el-input
                v-model="postForm.title"
                type="text"
                placeholder="请输入摘要"
                maxlength="30"
                show-word-limit
              />
            </el-form-item>

          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop="content" style="margin-bottom: 30px">
              <Tinymce ref="editor" v-model="postForm.content" menubar="true" :height="400" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="文章类型">
              <blog-type v-model="postForm.blogType" default-first-option detailcode="BlogType" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="发布时间">
              <el-date-picker
                v-model="postForm.publishTime"
                type="date"
                format="yyyy-MM-dd"
                placeholder="请选择发布时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <label class="lbl-title">标签</label>
            <el-select
              v-model="postForm.label"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择文章标签"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <label class="lbl-title">摘要</label>
            <el-input
              v-model="postForm.synopsis"
              type="textarea"
              :autosize="{ minRows: 3 }"
              placeholder="请输入摘要"
              maxlength="300"
              show-word-limit
            />
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import BlogType from '../sys/DictionaryComponents/BlogType'
import { getBlogDetail } from '@/api/blog/blog'

const defaultForm = {
  publishType: '', // 发布类型
  title: '', // 文章题目
  content: '', // 文章内容
  synopsis: '', // 文章摘要
  tags: '', // 文章标签
  cover: '', // 文章封面
  publishTime: undefined, // 发布时间
  id: undefined, // Id
  blogType: '' // 文章类型
}

export default {
  components: { Tinymce, BlogType },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      tempRoute: {},
      DictionaryDetail: null
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.fetchData(id)
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      getBlogDetail(id)
        .then((response) => {
          this.postForm = response.data

          // set page title
          this.setPageTitle()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    setPageTitle() {
      document.title = `编辑文章 - ${this.postForm.title}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (
        this.postForm.content.length === 0 ||
        this.postForm.title.length === 0
      ) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

.lbl-title {
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 30px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.material-label {
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 30px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
