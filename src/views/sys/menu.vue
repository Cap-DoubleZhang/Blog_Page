<template>
  <div class="app-container">
    <el-row type="flex" justify="end" class="filter-container">
      <el-input v-model="listQuery.keyWord" prefix-icon="el-icon-search" placeholder="关键词，多个关键词请使用空格分隔" style="width: 300px;" class="filter-item" />
      <el-button-group style="margin-left:10px;">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
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
      row-key="menuCode"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="序号" prop="id" sortable="custom" align="left">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="菜单编码" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.menuCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单名" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.menuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.sortIndex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单状态" width="90" align="center">
        <template slot-scope="{row}">
          <el-tag :class="{ 'el-tag--info':row.menuType==1 }">{{ row.menuType==0?"菜单":"按钮" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="禁用状态" width="100" align="center">
        <template slot-scope="{row}">
          <el-switch
            slot="reference"
            v-model="row.isUse"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            @change="updateRoleUse($event,row)"
          />
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
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="margin-top:-100px;">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 85%; margin-left:50px;">
        <el-form-item label="菜单编码" prop="menuCode">
          <el-input v-model="temp.menuCode" placeholder="请输入菜单编码" :disabled="dialogStatus==='create'?false:true" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="temp.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单图标">
          <e-icon-picker v-model="temp.menuIcon" />
        </el-form-item>
        <el-form-item label="菜单标题">
          <el-input v-model="temp.menuTitle" placeholder="请输入菜单标题" />
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="temp.parentModuleID" placeholder="请选择上级菜单" style="width:100%;">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.menuName"
              :value="item.id"
            />
          </el-select>
          <!-- <el-cascader
            ref="cascader"
            v-model="temp.parentModuleID"
            :options="list"
            :props="{ checkStrictly: true, label: 'menuName', value: 'id',expandTrigger: 'hover'}"
            clearable
            filterable
            style="width:100%;"
            @change="cascaderChange"
          /> -->
        </el-form-item>
        <el-form-item label="菜单路径" prop="menuPath">
          <el-input v-model="temp.menuPath" placeholder="请输入菜单路径" />
        </el-form-item>
        <el-form-item label="菜单排序">
          <el-input-number v-model="temp.sortIndex" controls-position="right" />
        </el-form-item>
        <el-form-item label="禁用状态">
          <el-switch
            v-model="temp.isUse"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
          />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-switch
            v-model="temp.menuType"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-text="菜单"
            active-text="按钮"
          />
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
 import { getMenus, saveMenu, deleteMenu, updateMenuIsUse, getAllMenus } from '@/api/menu'
 import waves from '@/directive/waves' // waves directive
 import Pagination from '@/components/Pagination' // secondary package based on el-pagination
 import { validAlphabets } from '@/utils/validate'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    const ValidAlphabets = (rule, value, callback) => {
      if (value.length <= 0) { callback(new Error('菜单编码不能为空.')) }
      if (!validAlphabets(value)) {
        callback(new Error('菜单编码只能由字母组成.'))
      } else {
        callback()
      }
    }
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
      temp: {
        id: 0,
        menuName: '',
        menuCode: '',
        menuIcon: '',
        menuTitle: '',
        parentModuleID: 0,
        menuPath: '',
        sortIndex: 0,
        isUse: 0,
        menuType: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑菜单',
        create: '创建菜单'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        menuCode: [{ required: true, trigger: 'blur', validator: ValidAlphabets }],
        menuName: [{ required: true, message: '菜单名称不可为空.', trigger: 'blur' }],
        menuPath: [{ required: true, message: '菜单路径不可为空.', trigger: 'blur' }]
      },
      downloadLoading: false,
      options: null,
      keyWord: ''
    }
  },
  created() {
    this.getList()
    this.getAllList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getMenus(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.totalCount

        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    getAllList() {
      getAllMenus({ keyWord: this.keyWord }).then(response => {
        this.options = Object.assign({}, response.data)
      })
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: 0,
        menuName: '',
        menuCode: '',
        menuIcon: '',
        menuTitle: '',
        parentModuleID: 0,
        menuPath: '',
        sortIndex: 0,
        isUse: 0,
        menuType: 0
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
          // this.temp.parentModuleID = this.temp.parentModuleID[0]
          saveMenu(this.temp).then(() => {
            this.getList()
            this.getAllList()
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
    handleUpdate(row) {
      this.temp = row
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleChange(value) {
        console.log(value)
    },
    updateRoleUse($event, row) {
      let messgae = ''
      if ($event === 1) {
        messgae = `你确定禁用 ${row.menuName} 吗？`
        row.isUse = 0
      } else if ($event === 0) {
        messgae = `你确定启用 ${row.menuName} 吗？`
        row.isUse = 1
      }
      const arr = []
        arr.push(row.id)
      this.$confirm(messgae, '提示', {}).then(() => {
          updateMenuIsUse({ ids: arr, isUse: $event }).then(() => {
            if ($event === 1) {
              row.isUse = 1
            } else if ($event === 0) {
              row.isUse = 0
            }
            this.$message({
              message: '更改成功.',
              type: 'success'
            })
          })
       })
    },
    handleDelete(row) {
        const arr = []
        arr.push(row.id)
       this.$confirm(`你确定删除 ${row.menuName} 吗？`, '提示', {}).then(() => {
          deleteMenu({ ids: arr }).then(() => {
            this.getList()
            this.getAllList()
            this.dialogFormVisible = false
            this.$message({
              message: '删除成功.',
              type: 'success'
            })
          })
       })
    },
    cascaderChange(values) {
       // 选择之后将下拉界面收起
      this.$refs.cascader.toggleDropDownVisible()
    }
  }
}
</script>
