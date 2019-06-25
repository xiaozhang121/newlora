<template>
  <div class="chartBox" :style="'padding-bottom:' + paddingBottom">
    <div ref="dom" class="charts"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import echartsLiquidfill from 'echarts-liquidfill'
import tdTheme from './chartsColor.json'
export default {
  name: 'ChartBar',
  components: {},
  data () {
    return {
      dom: null
    }
  },
  props: {
    /* paddingBottom */
    paddingBottom: String,
    /* 球内显示的内容 */
    label: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /*
    * 水球内的数据，每一项的值是0-1
    * */
    data: {
      type: Array,
      default: () => {
        return [0.5, 0.3, 0.4, 0.2]
      }
    },
    /*
    * 水填充图的形状 circle默认圆形  rect圆角矩形  triangle三角形  diamond菱形  pin水滴状 arrow箭头状  还可以是svg的path
    * */
    shape: String,
    /* 水球背景设置 */
    backgroundStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /* 轮廓设置 */
    outline: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /* 图表相对于盒子的位置 第一个是水平的位置 第二个是垂直的值 默认是[50%,50%]是在水平和垂直方向居中 可以设置百分比 也可以设置具体值 */
    center: {
      type: Array,
      default: () => {
        return ['50%', '50%']
      }
    },
    /* 图表的大小 值是圆的直径 可以是百分比 也可以是具体值 100%则占满整个盒子 默认是40%; 百分比下是根据宽高最小的一个为参照依据 */
    radius: {
      type: String,
      default: () => {
        return '97%'
      }
    },
    /* 振幅 是波浪的震荡幅度 可以取具体的值 也可以是百分比 百分比下是按图标的直径来算 */
    amplitude: {
      type: Number,
      default: () => {
        return 20
      }
    },
    /* 波的长度 可以是百分比也可以是具体的像素值  百分比下是相对于直径的 取得越大波浪的起伏越小 */
    waveLength: {
      type: String,
      default: () => {
        return '80%'
      }
    },
    /* 波移动的速度 两个参数  left 从右往左 right 从左往右 */
    direction: {
      type: String,
      default: () => {
        return 'right'
      }
    },
    /* 控制波动画的开关  值是布尔值 false 是关闭动画 true 是开启动画 也是默认值 */
    waveAnimation: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    /*
    * 数据是否发生变化，变化以后重新渲染图表
    * */
    isChange: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isCollapsed () {
      return this.$store.state.user.isCollapsed
    }
  },
  watch: {
    isCollapsed (now) {
      let that = this
      let timer = setInterval(() => {
        that.dom.resize()
      }, 100)
      setTimeout(() => {
        clearInterval(timer)
      }, 200)
    },
    isChange(now) {
      this.setOption()
    }
  },
  methods: {
    setOption () {
      let that = this
      let option = {
        series: [
          {
            type: 'liquidFill', //类型
            shape: that.shape, //水填充图的形状 circle默认圆形  rect圆角矩形  triangle三角形  diamond菱形  pin水滴状 arrow箭头状  还可以是svg的path
            data: that.data, //数据是个数组 数组的每一项的值是0-1
            center: that.center, //图表相对于盒子的位置 第一个是水平的位置 第二个是垂直的值 默认是[50%,50%]是在水平和垂直方向居中 可以设置百分比 也可以设置具体值
            radius: that.radius,  //图表的大小 值是圆的直径 可以是百分比 也可以是具体值 100%则占满整个盒子 默认是40%; 百分比下是根据宽高最小的一个为参照依据
            amplitude: that.amplitude,   //振幅 是波浪的震荡幅度 可以取具体的值 也可以是百分比 百分比下是按图标的直径来算
            waveLength: that.waveLength, //波的长度 可以是百分比也可以是具体的像素值  百分比下是相对于直径的 取得越大波浪的起伏越小
            // phase: 0 , //波的相位弧度 默认情况下是自动
            /* period: (value,index)=>{ //控制波的移动速度 可以是函数 也可以是数字 两个参数  value 是data数据里面的值 index 是data值的索引
              return index*2000;
            }, */
            direction: that.direction, //波移动的速度 两个参数  left 从右往左 right 从左往右
            waveAnimation: that.waveAnimation, //控制波动画的开关  值是布尔值 false 是关闭动画 true 是开启动画 也是默认值
            /* emphasis: {
              itemStyle: {
                opacity: 0.9 //鼠标经过波浪颜色的透明度
              }
            }, */
            label: that.label, /* {
              normal: {
                  formatter: function() {
                    return '年平均流量\n1234m²';
                  },
                  textStyle: {
                    fontSize: 18,
                    color: '#D94854'
                  }
              }
            }, */
            backgroundStyle: that.backgroundStyle,
            outline: that.outline,
          }
        ]
      }
      that.dom.clear()
      that.dom.setOption(option)
    }
  },
  mounted () {
    let that = this
    that.dom = echarts.init(that.$refs.dom)
    that.$nextTick(() => {
      that.setOption()
      that.dom.resize()
      window.addEventListener('resize', function () {
        that.dom.resize()
      })
    })
  }
}
</script>

<style lang="scss" scoped>
  .chartBox {
    width: 100%;
    height: 0;
    position: relative;
    padding-bottom: 100%;
    .charts {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
</style>
