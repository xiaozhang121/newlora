<template>
  <div class="chartBox" :style="'padding-bottom:' + paddingBottom">
    <div ref="dom" class="charts"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
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
    /*
    * 图表数据：格式示例：[{data: [], label: 'XXX'}]
    * */
    value: Array,
    /*
    * X坐标轴的数据数组
    * */
    xAxis: Array,
    /*
    * 标题
    * */
    title: String,
    /*
    * 副标题
    * */
    subTitle: String,
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
    /*
    * 是否显示区域缩放功能
    * */
    isDataZoom: {
      type: Boolean,
      default: false
    },
    /*
    * 是否显示图例组件
    * */
    isLegend: {
      type: Boolean,
      default: true
    },
    /*
    * 是否显示提示框组件。
    * */
    isToolbox: {
      type: Boolean,
      default: false
    },
    /*
    * 是否显示提示框组件中的动态类型切换
    * */
    isMagicType: {
      type: Boolean,
      default: false
    },
    /*
    * 是否显示提示框组件中的保存为图片功能
    * */
    isSaveAsImage: {
      type: Boolean,
      default: false
    },
    /*
    * X轴单位
    * */
    xAxisName: {
      type: String,
      default: ''
    },
    /*
    * Y轴单位
    * */
    yAxisName: {
      type: String,
      default: ''
    },
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
    tooltipOption: { type: Object, default () { return {} } },
    /*
    * tooltip选项中的自定义提示方式，注意自定义此函数时，函数内有参数,例如： tooltipFunction(params)
    * */
    tooltipFunction: { type: Function },
    /*
    * toolbox选项：自定义toolbox提示框组件，方法参考echarts API
    * */
    toolboxObject: { type: Object, default () { return {} } },
    /*
    * grid选项：方法参考echarts API
    * */
    gridOption: {
      type: Object,
      default () {
        return {
          top: 80,
          containLabel: true
        }
      }
    },
    /*
    * legend选项：方法参考echarts API
    * */
    legendOption: { type: Object, default () { return {} } },
    /*
    * 是否为柱状图
    * */
    isBarCharts: { type: Boolean, default: true },
    /*
    * 是否显示标题
    * */
    isShowTitle: { type: Boolean, default: true },
    /*
    * 标题的位置
    * */
    titlePosition: { type: String, default: 'center' },
    /*
    * 背景颜色
    * */
    backgroundColor: { type: String, default: '#fff' }
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
      this.setOption(this.xAxis, this.value)
    }
  },
  methods: {
    setOption (xAxisData, seriesData) {
      let that = this
      let option = {
        title: { show: that.isShowTitle, text: that.title, subtext: that.subTitle, x: that.titlePosition, padding: [10, 0] },
        grid: that.gridOption,
        tooltip: {
          trigger: 'item',
          axisPointer: { type: 'line' },
          formatter: function (params) {
            if (that.tooltipFunction) {
              return that.tooltipFunction(params)
            } else {
              const color = params.color
              let htmlStr = '<div>'
              htmlStr += params.name + '<br/>' // x轴的名称
              htmlStr += '<span style="margin-right:5px; display:inline-block; width:10px; height:10px; border-radius:5px; background-color:' + color + ';"></span>'
              // 添加一个汉字，这里你可以格式你的数字或者自定义文本内容
              htmlStr += (params.seriesName ? params.seriesName + '：' : '') + params.value + '<br/>'
              htmlStr += '</div>'
              return htmlStr
            }
          },
          ...that.tooltipOption
        },
        color: that.colorOption.length ? that.colorOption : tdTheme.color,
        xAxis: { type: 'category', data: xAxisData, name: that.xAxisName },
        yAxis: { type: 'value', boundaryGap: ['0', '0.1'], name: that.yAxisName },
        series: function () {
          let serie = []
          for (let i = 0; i < seriesData.length; i++) {
            let data = []
            for (let j = 0; j < seriesData[i].data.length; j++) {
              if (seriesData[i].data[j] !== '-') {
                data.push(Number(seriesData[i].data[j]).toFixed(2))
              } else {
                data.push(seriesData[i].data[j])
              }
            }
            let newObj = {
              name: seriesData[i].label,
              type: that.isBarCharts ? 'bar' : 'line',
              barMaxWidth: seriesData.length < 1 ? '10%' : seriesData.length < 4 ? '25%' : seriesData.length > 7 ? '' : '35%',
              data: data
            }
            serie.push(newObj)
          }
          return serie
        }(),
        backgroundColor: that.backgroundColor
      }
      /*
      *dataZoom 组件 用于区域缩放
      * */
      if (that.isDataZoom) {
        option['dataZoom'] = [{ show: true, start: 0, end: 100 }, { type: 'inside', start: 0, end: 100 }]
      }
      /*
      * toolbox选项
      * */
      if (that.isToolbox || that.isMagicType || that.isSaveAsImage) {
        option['toolbox'] = {
          show: true,
          right: 10,
          feature: {
            magicType: { show: that.isMagicType, type: ['line', 'bar'] },
            saveAsImage: { show: that.isSaveAsImage },
            ...that.toolboxObject
          }
        }
      }
      /*
      * legend选项
      * */
      if (that.isLegend) {
        option['legend'] = {
          show: true,
          type: 'scroll',
          orient: 'horizontal',
          top: 40,
          itemWidth: 20,
          data: function () {
            let serie = []
            for (let i = 0; i < seriesData.length; i++) {
              serie.push(seriesData[i].label)
            }
            return serie
          }(),
          selected: function () {
            let serie = {}
            for (let i = 0; i < seriesData.length; i++) {
              if (i === 0) {
                serie[seriesData[i].label] = true
              } else {
                serie[seriesData[i].label] = false
              }
            }
            return serie
          }(),
          ...that.legendOption
        }
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
        that.setOption(that.xAxis, that.value)
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
    padding-bottom: 45%;
    .charts {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
</style>
