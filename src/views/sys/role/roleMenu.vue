<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <div class="user-profile">
          <el-card style="margin-bottom:20px;">
            <el-tree :data="roleList" :props="defaultProps" @node-click="roleClick" />
          </el-card>
        </div>
      </el-col>
      <el-col :span="18" :xs="24">
        <div class="user-profile">
          <el-card style="margin-bottom:20px;">
            <el-tree :data="roleMenuList" show-checkbox :props="roleMenuProps" />
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getRoles } from '@/api/role'
import { getRoleMenus } from '@/api/system/roleMenu'

export default {
  data() {
    return {
      roleList: null,
      listQuery: {
        pageIndex: 1,
        pageSize: 100
      },
      defaultProps: {
        label: 'roleName'
      },
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
      getRoles(this.listQuery).then(response => {
        this.roleList = response.data.items
      })
    },
    roleClick(data) {
      console.log(data)
      this.getRoleMenus(data)
    },
    getRoleMenus(query) {
      this.query.roleId = query.id
      getRoleMenus(this.query).then(response => {
        this.roleMenuList = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
