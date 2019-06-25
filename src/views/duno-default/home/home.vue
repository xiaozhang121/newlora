<template>
  <div>
    <el-row :gutter="20">
      <el-col :sm="24" :md="12">
        <el-card class="user-infor marginBottom">
          <div>
            <img class="avator-img" :src="avatorPath"/>
            <div class="infor-box">
              <b class="user-infor-name">欢迎您！{{ userName }}</b>
              <p>上次登录时间：{{ user.userinfo.lastTime ? user.userinfo.lastTime : '首次登录' }}</p>
              <p>上次登录地点：{{ user.userinfo.ip ? user.userinfo.ip : '首次登录' }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="24" :md="12">
        <el-row :gutter="20">
          <el-col :sm="24" :md="12" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;" class="marginBottom">
            <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
              <count-to :end="infor.count" count-class="count-style"/>
              <p>{{ infor.title }}</p>
            </infor-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import userInfoLog from "@/assets/images/avatar.jpg"
import { mapState } from 'vuex'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo
  },
  data () {
    const that = this
    return {
      inforCardData: [
        { title: '新增用户', icon: 'icon-shouye', count: 803, color: '#2d8cf0' },
        { title: '累计点击', icon: 'icon-tudangguanli', count: 23432, color: '#19be6b' }
      ],
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    avatorPath() {
      if(this.$store.state.user.avatorImgPath) {
        return this.$store.state.user.avatorImgPath
      }
      return userInfoLog;
    },
    userName() {
      return this.$store.state.user.account
    }
  },
  methods: {},
  mounted () {}
}
</script>
<style lang="scss">
  .count-style{
    font-size: 50px;
  }
</style>
<style lang="scss" scoped>
.user-infor {
    width: 100%;
    height: 120px;
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    position: relative;
  }
  .avator-img {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: block;
    position: absolute;
    top: 23px;
  }
  .infor-box {
    margin-left: 90px;
  }
  .marginBottom {
    margin-bottom: 10px;
  }
</style>