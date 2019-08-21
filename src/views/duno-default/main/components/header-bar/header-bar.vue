<template>
  <div class="header-bar">
    <div class="logo-con">
      <img :src="maxLogo" key="max-logo" />
    </div>
    <div class="header-middle">
      <el-button @click="activeChange(1)" :class="[$store.state.app.topNav == '1' ? 'activeBtn' : '']" class="title">功能卡片</el-button>
      <el-button @click="activeChange(2)" :class="[$store.state.app.topNav == '2' ? 'activeBtn' : '']" class="title">操作中台</el-button>
      <el-button @click="activeChange(3)" :class="[$store.state.app.topNav == '3' ? 'activeBtn' : '']" class="title">视频监控</el-button>
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
      activeBtn: '-1',
      maxLogo,
      dateTime: ''
    }
  },
  props: {
    collapsed: Boolean
  },
  watch:{
      activeBtn(now, old){
          this.$store.state.app.topNav = now
          sessionStorage.setItem('topNav', now)
          if(old == -1){
            return
          }
          if(now == 3){
                this.$router.push({name:'surveillanceList'})
          }else if(now == 2){
              this.$router.push({name:'_realEnv'})
          }else if(now == 1){
                this.$router.push({name:'abnormalInfoList'})
          }
      }
  },
  computed: {
      ...mapState([
          'app'
      ])
  },
  methods: {
    activeChange(flag){
        this.activeBtn = flag
        this.$store.state.app.topNav = flag
        if(flag == 1){
            this.$router.push({name:'abnormalInfoList'})
        }else if(flag == 2){
            this.$router.push({name:'_realEnv'})
        }else if(flag == 3){
            this.$router.push({name:'surveillanceList'})
        }
    },
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
      // this.activeBtn = this.$store.state.app.topNav
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
    margin-right: 50px;
    color: #fff;
    opacity: 0.6;
  }
  .timeDate {
    color: #fff;
    // opacity: 0.6;
    float: left;
    font-size: 16px;
    margin-right: 20px;
  }
  .header-middle{
    .title{
      font-size: 18px;
      background: url(../../../../../../src/assets/buttonPng/unchoose.png) no-repeat;
      background-cover: contain;
    }
  }
</style>
