<template>
  <div @click="showMessage" class="header-icon">
    <el-tooltip :content="isDot ? '有' + value + '条未读消息' : '无未读消息'" placement="bottom">
      <el-badge :is-dot="isDot" :hidden="!isDot">
        <i class="duno-iconfont duno-xiaoxi"></i>
        <p>消息</p>
      </el-badge>
    </el-tooltip>
  </div>
</template>

<script>
import { getAxiosData } from '@/api/axiosType.js'
import { mapState } from 'vuex'
export default {
  name: 'messageTip',
  data () {
    return {
      value: 0
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    messageNum () {
      return this.$store.state.user.msgNum
    },
    isDot () {
      return this.value > 0
    }
  },
  watch: {
    messageNum (now) {
      this.value = now
    }
  },
  methods: {
    showMessage () {
      this.$router.push({ name: 'messageList' })
    },
    getData () {
      const that = this
      const url = '/venus/user/massage/num'
      const query = { 'account': that.user.account }
      getAxiosData(url, query).then(res => {
        if (res.code !== 200) {
          that.value = 0
          return false
        }
        that.value = res.data
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="scss">
  .header-icon{
    color: white;
  }
</style>
