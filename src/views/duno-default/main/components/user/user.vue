<template>
  <div class="user-avator-dropdown">
    <el-dropdown @command="handleClick" :show-timeout="150">
      <div class="el-dropdown-link">
        <img class="userAvator" :src="userAvator" alt="头像"/>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <!-- <el-dropdown-item command="personal">个人中心</el-dropdown-item> -->
        <!-- <el-dropdown-item command="advise" divided>意见反馈</el-dropdown-item> -->
        <el-dropdown-item command="password">修改密码</el-dropdown-item>
        <!--<el-dropdown-item command="feedBack" divided>问题反馈</el-dropdown-item>-->
        <el-dropdown-item command="alarmTip" divided>告警提示设置</el-dropdown-item>
        <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog class="passDialog" title="更改密码" :modal="false" :visible.sync="isShow" :close-on-press-escape="!dataListLoading" :show-close="!dataListLoading" :close-on-click-modal="false">
      <el-form ref="formValidate" :model="formData">
        <input-tep
          label="原密码"
          prop="oldPassword"
          type="password"
          :initialValue="formData.oldPassword"
          placeholder="请输入原密码"
          :rules="{ required: true, message: '请输入原密码', trigger: 'blur' }"
          @onChange="onChange"
        />

        <input-tep
          label="新密码"
          prop="newPassword"
          type="password"
          :initialValue="formData.newPassword"
          placeholder="请输入新密码"
          :rules="verifyNewPassword"
          @onChange="onChange"
        />

        <input-tep
          label="确认密码"
          prop="newPasswords"
          type="password"
          :initialValue="formData.newPasswords"
          placeholder="请输入确认密码"
          :rules="verifyNewPasswords"
          @onChange="onChange"
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="dataListLoading" @click="handleSubmit('formValidate')">确 定</el-button>
        <el-button @click="isShow = false" :disabled="dataListLoading">取 消</el-button>
      </div>
    </el-dialog>
    <feed-back :visible="feedBackVisible" @on-close="onClose"></feed-back>
    <warning-setting @handleClose="onCloseSetting" :visibleOption="visibleSettingOption" />
  </div>
</template>

<script>
import './user.scss'
import warningSetting from "_c/duno-j/warningSetting";
import { mapActions } from 'vuex'
import { postAxiosData } from '@/api/axiosType.js'
import { InputTep } from '_c/Form'
import debounce from 'lodash/debounce'
import feedBack from "_c/duno-m/feedBack";
export default {
  name: 'User',
  components: { InputTep, feedBack, warningSetting },
  data () {
    return {
      visibleSettingOption: false,
      isShow: false,
      dataListLoading: false,
      feedBackVisible: false,
      formData: {
        oldPassword: '',
        newPassword: '',
        newPasswords: ''
      }
    }
  },
  computed: {
    verifyNewPassword () {
      const that = this
      const verifyNewPassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error('不能为空'))
        } else {
          let myReg = /^[0-9a-zA-Z]{6,18}$/;
          if(!myReg.test(value)){
            callback(new Error('请输入6-18位密码且不能有特殊字符'))
          }
          if ((value === that.formData.newPasswords && that.formData.newPasswords) || !that.formData.newPasswords) {
            callback()
          } else {
            callback(new Error('两次密码不一致'))
          }
        }
      }
      return [{ required: true, validator: verifyNewPassword, min:6, max:18, trigger: 'blur' }]
    },
    verifyNewPasswords () {
      const that = this
      const verifyNewPasswords = (rule, value, callback) => {
        if (!value) {
          callback(new Error('不能为空'))
        } else {
          if ((value === that.formData.newPassword && that.formData.newPassword) || !that.formData.newPassword) {
            callback()
          } else {
            callback(new Error('两次密码不一致'))
          }
        }
      }
      return [{ required: true, validator: verifyNewPasswords, trigger: 'blur' }]
    },
    userAvator () {
      return this.$store.state.user.avatorImgPath
    },
    newPassword () {
      return this.formData.newPassword
    },
    newPasswords () {
      return this.formData.newPasswords
    }
  },
  watch: {
    newPassword (now) {
      if (now && now == this.formData.newPasswords) {
        this.$refs.formValidate.validateField('newPasswords')
      }
    },
    newPasswords (now) {
      if (now && now == this.formData.newPassword) {
        this.$refs.formValidate.validateField('newPassword')
      }
    },
    isShow (now) {
      if (!now) {
        for (const item in this.formData) {
          this.formData[item] = ''
        }
        this.$refs.formValidate.clearValidate()
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    onCloseSetting() {
        this.visibleSettingOption = false;
    },
    onClose(){
        this.feedBackVisible = false
    },
    goToLogin () {
      this.handleLogOut().then(() => {
        this.getLogOutData()
        this.$router.push({ name: 'login' })
      })
    },
    getLogOutData() {
      const url = '/api/userService/userLogout'
      const userId = localStorage.getItem('ms_userId')
      const token = localStorage.getItem('ms_accessToken')
      const query = {
        "userId": userId,
        "token": token
      }
      postAxiosData(url, query).then(res => {
        localStorage.removeItem('ms_userType')
        localStorage.removeItem('ms_userId')
        localStorage.removeItem('ms_userName')
        localStorage.removeItem('ms_accessToken')
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.goToLogin()
          break
        case 'personal': 
          this.$router.push({ name: 'memberCenter' })
          break
        case 'advise': 
          this.$router.push({ name: 'feedbackAdd' })
          break
        case 'password': 
          this.isShow = true
          break
        case 'feedBack':
          this.feedBackVisible = true
          break
        case 'alarmTip':
          this.visibleSettingOption = true
          break
      }
    },
    onChange (obj) {
      this.formData[obj.name] = obj.value
      this.$refs.formValidate.validateField(obj.name)
    },
    // 修改密码
    amendPassword () {
      const that = this
      const query = {
        userId: this.$store.state.user.userId,
        oldPassword: that.formData.oldPassword,
        newPassword: that.formData.newPassword
      }
      that.dataListLoading = true
      let url = '/lenovo-user/api/user/reset-password'
      postAxiosData(url, query).then(res => {
        that.dataListLoading = false
        if (res.code !== 200) {
          return that.$message.error(res.msg)
        }
        that.isShow = false
        that.$message.success(res.msg)
        this.goToLogin()
      }, error => {
        that.dataListLoading = false
      })
    },
    handleSubmit: debounce(function (name) {
      const that = this
      that.$refs[name].validate((valid) => {
        if (valid) {
          that.amendPassword()
        } else {
          that.$message.error('请完善信息')
        }
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
<style lang="scss">
.user-avator-dropdown{
  margin-left: 20px;
}
.passDialog {
  .el-dialog {
    background: rgba(27, 59, 71, 0.7);
  }
  .el-dialog__title, .el-form-item__label {
    color: #fff;
  }
  .el-input__inner {
    background: transparent;
  }
}
</style>
