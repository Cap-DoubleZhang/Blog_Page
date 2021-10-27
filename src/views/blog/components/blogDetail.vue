<template>
  <div class="createPost-container">
    <el-form ref="FormDetail" :rules="rules" :model="postForm" class="form-container">
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
              <el-input
                v-model="postForm.title"
                type="text"
                placeholder="请输入标题"
                maxlength="80"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item prop="content" style="margin-bottom: 30px">
            <!-- <Tinymce ref="editor" v-model="postForm.content" placeholder="请输入内容" menubar="true" :height="400" /> -->
            <MarkdownEditor ref="MarkdownEditor" v-model="postForm.content" placeholder="请输入内容" :height="500" @uploadImageEvent="uploadImage" />
          </el-form-item>
        </el-row>
        <el-collapse>
          <el-collapse-item>
            <template slot="title">
              <i class="header-icon el-icon-link" />&nbsp; 高级选项
            </template>
            <el-row>
              <el-col :span="6">
                <el-form-item label="文章类型">
                  <blog-type ref="blogType" v-model="postForm.blogType" default-first-option detailcode="BlogType" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发布时间" prop="publishTime">
                  <el-date-picker
                    v-model="postForm.publishTime"
                    type="date"
                    format="yyyy-MM-dd"
                    placeholder="请选择发布时间"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="文章标签">
                  <blog-type ref="blogLabel" v-model="postForm.tags" default-first-option detailcode="BlogLabel" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-checkbox v-model="postForm.isAllowedComments" label="是否允许评论" />
                  <el-checkbox v-model="postForm.isTop" label="是否置顶" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="URL Slug (友好地址名，只能使用字母、数字、-连字符、_下划线，不超过150个字符)">
                <el-input
                  v-model="postForm.FriendUrl"
                  type="text"
                  placeholder="请输入URL Slug"
                  maxlength="150"
                  show-word-limit
                />
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="文章关键词">
                  <el-input
                    v-model="postForm.Keyword"
                    placeholder="请输入关键词"
                    maxlength="30"
                    show-word-limit
                  />
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
          </el-collapse-item>
        </el-collapse>

      </div>
    </el-form>
  </div>
</template>

<script>
// import Tinymce from '@/components/Tinymce'
import MarkdownEditor from '@/components/MarkdownEditor'
import Sticky from '@/components/Sticky' // 粘性header组件
import BlogType from '../../sys/DictionaryComponents/BlogType'
import { getBlogDetail, saveBlog } from '@/api/blog/blog'
import { saveImage } from '@/api/system/img'

// 文章默认信息
const defaultForm = {
  publishType: 0, // 发布类型
  title: '', // 文章题目
  content: '', // 文章内容（Markdown格式）
  contentHtml: '', // 文章内容（HTML格式）
  synopsis: '', // 文章摘要
  tags: '', // 文章标签
  cover: '', // 文章封面
  friendUrl: '', // 友好链接URL
  keyword: '', // 本博客关键词，利于Seo
  publishTime: new Date(), // 发布时间
  id: undefined, // Id
  blogType: '', // 文章类型
  isAllowedComments: true, // 是否允许评论
  isTop: false // 是否置顶
}

export default {
  components: { Sticky, BlogType, MarkdownEditor },
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
      tempRoute: {},
      rules: {
        title: [{ required: true, message: '标题不可为空.', trigger: 'blur' }],
        content: [{ required: true, message: '内容不可为空.', trigger: 'blur' }],
        publishTime: [{ required: true, message: '请选择发布时间.', trigger: 'blur' }]
      }
    }
  },
  created() {
    // 是否为编辑，编辑的话，则获取URL传过来的参数，获取该博客详情
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  mounted() {
    document.onkeydown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            //  执行save方法
            this.saveData(1)
            // 阻止默认事件
            e.preventDefault()
        }
    }
  },
  methods: {
    // 获取博客详情
    fetchData(id) {
      getBlogDetail(id)
        .then((response) => {
          // 设置文章标签
          if (response.data.tags) { response.data.tags = response.data.tags.split(',') }
          this.postForm = response.data
          // 文章标签组件赋值
          this.$refs.blogLabel.SetValue(this.postForm.tags)
          // 文章类型组件赋值
          this.$refs.blogType.SetValue(this.postForm.blogType)
          // set page title
          this.setPageTitle()
          // 标题太长，禁用
          // this.setTagsViewTitle()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 设置页面的标题
    setPageTitle() {
      document.title = `编辑文章 - ${this.postForm.title}`
    },
    setTagsViewTitle() {
      document.title = `编辑文章 - ${this.postForm.title}`
      const route = Object.assign({}, this.tempRoute, { title: `编辑文章 - ${this.postForm.title}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    // 保存博客详情
    saveData(publishType) {
      this.$refs['FormDetail'].validate((valid) => {
        if (valid) {
          this.postForm.blogType = this.$refs.blogType.GetValue()
          this.postForm.publishType = publishType
          this.postForm.contentHtml = this.$refs.MarkdownEditor.getHtml()
          this.postForm.tags = this.$refs.blogLabel.GetValue()
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
    // 右侧摘要图片上传
    LayerCoverTxt() {
      this.$prompt('', '请输出图片地址', {
        confirmButtonText: '确定',
          cancelButtonText: '取消'
      }).then(({ value }) => {
          this.postForm.cover = value
          console.log(this.postForm.cover)
      })
    },
    uploadImage(file, callback) {
      var fd = new FormData()
      fd.append('file', file, file.name) // 添加到请求体
      saveImage(fd).then(result => {
        this.$notify({
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        callback(result.data, '图片')
      })
      // const reader = new FileReader()
      // reader.onload = ({ target }) => { callback(target.result || '') }
      // reader.readAsDataURL(file)
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
