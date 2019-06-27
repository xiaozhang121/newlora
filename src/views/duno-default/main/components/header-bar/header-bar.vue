<template>
  <div class="header-bar">
    <div class="logo-con">
      <img :src="maxLogo" key="max-logo" />
    </div>
    <!--<sider-trigger :collapsed="collapsed" @on-change="handleCollpasedChange"></sider-trigger>-->
    <div class="custom-content-con">
      <div class="dateTime"><span class="timeDate">UTC+08:00</span>{{ dateTime }}</div>
      <slot></slot>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import './header-bar.scss'
import moment from 'moment'
import maxLogo from '@/assets/images/logo.png'

export default {
  name: 'HeaderBar',
  components: {
    siderTrigger
  },
  data () {
    return {
      maxLogo,
      dateTime: ''
    }
  },
  props: {
    collapsed: Boolean
  },
  computed: {
    
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
    color: #666;
    float: left;
    margin-right: 20px;
  }
</style>
