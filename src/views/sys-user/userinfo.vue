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
          <el-tabs v-model="activeTab">
            <el-tab-pane label="更改密码" name="updatePassword">
              <div class="user-activity">
                <div class="box-center" style="width:100%;">
                  <el-form ref="dataForm" label-position="right" label-width="90px" style="width: 85%; margin-left:50px;">
                    <el-form-item label="原密码">
                      <el-input v-model="password.oldPassword" show-password placeholder="请输入原密码" />
                    </el-form-item>
                    <el-form-item label="新密码">
                      <el-input v-model="password.newPassword" show-password placeholder="请输入新密码" />
                    </el-form-item>
                    <el-form-item label="确认新密码">
                      <el-input v-model="password.reNewPassword" show-password placeholder="请输入确认新密码" />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="updatePassword()">
                        确认保存
                      </el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="更改头像" name="updateHeadPortrait">
              <div class="user-activity">
                <div class="box-center" style="width:100%;">
                  <el-form ref="dataForm" label-position="right" label-width="90px" style="width: 85%; margin-left:50px;">
                    <el-form-item>
                      <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                      >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                      </el-upload>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="uploadHeadPortrait()">
                        确认更改
                      </el-button>
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
import { getUserInfo, updateUserPassword } from '@/api/user'

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
      password: {
        oldPassword: '',
        newPassword: '',
        reNewPaswword: ''
      },
      activeTab: 'updatePassword',
      imageUrl: ''
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
    },
    updatePassword() {
      updateUserPassword(this.password).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        this.password = {
          oldPassword: '',
          newPassword: '',
          reNewPaswword: ''
        }
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

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
