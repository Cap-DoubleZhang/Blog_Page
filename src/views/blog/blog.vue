<template>
  <div class="app-container">
    <el-row type="flex" justify="end" class="filter-container">
      <el-input v-model="listQuery.keyWord" prefix-icon="el-icon-search" placeholder="关键词，多个关键词请使用空格分隔" style="width: 300px;" class="filter-item" />
      <el-button-group style="margin-left:10px;">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <!-- <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
          新增
        </el-button> -->
        <router-link :to="'/blog/createBlog'">
          <el-button icon="el-icon-edit" class="filter-item" type="primary">
            新增
          </el-button>
        </router-link>
      </el-button-group>
    </el-row>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="序号" prop="id" sortable="custom" align="center" width="138">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="标题">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="50px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.blogType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布类型" width="80px" align="center">
        <template slot-scope="{row}">
          <el-switch
            slot="reference"
            v-model="row.publishType"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            @change="updateBlogPublishType($event,row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="100px" align="center">
        <template slot-scope="{row}">
          <!-- <span>{{ dateFormat(row.profile && \]w.profile.publishTime, "yyyy-MM-dd" ) }}</span> -->
          <span>{{ row.publishTime.split(' ')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <router-link :to="'/blog/editBlog/'+row.id" style="margin-right:10px;">
            <el-button type="primary" size="mini">
              编辑
            </el-button>
          </router-link>
          <el-button type="primary" size="mini" @click="handleCommentShow(row)">
            评论列表
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="commmentListTitle" :visible.sync="dialogCommentFormVisible" style="margin-top:-100px;">
      <el-row type="flex" justify="end" class="filter-container">
        <el-input v-model="listCommentQuery.keyWord" placeholder="关键词，多个关键词请使用空格分隔" style="width: 300px;" class="filter-item" />
        <el-button v-waves style="margin-left:10px;" class="filter-item" type="primary" icon="el-icon-search" @click="handleCommentFilter">
          查询
        </el-button>
      </el-row>
      <el-table
        v-loading="listLoading"
        :data="listComment"
        border
        fit
        style="width: 100%;"
      >
        <el-table-column label="评论内容" min-width="80">
          <template slot-scope="{row}">
            <span>{{ row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createdTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="70" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="mini" type="danger" @click="handleCommentDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="totalComment>0" :total="totalComment" :page.sync="listCommentQuery.pageIndex" :limit.sync="listCommentQuery.pageSize" @pagination="getCommentList" />
    </el-dialog>
  </div>
</template>
<script>
 import { getBlogs, deleteBlog, updateBlogPublishType, getBlogComments } from '@/api/blog/blog'
 import waves from '@/directive/waves' // waves directive
 import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        keyWord: '',
        publishBeginTime: null,
        PublishEndTime: null
      },
      temp: {
        id: 0,
        title: '',
        blogType: '',
        publishTime: new Date(),
        cover: '',
        synopsis: '',
        tags: '',
        publishType: 0,
        content: ''
      },
      commontListLoading: false,
      listComment: null,
      totalComment: 0,
      blogId: 0,
      commmentListTitle: '',
      dialogCommentFormVisible: false,
      listCommentQuery: {
        pageIndex: 1,
        pageSize: 10,
        keyWord: '',
        blogId: 0
      }
    }
  },
  watch: {
    // dialogCommentFormVisible(newVal) {
    //   if (newVal === true) {
    //     this.getCommentList()
    //   }
    // }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getBlogs(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.totalCount

        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    getCommentList() {
      this.commontListLoading = true
      getBlogComments(this.listQuery).then(response => {
        this.listComment = response.data.items
        this.totalComment = response.data.totalCount

        setTimeout(() => {
          this.commontListLoading = false
        }, 1 * 500)
      })
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getList()
    },
    handleCommentShow(row) {
      this.commmentListTitle = `<${row.title}> 评论列表`
      this.dialogCommentFormVisible = true
      this.blogId = row.id
      this.listDetailQuery = {
        pageIndex: 1,
        pageSize: 10,
        keyWord: '',
        blogId: this.blogId
      }
      this.getCommentList()
    },
    handleDelete(row) {
        const arr = []
        arr.push(row.id)
       this.$confirm(`你确定删除 <${row.title}> 吗？`, '提示', {}).then(() => {
          deleteBlog({ ids: arr }).then(() => {
            this.getList()
            this.$message({
              message: '删除成功.',
              type: 'success'
            })
          })
       })
    },
    updateBlogPublishType($event, row) {
      let messgae = ''
      if ($event === 1) {
        messgae = `你确定发布 <${row.title}> 吗？`
        row.publishType = 0
      } else if ($event === 0) {
        messgae = `你确定保存 <${row.title}> 为草稿吗？`
        row.publishType = 1
      }
      const arr = []
        arr.push(row.id)
      this.$confirm(messgae, '提示', {}).then(() => {
          updateBlogPublishType({ ids: arr, publishType: $event }).then(() => {
            if ($event === 1) {
              row.publishType = 1
            } else if ($event === 0) {
              row.publishType = 0
            }
            this.$message({
              message: '更改成功.',
              type: 'success'
            })
          })
       })
    }
  }
}
</script>
