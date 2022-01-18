<template>
  <div class="app-container">
    <el-row type="flex" justify="end" class="filter-container">
      <el-input
        v-model="listQuery.keyWord"
        prefix-icon="el-icon-search"
        placeholder="关键词，多个关键词请使用空格分隔"
        style="width: 300px"
        class="filter-item"
      />
      <el-button-group style="margin-left: 10px">
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          查询
        </el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-edit"
          @click="dialogVisible = true"
        >
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
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="文件名" min-width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.fileName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网络路径" width="180" align="center">
        <template slot-scope="{ row }">
          <el-link
            type="primary"
            :href="uploadUrl + row.webPath"
            :target="_blank"
          >{{ row.webPath }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="文件路径" width="280" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.realPath }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" width="80" align="right">
        <template slot-scope="{ row }">
          <span>{{ row.fileSize }}K</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <el-dialog
      title="上传文件"
      :visible.sync="dialogVisible"
      style="margin-top: -100px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="80px"
        style="width: 85%; margin-left: 50px"
      >
        <el-form-item label="所属类型" prop="filePathName">
          <el-input v-model="temp.filePathName" placeholder="请输入所属类型" />
        </el-form-item>
        <el-form-item label="文件" prop="file">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            :limit="5"
            multiple
            width="100%"
            :auto-upload="false"
            :http-request="uploadFile"
            :file-list="awaitUploadFiles"
            :on-exceed="uploadExceed"
            :on-remove="uploadRemove"
            :on-change="uploadChange"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">
          关闭
        </el-button>
        <el-button type="primary" @click="saveData()"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getFiles } from '@/api/system/file'
import { saveImage, deleteImages } from '@/api/system/img'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
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
      dialogVisible: false,
      temp: {
        filePathName: ''
      },
      // 待上传文件
      awaitUploadFiles: [],
      awaitUploadFilesStr: '',
      // 文件上传获取路径
      uploadUrl: process.env.VUE_APP_IMG_BASE_API
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取文件列表
    getList() {
      this.listLoading = true
      getFiles(this.listQuery).then((response) => {
        this.list = response.data.items
        this.total = response.data.totalCount

        setTimeout(() => {
          this.listLoading = false
        }, 1 * 700)
      })
    },
    // 点击查询事件
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getList()
    },
    handleClose() {
      this.dialogVisible = false
      this.awaitUploadFiles = []
    },
    // 刪除文件事件
    handleDelete(row) {
      const arr = []
        arr.push(row.id)
       this.$confirm(`你确定删除 ${row.fileName} 吗？`, '提示', {}).then(() => {
          deleteImages({ ids: arr }).then(() => {
            this.getList()
            this.$message({
              message: '删除成功.',
              type: 'success'
            })
          })
       })
    },
    // 控件选择文件实践
    uploadFile(file) {
      this.awaitUploadFilesStr.append('files', file.file)
    },
    // 选取文件超出数量提示
    uploadExceed(files, fileList) {
        this.$message({
          message: `当前一次性最多选择 5 个文件.`,
          type: 'warning',
          duration: 2000
        })
    },
    uploadRemove(fileList) {
      this.awaitUploadFiles = fileList
    },
    uploadChange(file, fileList) {
      const existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message({
          message: `当前文件已经存在.`,
          type: 'error',
          duration: 2000
        })
        fileList.pop()
      }
      this.awaitUploadFiles = fileList
    },
    saveData() {
      if (this.awaitUploadFiles.length <= 0) {
        this.$message({
          message: '请先选择文件.',
          type: 'error',
          duration: 2000
        })
        return
      }
      this.awaitUploadFilesStr = new FormData()
      this.$refs.upload.submit()
      this.awaitUploadFilesStr.append('filePathName', this.temp.filePathName)
      // this.awaitUploadFilesStr.append('files', this.awaitUploadFiles)
      saveImage(this.awaitUploadFilesStr).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        this.temp.filePathName = ''
        this.awaitUploadFiles = []
        this.dialogVisible = false
        this.getList()
      })
    }
  }
}
</script>
