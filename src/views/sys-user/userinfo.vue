<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card style="margin-bottom:20px;">
          <div slot="header" class="clearfix">
            <span>用户信息</span>
          </div>
          <div class="user-profile">
            <div class="box-center">
              <pan-thumb class="text-center" :image="user.headPortrait" :height="'100px'" :width="'100px'">
                <div>Hello</div>
              </pan-thumb>
            </div>
            <div class="box-center">
              <div class="user-name text-center">{{ user.userShowName }}</div>
              <div class="user-role text-center text-muted">{{ user.userLoginName }}</div>
            </div>
            <div class="box-center">
              <div class="user-name text-center">简介：{{ user.introduction }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18" :xs="24">
        <el-card>
          <el-tabs v-model="Activity">
            <el-tab-pane label="Activity" name="activity">
              <div class="user-activity">
                <div class="box-center">
                  <el-form ref="dataForm" label-position="right" label-width="70px" style="width: 85%; margin-left:50px;">
                    <el-form-item label="角色名">
                      <el-input placeholder="请输入角色名" />
                    </el-form-item>
                    <el-form-item label="描述">
                      <el-input :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="描述" />
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import PanThumb from '@/components/PanThumb'
import { getUserInfo } from '@/api/user'

export default {
  components: { PanThumb },
  data() {
    return {
      user: {
        userLoginName: '',
        userShowName: '',
        headPortrait: '',
        introduction: ''
      },
      activeTab: 'activity'
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getUserInfo().then(response => {
          this.user = response.data
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
