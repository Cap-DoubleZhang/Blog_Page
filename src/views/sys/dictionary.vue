<template>
  <div class="app-container">
    <el-row type="flex" justify="end" class="filter-container">
      <el-input v-model="listQuery.keyWord" prefix-icon="el-icon-search" placeholder="关键词，多个关键词请使用空格分隔" style="width: 300px;" class="filter-item" />
      <el-button-group style="margin-left:10px;">
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
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
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" prop="id" sortable="custom" align="left" width="140">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字典编码" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字典名称" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字典描述" width="150">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="handleDetailShow(row)">
            明细列表
          </el-button>
          <!-- <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="margin-top:-100px;">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 85%; margin-left:50px;">
        <el-form-item label="字典编码" prop="code">
          <el-input v-model="temp.code" placeholder="请输入字典编码" :disabled="dialogStatus==='create'?false:true" />
        </el-form-item>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="是否多选">
          <el-switch
            v-model="temp.isCanMultiple"
            :active-value="true"
            :inactive-value="false"
            active-color="#13ce66"
          />
        </el-form-item>
        <el-form-item label="字典描述">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" maxlength="200" show-word-limit placeholder="描述" />
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

    <el-dialog :title="detailListTitle" :visible.sync="dialogDetailFormVisible" style="margin-top:-100px;">
      <el-row type="flex" justify="end" class="filter-container">
        <el-input v-model="listDetailQuery.keyWord" placeholder="关键词，多个关键词请使用空格分隔" style="width: 300px;" class="filter-item" />
        &nbsp;
        <el-button-group style="margin-left:10px;">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleDetailFilter">
            查询
          </el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleDetailCreate">
            新增
          </el-button>
        </el-button-group>
      </el-row>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="listDetail"
        border
        fit
        style="width: 100%;"
      >
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column label="序号" prop="id" sortable="custom" align="left" width="138">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="明细编码" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.detailCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="值" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="50">
          <template slot-scope="{row}">
            <span>{{ row.sortIndex }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createdTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleDetailUpdate(row)">
              编辑
            </el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDetailDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="totalDetail>0" :total="totalDetail" :page.sync="listDetailQuery.pageIndex" :limit.sync="listDetailQuery.pageSize" @pagination="getDetailList" />
    </el-dialog>

    <el-dialog :title="textDetailMap[dialogDetailInfoStatus]" :visible.sync="dialogDetailInfoFormVisible" style="margin-top:-100px;">
      <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" label-position="right" label-width="80px" style="width: 85%; margin-left:50px;">
        <el-form-item label="明细编码" prop="detailCode">
          <el-input v-model="tempDetail.detailCode" placeholder="请输入字典明细编码" :disabled="dialogDetailInfoStatus==='create'?false:true" />
        </el-form-item>
        <el-form-item label="明细值" prop="value">
          <el-input v-model="tempDetail.value" placeholder="请输入明细值" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="tempDetail.sortIndex" controls-position="right" />
        </el-form-item>
        <el-form-item label="明细描述">
          <el-input v-model="tempDetail.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" maxlength="200" show-word-limit placeholder="描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailInfoFormVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="saveDetailData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
 import { getDictionaries, saveDictionary, deleteDictionary, getDictionariesDetail, saveDictionaryDetail, deleteDictionaryDetail } from '@/api/dictionary'
 import Pagination from '@/components/Pagination' // secondary package based on el-pagination
 import waves from '@/directive/waves' // waves directive
 import { validCode } from '@/utils/validate'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    const ValidCode = (rule, value, callback) => {
      if (value.length <= 0) { callback(new Error('明细编码不能为空.')) }
      if (!validCode(value)) {
        callback(new Error('明细编码只可由英文字母、数字、下划线组成.'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listDetail: null,
      totalDetail: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        keyWord: ''
      },
      listDetailQuery: {
        pageIndex: 1,
        pageSize: 10,
        keyWord: '',
        code: ''
      },
      temp: {
        id: 0,
        name: '',
        code: '',
        isCanMultiple: false,
        remark: ''
      },
      tempDetail: {
        id: 0,
        value: '',
        code: '',
        detailCode: '',
        sortIndex: 0,
        remark: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogDetailFormVisible: false,
      dialogDetailStatus: '',
      dialogDetailInfoFormVisible: false,
      dialogDetailInfoStatus: '',
      textMap: {
        update: '编辑字典',
        create: '创建字典'
      },
      textDetailMap: {
        update: '编辑字典值',
        create: '创建字典值'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        code: [{ required: true, message: '字典编码不可为空.', trigger: 'blur' }],
        name: [{ required: true, message: '字典名称不可为空.', trigger: 'blur' }]
      },
      rulesDetail: {
        detailCode: [{ required: true, trigger: 'blur', validator: ValidCode }],
        value: [{ required: true, message: '字典明细值不可为空.', trigger: 'blur' }]
      },
      downloadLoading: false,
      options: null,
      keyWord: '',
      detailCode: '',
      detailListTitle: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getDictionaries(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.totalCount

        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    getDetailList() {
      this.listLoading = true
      this.listDetailQuery.code = this.detailCode
      getDictionariesDetail(this.listDetailQuery).then(response => {
        this.listDetail = response.data.items
        this.totalDetail = response.data.totalCount

        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getList()
    },
    handleDetailFilter() {
      this.listDetailQuery.pageIndex = 1
      this.getDetailList()
    },
    resetTemp() {
      this.temp = {
        id: 0,
        name: '',
        code: '',
        remark: ''
      }
    },
    resetDetailTemp() {
      this.tempDetail = {
        id: 0,
        value: '',
        code: '',
        detailCode: '',
        sortIndex: 0,
        remark: ''
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDetailCreate() {
      this.resetDetailTemp()
      console.log(this.detailCode)
      this.resetDetailTemp.detailCode = this.detailCode
      this.dialogDetailInfoStatus = 'create'
      this.dialogDetailInfoFormVisible = true
    },
    handleDetailUpdate(row) {
      this.tempDetail = Object.assign({}, row) // copy obj
      this.dialogDetailInfoStatus = 'update'
      this.dialogDetailInfoFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataFormDetail'].clearValidate()
      })
    },
    handleDetailShow(row) {
      this.detailCode = row.code
      this.listDetailQuery = {
        pageIndex: 1,
        pageSize: 10,
        keyWord: '',
        code: ''
      }
      this.detailListTitle = '<' + row.name + '>明细列表'
      this.dialogDetailStatus = 'create'
      this.dialogDetailFormVisible = true
      this.getDetailList()
    },
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveDictionary(this.temp).then(() => {
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
    },
    handleDelete(row) {
        const arr = []
        arr.push(row.id)
       this.$confirm(`你确定删除 ${row.name} 吗？`, '提示', {}).then(() => {
          deleteDictionary({ ids: arr }).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$message({
              message: '删除成功.',
              type: 'success'
            })
          })
       })
    },
    saveDetailData() {
      this.$refs['dataFormDetail'].validate((valid) => {
        if (valid) {
          this.tempDetail.code = this.detailCode
          saveDictionaryDetail(this.tempDetail).then(() => {
            this.getDetailList()
            this.dialogDetailInfoFormVisible = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        }
      })
    },
    handleDetailDelete(row) {
        const arr = []
        arr.push(row.id)
       this.$confirm(`你确定删除 ${row.value} 吗？`, '提示', {}).then(() => {
          deleteDictionaryDetail({ ids: arr }).then(() => {
            this.getDetailList()
            this.dialogDetailInfoFormVisible = false
            this.$message({
              message: '删除成功.',
              type: 'success'
            })
          })
       })
    }
  }
}
</script>
