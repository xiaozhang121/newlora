<template>
  <div class="chartBox" :style="'padding-bottom:' + paddingBottom">
    <div ref="dom" class="charts"></div>
    <div class="center">
      <div>{{ chartsInfo['normal'] }}/{{ chartsInfo['total'] }}</div>
      <div v-if="!hiddenM">{{ status }}</div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'ChartAll',
  components: {},
  data () {
    return {
      dom: null,
      status: '正常'
    }
  },
  props: {
    chartsInfo: {
        type: Object,
        default: ()=>{
            return {normal: 1, total: 1}
        }
    },
    hiddenM:{
        type: Boolean,
        default: false
    },
    mainColor: {
       type: String,
       default: '#00ffff'
    },
    /* paddingBottom */
    paddingBottom: String,
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
      default: true
    },
    /* title选项：方法参考echarts API */
    titleOption: {
      type: Object
    },
    /* legend选项：方法参考echarts API */
    legendOption: {
      type: Object | Array
    },
    /*
    * grid选项：方法参考echarts API
    * */
    gridOption: {
      type: Object | Array
    },
    /*
    * xAxis选项：方法参考echarts API
    * */
    xAxisOption: {
      type: Object | Array
    },
    /*
    * yAxis选项：方法参考echarts API
    * */
    yAxisOption: {
      type: Object | Array
    },
    /*
    * polar选项：方法参考echarts API
    * */
    polarOption: {
      type: Object | Array
    },
    /*
    * radiusAxis选项：方法参考echarts API
    * */
    radiusAxisOption: {
      type: Object | Array
    },
    /*
    * angleAxis选项：方法参考echarts API
    * */
    angleAxisOption: {
      type: Object | Array
    },
    /*
    * radar选项：方法参考echarts API
    * */
    radarOption: {
      type: Object | Array
    },
    /*
    * dataZoom选项：方法参考echarts API
    * */
    dataZoomOption: {
      type: Object | Array
    },
    /*
    * visualMap选项：方法参考echarts API
    * */
    visualMapOption: {
      type: Object | Array
    },
    /*
    * tooltip选项：方法参考echarts API
    * */
    tooltipOption: {
      type: Object | Array
    },
    /*
    * axisPointer选项：方法参考echarts API
    * */
    axisPointerOption: {
      type: Object | Array
    },
    /*
    * toolbox选项：方法参考echarts API
    * */
    toolboxOption: {
      type: Object | Array
    },
    /*
    * brush选项：方法参考echarts API
    * */
    brushOption: {
      type: Object | Array
    },
    /*
    * geo选项：方法参考echarts API
    * */
    geoOption: {
      type: Object | Array
    },
    /*
    * parallel选项：方法参考echarts API
    * */
    parallelOption: {
      type: Object | Array
    },
    /*
    * parallelAxis选项：方法参考echarts API
    * */
    parallelAxisOption: {
      type: Object | Array
    },
    /*
    * singleAxis选项：方法参考echarts API
    * */
    singleAxisOption: {
      type: Object | Array
    },
    /*
    * timeline选项：方法参考echarts API
    * */
    timelineOption: {
      type: Object | Array
    },
    /*
    * graphic选项：方法参考echarts API
    * */
    graphicOption: {
      type: Object | Array
    },
    /*
    * calendar选项：方法参考echarts API
    * */
    calendarOption: {
      type: Object | Array
    },
    /*
    * dataset选项：方法参考echarts API
    * */
    datasetOption: {
      type: Object | Array
    },
    /*
    * aria选项：方法参考echarts API
    * */
    ariaOption: {
      type: Object | Array
    },
    /*
    * color选项：方法参考echarts API
    * */
    colorOption: {
      type: Array,
      default: () => {
        return []
      }
    },
    /*
    * series选项：方法参考echarts API
    * */
    seriesOption: {
      type: Array,
      default: () => {
        return []
      }
    },
    /*
    * backgroundColor选项：方法参考echarts API
    * */
    backgroundColorOption: {
      type: String | Object | Array
    },
    /*
    * textStyle选项：方法参考echarts API
    * */
    textStyleOption: {
      type: String | Object | Array
    },
    /*
    * animation选项：方法参考echarts API
    * */
    animationOption: {
      type: String | Object | Array
    },
    /*
    * animationThreshold选项：方法参考echarts API
    * */
    animationThresholdOption: {
      type: String | Object | Array
    },
    /*
    * animationDuration选项：方法参考echarts API
    * */
    animationDurationOption: {
      type: String | Object | Array
    },
    /*
    * animationEasing选项：方法参考echarts API
    * */
    animationEasingOption: {
      type: String | Object | Array
    },
    /*
    * animationDelay选项：方法参考echarts API
    * */
    animationDelayOption: {
      type: String | Object | Array
    },
    /*
    * animationDurationUpdate选项：方法参考echarts API
    * */
    animationDurationUpdateOption: {
      type: String | Object | Array
    },
    /*
    * animationEasingUpdate选项：方法参考echarts API
    * */
    animationEasingUpdateOption: {
      type: String | Object | Array
    },
    /*
    * animationDelayUpdate选项：方法参考echarts API
    * */
    animationDelayUpdateOption: {
      type: String | Object | Array
    },
    /*
    * blendMode选项：方法参考echarts API
    * */
    blendModeOption: {
      type: String | Object | Array
    },
    /*
    * hoverLayerThreshold选项：方法参考echarts API
    * */
    hoverLayerThresholdOption: {
      type: String | Object | Array
    },
    /*
    * useUTC选项：方法参考echarts API
    * */
    useUTCOption: {
      type: String | Object | Array
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
    isChange (now) {
      this.setOption()
    }
  },
  methods: {
    /* 颜色合并 */
    colorPush (data) {
      if (data && data.length) {
        const colorArr = data
        for (let i in tdTheme.color) {
          colorArr.push(tdTheme.color[i])
        }
        return colorArr
      } else {
        return tdTheme.color
      }
    },
    /* 绘制图表的方法 */
    setOption () {
      let that = this
      let value1 = Number(Number(that.chartsInfo['normal']/that.chartsInfo['total'] * 134).toFixed(0))
      if(value1 >= 60){
          that.status = '正常'
      }  else{
          that.status = '异常'
      }
      let option = {
          title: {

          },
          series: [
              {
                  "name": 'demo',
                  "type": 'pie',
                  "radius": ['80%', '96%'],
                  "avoidLabelOverlap": false,
                  "startAngle": 225,
                  "color": ["#9f8fc1"],
                  "hoverAnimation": false,
                  "legendHoverLink": false,
                  "label": {
                      "normal": {
                          "show": false,
                          "position": 'center'
                      },
                      "emphasis": {
                          "show": true,
                          "textStyle": {
                              "fontSize": '30',
                              "fontWeight": 'bold'
                          }
                      }
                  },
                  "labelLine": {
                      "normal": {
                          "show": false
                      }
                  },
                  itemStyle: {

                  },
                  "data": [{
                      "value": 100,
                      "name": '   '
                  }]
              },
              {
                  "name": '',
                  "type": 'pie',
                  "radius": ['79.7%', '96.4%'],
                  "avoidLabelOverlap": false,
                  "startAngle": 315,
                  "color": ["#cccccc", "transparent"],
                  "hoverAnimation": false,
                  "legendHoverLink": false,
                  "clockwise": false,
                  "itemStyle":{
                      "normal":{
                          "borderColor":"transparent",
                          "borderWidth":"20"
                      },
                      "emphasis":{
                          "borderColor":"transparent",
                          "borderWidth":"20"
                      }
                  }
                  ,
                  "z":10,
                  "label": {
                      "normal": {
                          "show": false,
                          "position": 'center'
                      },
                      "emphasis": {
                          "show": true,
                          "textStyle": {
                              "fontSize": '30',
                              "fontWeight": 'bold'
                          }
                      }
                  },
                  "labelLine": {
                      "normal": {
                          "show": false
                      }
                  },
                  "data": [{
                      "value": (134 - value1) * 270 / 360,
                      "name": ' '
                  }, {
                      "value": 100 - (134 - value1) * 270 / 360,
                      "name": '7'
                  }
                  ]
              }

          ]
      }
      option['series'][0]['color'] = [this.mainColor]
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
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    /*padding-bottom: 50%;*/
    .center{
       color: white;
       text-align: center;
       font-size: 13px;
      & > div:last-child{
        /*font-size: 14px;*/
      }
    }
    .charts {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
</style>