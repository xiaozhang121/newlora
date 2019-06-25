<template>
  <div class="duno-progress">
    <el-progress :type="type" :percentage="value" :status="status" :stroke-width="strokeWidth" :show-text="showText" :width="width" :color="color" :text-inside="textInside"></el-progress>
    <h3>{{ loadingText }}</h3>
    <h3><el-button type="danger" @click="Timeout(true)">终止</el-button></h3>
  </div>
</template>
<script>
import { getAxiosData } from '@/api/axiosType'
export default {
  name: 'progressTep',
  components: {},
  data () {
    return {
      value: 0, // 显示的进度
      recordVal: 0, // 伪装进度记录
      status: null,
      timekeeping: null, // 定时发起请求
      timePlan: null, // 定时伪装进度
    }
  },
  props: {
    type: {
      type: String,
      default: 'circle'
    },
    axiosUrl: {
      type: String
    },
    strokeWidth: {
      type: Number,
      default: () => {
        return 12
      }
    },
    width: {
      type: Number,
      default: () => {
        return 130
      }
    },
    color: String,
    textInside: Boolean,
    showText: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    loadingText: {
      type: String,
      default: () => {
        return '数据加载中...'
      }
    },
    query: Object
  },
  computed: {},
  watch: {
    value (now) {
      if (now >= 100) {
        this.status = 'success'
        this.Timeout()
      }
    },
    recordVal (now) {
      if (now >= 99) {
        clearInterval(this.timePlan)

      }
    }
  },
  methods: {
    /* 获取当前进度 */
    getProgress () {
      const that = this
      const url = that.axiosUrl.indexOf('/') === 0 ? that.axiosUrl : `/${that.axiosUrl}`
      getAxiosData(url, that.query).then( res => {
        if (res.code === 200) {
          let num = (Number(res.data.succNum) / Number(res.data.taskNum)) * 100
          if (that.value < num) {
            that.value = num
          }
        } else {
          that.Timeout(true)
        }
      }, error => {
        that.Timeout(true)
      })
    },
    /* 间隔2.5秒发起一次请求 */
    timeInterval () {
      let that = this
      /* 请求进度定时器 */
      that.timekeeping = setInterval(() => {
        that.getProgress()
      }, 2500)
      /* 伪装进度定时器 */
      that.timePlan = setInterval(() => {
        if (that.recordVal <= 99) {
          that.recordVal += 1
          if (that.value > that.recordVal) {
            that.recordVal = JSON.parse(JSON.stringify(that.value))
          } else {
            that.value = JSON.parse(JSON.stringify(that.recordVal))
          }
        }
      }, 3000)
    },
    /* 停止计时器，并且在0.8秒后出现提示成功的消息 */
    Timeout (falg) {
      let that = this
      clearInterval(that.timePlan)
      clearInterval(that.timekeeping)
      if (!falg) {
        setTimeout(function () {
          /* 告诉父组件，进度已经完成可以关闭组件 */
          that.$emit('on-hide')
          that.$message.success('进度完成')
        }, 800)
      } else {
        that.$emit('on-hide')
        that.$message.error('进度失败')
      }
    }
  },
  mounted () {
    const that = this
    /* 检查是否有获取进度的url地址 */
    if (!that.axiosUrl) {
      that.$notify({
        type: 'warning',
        title: '缺少参数',
        message:'组件参数示例: axiosUrl="xxxx"'
      })
      that.$emit('on-hide')
    } else {
      that.$nextTick(() => {
        /* 调用计时器 */
        that.timeInterval()
      })
    }
  }
}
</script>
<style lang="scss">
  @import "./index.scss";
</style>