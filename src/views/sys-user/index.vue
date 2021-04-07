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
      <el-table-column label="用户名" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.userLoginName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.userShowName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" width="110" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否在线" width="80px" align="center">
        <template slot-scope="{row}">
          <el-button circle :style="{'background':row.isOnline?'green':'gray','padding':'4px','vertical-align': 'middle'}" />
          &nbsp;&nbsp;<span>{{ row.isOnline?'在线':'离线' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次登录时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lastLoginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次登录IP" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lastLoginIP }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登陆次数" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.loginTimes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="禁用状态" width="100" align="center">
        <template slot-scope="{row}">
          <!-- <el-popconfirm
            title="你确定禁用该用户吗？"
            trigger="hover"
            @onConfirm="updateUserIsUse(row)"
          > -->
          <el-switch
            slot="reference"
            v-model="row.isUse"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            @change="updateUserUse($event,row)"
          />
          <!-- </el-popconfirm> -->
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
          <el-button type="primary" size="mini" @click="handleResetPassword(row)">
            重置密码
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
        <el-form-item label="用户名" prop="用户名" class="filter-item">
          <el-input v-model="temp.userLoginName" placeholder="请输入用户名" :disabled="dialogStatus==='create'?false:true" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="temp.userShowName" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="头像">
          <el-button size="small" type="primary">点击上传头像</el-button>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="temp.phone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="temp.eMail" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker v-model="temp.birthDate" type="date" placeholder="请选择出生日期" style="width:100%;" />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="temp.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="QQ">
          <el-input v-model="temp.qq" placeholder="请输入QQ" />
        </el-form-item>
        <el-form-item label="微信">
          <el-input v-model="temp.weChat" placeholder="请输入微信" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.descripts" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="描述" />
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

    <el-dialog title="重置密码" :visible.sync="dialogResetPasswordVisible" style="margin-top:-100px;">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="70px" style="width: 85%; margin-left:50px;">
        <el-form-item label="用户名" prop="用户名" class="filter-item">
          <el-input v-model="resetPasswordTemp.userLoginName" placeholder="请输入用户名" :disabled="dialogStatus==='create'?false:true" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="resetPasswordTemp.newPassword" show-password placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="resetPasswordTemp.reNewPassword" show-password placeholder="请输入确认密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogResetPasswordVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="updateUserNewPassword()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
// import { defineComponent } from '@vue/composition-api'
 import { getUsers, saveUser, deleteUser, updateUserIsUse, resetUserPassword } from '@/api/user'
 import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
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
        keyWord: ''
      },
      temp: {
        id: 0,
        userLoginName: '',
        userShowName: '',
        headPortrait: '',
        phone: '',
        eMail: '',
        birthDate: new Date(),
        idCard: '',
        qq: '',
        weChat: '',
        descripts: ''
      },
      resetPasswordTemp: {
        id: 0,
        userLoginName: '',
        newPassword: '',
        reNewPassword: ''
      },
      dialogFormVisible: false,
      dialogResetPasswordVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '创建用户'
      },
      dialogPvVisible: false,
      pvData: [],
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
      getUsers(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.totalCount

        // Just to simulate the time of the request
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
        userLoginName: '',
        userShowName: '',
        headPortrait: '',
        phone: '',
        eMail: '',
        birthDate: new Date(),
        idCard: '',
        qq: '',
        weChat: '',
        descripts: ''
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
          saveUser(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              message: '新增成功',
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
    handleResetPassword(row) {
      this.resetPasswordTemp.id = row.id
      this.resetPasswordTemp.userLoginName = row.userLoginName
      this.dialogResetPasswordVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          saveUser(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              message: '更改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateUserUse($event, row) {
      let messgae = ''
      if ($event === 1) {
        messgae = `你确定禁用 ${row.userLoginName} 吗？`
        row.isUse = 0
      } else if ($event === 0) {
        messgae = `你确定启用 ${row.userLoginName} 吗？`
        row.isUse = 1
      }
      const arr = []
        arr.push(row.id)
      this.$confirm(messgae, '提示', {}).then(() => {
          updateUserIsUse({ ids: arr, isUse: $event }).then(() => {
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
       this.$confirm(`你确定删除 ${row.userLoginName} 吗？`, '提示', {}).then(() => {
          deleteUser({ ids: arr }).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$message({
              message: '删除成功.',
              type: 'success'
            })
          })
       })
    },
    updateUserNewPassword() {
      resetUserPassword(this.resetPasswordTemp).then(() => {
        this.dialogResetPasswordVisible = false
        this.$message({
          message: '重置成功.',
          type: 'success'
        })
      })
    }
  }
}
</script>
