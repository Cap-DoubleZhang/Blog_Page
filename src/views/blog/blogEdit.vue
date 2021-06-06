<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" class="form-container">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px" prop="title">
              <MDinput
                v-model="postForm.title"
                :maxlength="100"
                name="name"
                required
              >
                标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="10">
                  <el-form-item label="发布时间">
                    <el-date-picker
                      v-model="postForm.publishTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="请选择发布时间"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="文章类型">
                    <blog-type v-model="postForm.blogType" :detail-code="BlogType" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item prop="content" style="margin-bottom: 30px">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
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
  components: { Tinymce, MDinput, BlogType },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
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
</style>
