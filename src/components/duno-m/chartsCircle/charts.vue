<template>
  <div class="chartBox" :style="'padding-bottom:' + paddingBottom">
    <div ref="dom" class="charts"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'ChartAll',
  components: {},
  data () {
    return {
      dom: null
    }
  },
  props: {
    allPanel: {},
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
      let text = ''
      let value1 = Number(that.allPanel*100).toFixed(1)
      if(value1 >= 60)  {
          text =  '健康'
      }else{
          text =  '异常'
      }
      let option = {
          title: {
              "text": text,
              "x": '47.2%',
              "y": '71%',
              textAlign: "center",
              "textStyle": {
                  "fontWeight": 'normal',
                  "color": 'white',
                  "fontSize": 14
              },
              "subtextStyle": {
                  "fontWeight": 'bold',
                  "fontSize": 32,
                  "color": 'white'
              }
          },
          series: [
              /*  {//指针内环
                          "type": 'pie',
                          "hoverAnimation": false,
                          "legendHoverLink": false,
                          "radius": ['0%', '5%'],
                          "center": ['50%','60%'],
                          "label": {
                              "normal": {
                                  "show": false
                              }
                          },
                          "labelLine": {
                              "normal": {
                                  "show": false
                              }
                          },
                          "data": [{
                              "value": 100,
                              itemStyle: {
                                  normal: {
                                      color: "#fff"
                                  }
                              }
                          }]
                      },*/
              {
                  name: ' ',
                  type: 'gauge',
                  radius:'50%',
                  "center": ['50%','65%'],
                  detail:{
                      formatter: function (value) {
                          return value.toFixed(1)+'%';
                      },
                      offsetCenter: ['0', '-130%'],
                      fontSize: 16,
                      fontWeight: 'bold',
                      show: true,
                      color: 'white'
                  },
                  startAngle: 200, //开始角度
                  endAngle: -20, //结束角度
                  markPoint:{
                      symbol: 'circle',
                      symbolSize:7,
                      data:[
                          //跟你的仪表盘的中心位置对应上，颜色可以和画板底色一样
                          {x:'center',y:'65%',itemStyle:{color:'#041624'}}
                      ],
                      itemStyle:{
                          borderColor:'#39c49b'
                      }
                  },
                  title: {
                      show: false
                  },
                  data: [{
                      value: value1,
                  }],

                  axisTick: {
                      show: false
                  },

                  splitLine: {
                      show: false
                  },
                  axisLine: {
                      lineStyle: {
                          width: 0,
                          color: [
                              [1, 'transparent']
                          ]
                      }
                  },

                  axisLabel: {
                      /*formatter:function(v){

                      }*/

                  },
                  itemStyle:{
                      color:'#39c49b' ,
                      borderColor: '#39c49b',
                      borderWidth: 2,
                      // shadowColor: 'red',
                      // shadowOffsetY: 10

                  },
                  pointer: {
                      show: true,
                      length: "100%",
                      width: 0
                  }
              },
              {
                  "name": 'demo',
                  "type": 'pie',
                  "radius": ['80%', '96%'],
                  "avoidLabelOverlap": false,
                  "startAngle": 225,
                  "color": ["#ee1133","#ffcc21","#55ffcc","transparent"],
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
                      "value": 27,
                      "name": '1'
                  },{
                      "value": 18,
                      "name": '2'
                  },{
                      "value": 30,
                      "name": '3'
                  }, {
                      "value": 25,
                      "name": '4'
                  }]
              },
              {
                  "name": '',
                  "type": 'pie',
                  "radius": ['80.3%', '96.4%'],
                  "avoidLabelOverlap": false,
                  "startAngle": 315,
                  "color": ["#cdcdcd", "transparent"],
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
                      "value": (100 - value1) * 270 / 360,
                      "name": ' '
                  }, {
                      "value": 100 - (100 - value1) * 270 / 360,
                      "name": '7'
                  }
                  ]
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
    /*padding-bottom: 50%;*/
    .charts {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
</style>