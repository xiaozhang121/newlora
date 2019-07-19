<style lang="scss">
  @import './login.scss';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <el-card icon="log-in" title="" :bordered="false">
        <div slot="header" class="clearfix">
          <span>欢迎登录</span>
        </div>
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" :isLoading="isLoading"></login-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import LoginForm from './components/login-form.vue'
import { mapActions } from 'vuex'
import { postAxiosData } from '@/api/axiosType'
export default {
  components: {
    LoginForm
  },
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password, code, uuid }) {
      this.isLoading = true
      this.handleLogin({ userName, password, code, uuid }).then(res => {
        if (res.code === 200) {
          this.getUserInfo().then(res => {
            this.getLoginData(userName, password)
            this.isLoading = false
            this.$router.push({ name: 'realEnvList' })
          })
        } else {
          this.isLoading = false
          this.$message.error(res.msg)
        }
      })
    },
    getLoginData(userName, password) {
      const url = '/api/userService/userLogin'
      const query = {
        "userName": userName,
        "password": password,
        "userType": "ADMIN",
        "loginSource": "WEB",
        "department": "LR"
      }
      postAxiosData(url, query).then(res => {
        localStorage.setItem('ms_userType','ADMIN')
        localStorage.setItem('ms_userId', res.userId)
        localStorage.setItem('ms_userName', userName)
        localStorage.setItem('ms_accessToken',res.accessToken)
      })
    }
  }
}
</script>

<style></style>
