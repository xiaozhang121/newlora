<template>
  <div class="header-bar">
    <div class="logo-con">
      <img :src="maxLogo" key="max-logo" />
    </div>
    <div class="header-middle">
      <el-button @click="activeBtn = '1'" :class="[activeBtn == '1' ? 'activeBtn' : '']" class="title">异常信息</el-button>
      <el-button @click="activeBtn = '2'" :class="[activeBtn == '2' ? 'activeBtn' : '']" class="title">设备中台</el-button>
      <el-button @click="activeBtn = '3'" :class="[activeBtn == '3' ? 'activeBtn' : '']" class="title">视频监控</el-button>
    </div>
    <div class="custom-content-con">
      <div class="dateTime"><span class="timeDate">练塘站</span>{{ dateTime }}</div>
      <slot></slot>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import './header-bar.scss'
import moment from 'moment'
import maxLogo from '@/assets/images/logo.png'
import { mapState } from 'vuex'
export default {
  name: 'HeaderBar',
  components: {
    siderTrigger
  },
  data () {
    return {
      activeBtn: '2',
      maxLogo,
      dateTime: ''
    }
  },
  props: {
    collapsed: Boolean
  },
  watch:{
      activeBtn(now){
          debugger
          this.$store.state.app.topNav = now
          sessionStorage.setItem('topNav', now)
          if(now == 3){
              this.$router.push({name:'surveillanceName'})
          }else if(now == 2){
              this.$router.push({name:'_realEnv'})
          }
      }
  },
  computed: {
      ...mapState([
          'app'
      ])
  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    },
    getDateTime () {
        const that = this
        const date = new Date()
        let time = moment(date).format('YYYY.MM.DD HH:mm:ss')
        that.dateTime = time
    }
  },
  created(){
      this.activeBtn = this.$store.state.app.topNav
  },
  mounted (){
      const that = this
      setInterval(() => {
          that.getDateTime()
      }, 1000)
  }
}
</script>
<style lang="scss" scoped>
  .dateTime{
    float: left;
    margin-right: 20px;
    color: #999;
  }
  .timeDate {
    color: #fff;
    float: left;
    margin-right: 20px;
  }
  .header-middle{
    .title{
      line-height: 25px;
      font-size: 16px;
    }
  }
</style>
