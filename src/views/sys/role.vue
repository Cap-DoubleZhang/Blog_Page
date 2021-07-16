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
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="138">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否为管理员" width="110" align="center">
        <template slot-scope="{row}">
          <el-switch
            slot="reference"
            v-model="row.adminFlag"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            @change="updateRoleAdmin($event,row)"
          />
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
      <el-table-column label="描述" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.roleDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="Authorization(row)">
            分配权限
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
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="temp.roleName" placeholder="请输入角色名" :disabled="dialogStatus==='create'?false:true" />
        </el-form-item>
        <el-form-item label="管理员">
          <el-switch
            v-model="temp.adminFlag"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.roleDesc" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" maxlength="200" show-word-limit placeholder="描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogRoleMenuTitle" :visible.sync="dialogRoleMenuVisible" style="margin-top:-100px;">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="70px" style="width: 85%; margin-left:50px;">
        <el-tree :data="roleMenuList" default-expand-all show-checkbox :props="roleMenuProps" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleMenuVisible = false">
          关闭
        </el-button>
        <el-button type="primary">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
 import { getRoles, saveRole, deleteRole, updateRoleIsUse, updateRoleAdminFlag } from '@/api/role'
 import { getRoleMenus } from '@/api/system/roleMenu'
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
        adminFlag: -1,
        isUse: -1
      },
      temp: {
        id: 0,
        roleName: '',
        roleDesc: '',
        adminFlag: 0,
        isUse: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑角色',
        create: '创建角色'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        roleName: [{ required: true, message: '用户名不可为空.', trigger: 'blur' }]
      },
      downloadLoading: false,
      dialogRoleMenuVisible: false,
      dialogRoleMenuTitle: '角色授权',
      roleMenuList: null,
      roleMenuProps: {
        children: 'children',
        label: 'menuName'
      },
      query: {
        roleId: 0
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRoles(this.listQuery).then(response => {
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
        roleName: '',
        roleDesc: '',
        adminFlag: 0,
        isUse: 0
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveRole(this.temp).then(() => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          saveRole(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$message({
              message: '操作成功.',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateRoleUse($event, row) {
      let messgae = ''
      if ($event === 1) {
        messgae = `你确定禁用 ${row.roleName} 吗？`
        row.isUse = 0
      } else if ($event === 0) {
        messgae = `你确定启用 ${row.roleName} 吗？`
        row.isUse = 1
      }
      const arr = []
        arr.push(row.id)
      this.$confirm(messgae, '提示', {}).then(() => {
          updateRoleIsUse({ ids: arr, isUse: $event }).then(() => {
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
       this.$confirm(`你确定删除 ${row.roleName} 吗？`, '提示', {}).then(() => {
          deleteRole({ ids: arr }).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$message({
              message: '删除成功.',
              type: 'success'
            })
          })
       })
    },
    updateRoleAdmin($event, row) {
      let messgae = ''
      if ($event === 1) {
        messgae = `你确定启用 ${row.roleName} 成为管理员吗？`
        row.adminFlag = 0
      } else if ($event === 0) {
        messgae = `你确定禁用 ${row.roleName} 成为管理员吗？`
        row.adminFlag = 1
      }
      const arr = []
        arr.push(row.id)
      this.$confirm(messgae, '提示', {}).then(() => {
          updateRoleAdminFlag({ ids: arr, adminFlag: $event }).then(() => {
            if ($event === 1) {
              row.adminFlag = 1
            } else if ($event === 0) {
              row.adminFlag = 0
            }
            this.$message({
              message: '更改成功.',
              type: 'success'
            })
          })
       })
    },
    Authorization(row) {
        this.query.roleId = row.id
        this.getRoleMenus()
        this.dialogRoleMenuVisible = true
        this.dialogRoleMenuTitle = `<${row.roleName}>角色授权`
    },
    getRoleMenus() {
      getRoleMenus(this.query).then(response => {
        this.roleMenuList = response.data
      })
    }
  }
}
</script>
