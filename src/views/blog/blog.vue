<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyWord" placeholder="关键词，多个关键词请使用空格分隔" style="width: 300px;" class="filter-item" />
      &nbsp;
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>

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
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="138">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章类型" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.blogType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布类型" min-width="120px">
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
      <el-table-column label="发布时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.publishTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="margin-top:-100px;">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="70px" style="width: 85%; margin-left:50px;">
        <el-form-item label="标题" class="filter-item">
          <el-input v-model="temp.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="文章类型" class="filter-item">
          <el-input v-model="temp.blogType" placeholder="请输入文章类型" />
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker v-model="temp.publishTime" type="date" placeholder="请选择发布时间" style="width:100%;" />
        </el-form-item>
        <el-form-item label="封面">
          <el-input v-model="temp.cover" placeholder="请输入封面" />
        </el-form-item>
        <el-form-item label="发布类型">
          <el-switch
            v-model="temp.publishType"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
          />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="temp.tags" placeholder="请输入标签" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="temp.synopsis" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="简介" />
        </el-form-item>
        <el-form-item label="内容">
          <markdown-editor v-model="temp.content" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="saveData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
// import { defineComponent } from '@vue/composition-api'
 import { getBlogs, saveBlog, deleteBlog, updateBlogPublishType } from '@/api/blog/blog'
 import waves from '@/directive/waves' // waves directive
 import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
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
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑博客',
        create: '创建博客'
      },
      dialogPvVisible: false,
      rules: {
        userLoginName: [{ required: true, message: '用户名不可为空.', trigger: 'blur' }],
        userShowName: [{ required: true, message: '昵称不可为空.', trigger: 'blur' }]
      },
      downloadLoading: false
    }
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
        }, 1 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: 0,
        title: '',
        blogType: '',
        publishTime: new Date(),
        cover: '',
        synopsis: '',
        tags: '',
        publishType: 0,
        content: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveBlog(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
        const arr = []
        arr.push(row.id)
       this.$confirm(`你确定删除 ${row.title} 吗？`, '提示', {}).then(() => {
          deleteBlog({ ids: arr }).then(() => {
            this.getList()
            this.dialogFormVisible = false
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
        messgae = `你确定发布 ${row.title} 吗？`
        row.publishType = 0
      } else if ($event === 0) {
        messgae = `你确定保存 ${row.title} 为草稿吗？`
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
