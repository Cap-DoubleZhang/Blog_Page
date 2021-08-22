<template>
  <div class="app-container">
    <el-row type="flex" justify="end" class="filter-container">
      <el-input v-model="listQuery.keyWord" prefix-icon="el-icon-search" placeholder="关键词，多个关键词请使用空格分隔" style="width: 300px;" class="filter-item" />
      <el-button-group style="margin-left:10px;">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">
          查询
        </el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="create">
          新增
        </el-button>
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
      <el-table-column label="链接名称">
        <template slot-scope="{row}">
          <span><a :href="row.url">{{ row.name }}</a></span>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="50px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.image }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接类型" width="80px" align="center">
        <template slot-scope="{row}">
          <el-tag :class="{ 'el-tag--info':row.linkType==1 }">{{ row.linkType==0?"公告":"友链" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="update(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog title="编辑友链" :visible.sync="dialogFormVisible" style="margin-top:-100px;">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 85%; margin-left:50px;">
        <el-form-item label="链接类型" prop="linkType">
          <el-select v-model="temp.linkType" default-first-option placeholder="请选择友链类型">
            <!-- <el-option value="0" label="公告" />
            <el-option value="1" label="友链" /> -->
            <el-option
              v-for="item in linkType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="链接名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="链接地址" prop="url">
          <el-input v-model="temp.url" placeholder="请输入链接" />
        </el-form-item>
        <el-form-item label="图片">
          <el-input v-model="temp.image" placeholder="请输入图片" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="temp.sortIndex" controls-position="right" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" maxlength="200" show-word-limit placeholder="描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="save()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
 import { getLinks, saveLink, deleteLink } from '@/api/link/link'
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
        keyWord: ''
      },
      // 友链实体类
      temp: {
        id: 0,
        name: '',
        title: '',
        linkType: '',
        image: '',
        sortIndex: '',
        description: ''
      },
      // 友链类型
      linkType: [
          { id: 0, name: '公告' },
          { id: 1, name: '友链' }
        ],
      // 编辑友链的规则
      rules: {
        linkType: [{ required: true, message: '请选择链接类型.', trigger: 'blur' }],
        name: [{ required: true, message: '链接名称不可为空.', trigger: 'blur' }],
        url: [{ required: true, message: '链接地址不可为空.', trigger: 'blur' }]
      },
      dialogFormVisible: false
    }
  },
  watch: {
    // dialogFormVisible(newVal) {
    //   if (newVal === true) {
    //     this.getCommentList()
    //   }
    // }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取链接列表
    getList() {
      this.listLoading = true
      getLinks(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.totalCount

        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    // 搜索链接
    search() {
        this.listQuery.pageIndex = 1
        this.getList()
    },
    // 删除
    handleDelete(row) {
        const arr = []
        arr.push(row.id)
        this.$confirm(`你确定删除 ${row.title} 吗？`, '提示', {}).then(() => {
          deleteLink({ ids: arr }).then(() => {
            this.getList()
            this.$message({
              message: '删除成功.',
              type: 'success'
            })
          })
       })
    },
    resetTemp() {
        this.temp = {
            id: 0,
            name: '',
            title: '',
            linkType: '',
            image: '',
            sortIndex: '',
            description: ''
        }
    },
    // 弹出编辑框
    create() {
        this.resetTemp()
        this.dialogFormVisible = true
    },
    // 弹出编辑框
    update(row) {
        this.temp = Object.assign({}, row)
        this.dialogFormVisible = true
    },
    // 保存链接
    save() {
        this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveLink(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
