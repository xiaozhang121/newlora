export { default as DunoChartPieLoop } from './pieLoop.vue' // 饼图
export { default as DunoChartBarLine } from './barLine.vue' // 柱状/折线图
export { default as DunoChartTriangle } from './triangle.vue' // 气象项目柱状三角图
export { default as DunoWaterPolo } from './waterPolo.vue' // 水球图
export { default as DunoCharts } from './charts.vue' // charts架构，参数参考echarts官网api

/* 
  使用方法
  import { DunoChartPieLoop } from '_c/duno-city-ganged'

  <duno-chart-pie-loop
    :value="[{ value: 335, name: '直接访问' }]"
    :isChange="true/false"
    :isItemEchart="true/false"
  />

  import { DunoChartBarLine } from '_c/duno-city-ganged'

  <duno-chart-bar-line
    :value="[{data: [], label: 'XXX'}]"
    :xAxis="[]"
    :isChange="true/false"
    :isItemEchart="true/false"
  />

  import { DunoChartTriangle } from '_c/duno-city-ganged'

  <duno-chart-triangle
    :value="[{data: [], label: 'XXX'}]"
    :xAxis="[]"
    :isChange="true/false"
    :isItemEchart="true/false"
  />

  import { DunoWaterPolo } from '_c/duno-city-ganged'

  <duno-water-polo
    :label="{
              normal: {
                  formatter: function() {
                    return '水球内文字';
                  },
                  textStyle: {
                    fontSize: 18,
                    color: '#D94854'
                  }
              }
            }"
    :isChange="true/false"
  />

  import { DunoCharts } from '_c/duno-city-ganged'

  <duno-water-polo
    :isChange="true/false"
    :isItemEchart="true/false"
    :titleOption="{}"
    :xAxisOption="{}"
    :yAxisOption="{}"
    :seriesOption="[]"
  >
*/