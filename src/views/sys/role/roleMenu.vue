<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <div class="user-profile">
          <el-card style="margin-bottom:20px;">
            <div v-for="role in roleList" :key="role">
              <el-button type="text">
                {{ role.roleName }}
              </el-button>
            </div>
            <el-tree :data="roleList" :props="defaultProps" />
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
 import { getRoles } from '@/api/role'

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
