<template>
  <div class="echarts-rare">
    <div :style="{width:width}">
      <duno-charts
        :isChange="isChangeSpeed"
        :legendOption="legendSpeed"
        :titleOption="titleSpeed"
        paddingBottom="60%"
        :isItemEchart="true"
        :xAxisOption="xAxisSpeed"
        :yAxisOption="yAxisSpeed"
        :seriesOption="seriesSpeed"
        :colorOption="colorSpeed"
      ></duno-charts>
    </div>
    <div :style="{width:width}">
      <duno-charts
        :isChange="isChangeSpeed"
        :legendOption="legendSpeed"
        :titleOption="titleSpeed"
        paddingBottom="60%"
        :isItemEchart="true"
        :xAxisOption="xAxisRead"
        :yAxisOption="yAxisSpeed"
        :seriesOption="seriesRead"
        :colorOption="colorSpeed"
      ></duno-charts>
    </div>
    <div :style="{width:width}">
      <duno-charts
        :isChange="isChangeSpeed"
        :legendOption="legendSpeed"
        :titleOption="titleSpeed"
        paddingBottom="60%"
        :isItemEchart="true"
        :xAxisOption="xAxisRead"
        :yAxisOption="yAxisSpeed"
        :seriesOption="seriesCUP"
        :colorOption="colorSpeed"
      ></duno-charts>
    </div>
    <div :style="{width:width}">
      <duno-charts
        :isChange="isChangeSpeed"
        :legendOption="legendSpeed"
        :titleOption="titleSpeed"
        paddingBottom="60%"
        :isItemEchart="true"
        :xAxisOption="xAxisRead"
        :yAxisOption="yAxisSpeed"
        :seriesOption="seriesCUP"
        :colorOption="colorSpeed"
      ></duno-charts>
    </div>
  </div>
</template>
<script>
import { DunoCharts } from "_c/duno-charts";
export default {
  name: "dunoPie",
  components: {
    DunoCharts
  },
  props: {
    width: {
      type: String,
      default: () => {
        return "50%";
      }
    }
  },
  data() {
    return {
      dataList: [{}, {}, {}, {}],
      isChangeSpeed: true,
      legendSpeed: {
        // type: "scroll",
        top: "30",
        left: "center",
        orient: "horizontal",
        data: ["出网pbs", "入网pbs"],
        // data: [
        //   {
        //     name: "出网pbs",
        //     icon: "circle"
        //   },
        //   {
        //     name: "入网pbs",
        //     icon: "circle"
        //   }
        // ],
        textStyle: {
          color: "#fff"
        }
      },
      titleSpeed: {
        text: "出入网速率",
        left: "center",
        textStyle: {
          color: "#fff"
        }
      },
      xAxisSpeed: {
        type: "category",
        name: "(min)",
        // boundaryGap: false,
        data: ["08:05:00", "08:10:00", "08:15:00", "08:20:00"],
        axisLine: {
          lineStyle: {
            color: "#46565f"
          }
        },
        axisTick: {
          show: false
        },
        nameTextStyle: {
          padding: [25, 0, 0, -20]
        }
      },
      xAxisRead: {
        type: "category",
        name: "(min)",
        boundaryGap: false,
        data: ["08:05:00", "08:10:00", "08:15:00", "08:20:00"],
        axisLine: {
          lineStyle: {
            color: "#46565f"
          }
        },
        axisTick: {
          show: false
        },
        nameTextStyle: {
          padding: [25, 0, 0, -20]
        }
      },
      yAxisSpeed: [
        {
          type: "value",
          name: "(k)",
          axisLine: {
            lineStyle: {
              color: "#46565f"
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: "#2a3c47"
            }
          },
          nameTextStyle: {
            padding: [0, 25, 0, 0]
          }
        }
      ],
      colorSpeed: ["#1b6697", "#53cbc3"],
      seriesSpeed: [
        {
          name: "出网pbs",
          type: "bar",
          barWidth: 20,
          data: [25, 35, 32, 31]
        },
        {
          name: "入网pbs",
          type: "bar",
          barWidth: 20,
          data: [36, 31, 26, 45]
        }
      ],
      seriesRead: [
        {
          name: "出网pbs",
          type: "line",
          stack: "总量",
          data: [25, 35, 32, 31]
        },
        {
          name: "入网pbs",
          type: "line",
          stack: "总量",
          data: [36, 31, 26, 45]
        }
      ],
      seriesCUP: [
        {
          name: "出网pbs",
          type: "line",
          //   stack: "总量",
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#05e6eb" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#091f2c" // 100% 处的颜色#
                }
              ],
              global: false // 缺省为 false
            }
          },
          smooth: true,
          symbol: "none",
          //   symbolSize: 0,
          sampling: "average",
          data: [25, 35, 32, 31],
          itemStyle: {
            normal: {
              color: "#05e6eb",
              borderColor: "#05e6eb"
            }
          }
        }
      ]
    };
  }
};
</script>
<style lang="scss">
.echarts-rare {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
</style>