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
    data() {
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
      * 是否显示提示框组件。
      * */
      isToolbox: {
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
      * grid选项：方法参考echarts API
      * */
      gridOption: {
        type: Object,
        default() {
          return {
            height: '35.7%',
            top: '4%',
            width: '85%',
            left: '5.5%'
          }
        }
      },
      /*
      * tooltip选项中的自定义提示方式，注意自定义此函数时，函数内有参数,例如： tooltipFunction(params)
      * */
      tooltipFunction: { type: Function },
      /*
      * 是否显示标题
      * */
      isShowTitle: { type: Boolean, default: false },
      /*
      * 标题的位置
      * */
      titlePosition: { type: String, default: 'center' },
      /*
      * tooltip选项 方法参考echarts API
      * */
      tooltipOption: { type: Object, default () { return {} } },
      /*
      * toolbox选项：自定义toolbox提示框组件，方法参考echarts API
      * */
      toolboxObject: { type: Object, default () { return {} } },
      /*
      * 背景颜色
      * */
      backgroundColor: { type: String, default: '#fff' }
    },
    computed: {
      isCollapsed() {
        return this.$store.state.user.isCollapsed
      }
    },
    watch: {
      isCollapsed(now) {
        let that = this
        let timer = setInterval(() => {
          that.dom.resize()
        }, 100)
        setTimeout(() => {
          clearInterval(timer)
        }, 200)
      },
      isChange(now) {
        this.setOption(this.xAxis, this.value)
      }
    },
    methods: {
      setOption(xAxisData, seriesData) {
        let that = this
        let colorList = tdTheme.color
        let option = {
          title: { show: that.isShowTitle, text: that.title, subtext: that.subTitle, x: that.titlePosition, padding: [10, 0] },
          grid: that.gridOption,
          tooltip: {
            formatter: function (params) {
              if (that.tooltipFunction) {
                return that.tooltipFunction(params)
              } else {
                return params[0].name + ': ' + params[0].value
              }
            },
            ...that.tooltipOption
          },
          xAxis: {
            data: xAxisData,
            name: that.xAxisName,
            axisTick: {show: false},
            axisLine: {show: false},
            axisLabel: {
              textStyle: {
                color: 'black'
              }
            }
          },
          yAxis: {
            splitLine: {show: false},
            axisTick: {show: false},
            axisLine: {show: false},
            axisLabel: {show: false}
          },
          series: function () {
            let serie = []
            let obj = {}
            let data = []
            let body = seriesData[0].data
            for (let i = 0; i < xAxisData.length; i++) {
              obj = {
                value: body[i].value,
                itemStyle: {color: colorList[i], borderColor: 'white'}
              }
              data.push(obj)
            }
            let newObj = {
              name: 'hill',
              type: 'pictorialBar',
              barCategoryGap: '-130%',
              symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
              label: {
                normal: {
                  show: true,
                  position: 'inside'
                }
              },
              itemStyle: {
                normal: {
                  opacity: 1
                },
                emphasis: {
                  opacity: 1
                },
              },
              data: data
            }
            serie.push(newObj)
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
        if (that.isToolbox || that.isSaveAsImage) {
          option['toolbox'] = {
            show: true,
            right: 10,
            feature: {
              saveAsImage: { show: that.isSaveAsImage },
              ...that.toolboxObject
            }
          }
        }
        that.dom.clear()
        that.dom.setOption(option)
      }
    },
    mounted() {
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
    padding-bottom: 55%;
    .charts {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
</style>
