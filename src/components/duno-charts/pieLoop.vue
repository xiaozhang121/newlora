<template>
  <div class="chartBox" :style="'padding-bottom:' + paddingBottom">
    <div ref="dom" class="charts chart-pie"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './chartsColor.json'
export default {
  name: 'ChartPie',
  data () {
    return {
      dom: null
    }
  },
  props: {
    /* paddingBottom */
    paddingBottom: String,
    /*
    * 数据，格式示例：[{ value: 335, name: '直接访问' }]
    * */
    value: Array,
    /*
    * 标题
    * */
    text: String,
    /*
    * 副标题
    * */
    subtext: String,
    /*
    * 是否显示标题
    * */
    isShowTitle: { type: Boolean, default: true },
    /*
    * 标题的位置
    * */
    titlePosition: { type: String, default: 'center' },
    /*
    * 图表的颜色，可以自定义，有默认值如下：
    * */
    colorOption: {
      type: Array,
      default () {
        return []
      }
    },
    /*
        * tooltip选项 方法参考echarts API
        * */
    tooltipOption: {
      type: Object,
      default () {
        return {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        }
      }
    },
    /*
    * legend选项：方法参考echarts API
    * */
    legendOption: {
      type: Object,
      default () {
        return {
          orient: 'vertical',
          left: 'left',
          data: []
        }
      }
    },
    isPie: {
      type: Boolean,
      default: true
    },
    /*
    * 饼图或者环形图半径
    * */
    radiusOption: {
      type: String | Array,
      default: ''
    },
    /*
    * 饼图的中心（圆心）坐标
    * */
    centerOption: {
      type: Array,
      default () {
        return ['50%', '50%']
      }
    },
    /*
    * 当环形图时的选项
    * */
    seriesLabelOption: {
      type: Object,
      default () {
        return {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '18',
              fontWeight: 'bold'
            }
          }
        }
      }
    },
    /*
    * 数据是否发生变化，变化以后重新渲染图表
    * */
    isChange: {
      type: Boolean,
      default: false
    },
    /*
    * 是否不需要等待数据立即显示图表
    * */
    isItemEchart: {
      type: Boolean,
      default: false
    },
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
    isChange (now) {
      this.setOption()
    }
  },
  methods: {
    setOption () {
      const that = this
      let legend = that.value.map(_ => _.name)
      let option = {
        title: {
          show: that.isShowTitle,
          text: that.text,
          subtext: that.subtext,
          x: that.titlePosition
        },
        tooltip: that.tooltipOption,
        legend: that.legendOption,
        color: that.colorOption.length ? that.colorOption : tdTheme.color,
        series: [
          {
            type: 'pie',
            radius: that.radiusOption ? that.radiusOption : (that.isPie ? '50%' : ['30%', '55%']),
            center: that.centerOption,
            data: that.value,
            avoidLabelOverlap: false,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            roseType: 'radius'
          }
        ]
      }
      if (!that.legendOption.data || !that.legendOption.data.length) {
        that.legendOption.data = legend
      }
      if (!that.isPie) {
        option.series[0]['label'] = that.seriesLabelOption
      }
      that.dom.clear()
      that.dom.setOption(option)
    }
  },
  mounted () {
    let that = this
    that.dom = echarts.init(that.$refs.dom)
    that.$nextTick(() => {
      if (that.isItemEchart) {
        that.setOption()
      }
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
    padding-bottom: 90%;
    .charts {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
</style>