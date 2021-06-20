<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar'">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="saveData(0)">
          保存为草稿
        </el-button>
        <el-button v-loading="loading" type="warning" @click="saveData(1)">
          保存并发布
        </el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px" prop="title" label="标题">
              <!-- <MDinput
                v-model="postForm.title"
                :maxlength="100"
                name="name"
                required
              >
                标题
              </MDinput> -->
              <el-input
                v-model="postForm.title"
                type="text"
                placeholder="请输入标题"
                maxlength="30"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop="content" style="margin-bottom: 30px">
              <Tinymce ref="editor" v-model="postForm.content" placeholder="请输入内容" menubar="true" :height="400" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="文章类型">
              <blog-type ref="blogType" v-model="postForm.blogType" default-first-option detailcode="BlogType" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发布时间">
              <el-date-picker
                v-model="postForm.publishTime"
                type="date"
                format="yyyy-MM-dd"
                placeholder="请选择发布时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="文章标签">
              <blog-type ref="blogLabel" v-model="postForm.tags" default-first-option detailcode="BlogLabel" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <label class="lbl-title">摘要</label>
            <el-button type="text" style="margin-left:10px;" @click="LayerCoverTxt">插入摘要右侧图片</el-button>
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
import Sticky from '@/components/Sticky' // 粘性header组件
import BlogType from '../../sys/DictionaryComponents/BlogType'
import { getBlogDetail, saveBlog } from '@/api/blog/blog'

const defaultForm = {
  publishType: 0, // 发布类型
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
  components: { Tinymce, Sticky, BlogType },
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
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      getBlogDetail(id)
        .then((response) => {
          this.postForm = response.data
          if (this.postForm.tags) { this.$refs.blogLabel.SetValue(this.postForm.tags.split(',')) }
          this.$refs.blogType.SetValue(this.postForm.blogType)
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
    saveData(publishType) {
      this.$refs['postForm'].validate((valid) => {
        if (valid) {
          this.postForm.blogType = this.$refs.blogType.GetValue()
          this.postForm.publishType = publishType
          this.postForm.tags = this.$refs.blogLabel.GetValue().length <= 0 ? '' : this.$refs.blogLabel.GetValue().join(',')
          saveBlog(this.postForm).then(() => {
            this.$notify({
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    LayerCoverTxt() {
      this.$prompt('', '请输出图片地址', {
        confirmButtonText: '确定',
          cancelButtonText: '取消'
      }).then(({ value }) => {
          this.postForm.cover = value
          console.log(this.postForm.cover)
      })
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
