<template>
  <div class="echartsData">
    <duno-charts
      :isChange="isChangeFlag"
      :isItemEchart="isItemEchart"
      :legendOption="legendOption"
      :xAxisOption="xAxisOption"
      :yAxisOption="yAxisOption"
      :titleOption="titleOption"
      :gridOption="gridOption"
      :seriesOption="seriesOption"
    />
  </div>
</template>

<script>
import { DunoCharts } from "_c/duno-charts";
export default {
  name: "echartsData",
  components: {
    DunoCharts
  },
  props: {
    dataAllList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    legendData: {
      type: Array,
      default: () => {
        return ["4号主变1000千伏侧压变B相", "4号主变1000千伏侧压变C相"];
      }
    },
    xAxisData: {
      type: Array,
      default: () => {
        return [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24"
        ];
      }
    },
    yMax: {
      type: Number,
      default: 100
    },
    yMin: {
      type: Number,
      default: 0
    },
    seriesData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isChange: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    isItemEchart: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    title: {
      type: String,
      default: () => {
        return "泄露电流表24小时温度分析";
      }
    }
  },
  data() {
    const that = this;
    return {
      dataList: [],
      titleOption: {
        text: that.title,
        x: "center",
        y: "20",
        textStyle: {
          color: "#fff",
          fontWeight: "normal"
        }
      },
      legendOption: {
        icon: "circle",
        y: "60",
        textStyle: {
          color: "#fff"
        },
        data: that.legendData
      },
      gridOption: {
        top: "120"
      },
      xAxisOption: {
        type: "category",
        name: "(时)",
        axisLine: {
          show: true, //x轴的线
          lineStyle: {
            color: ["#999"]
          }
        },
        // 控制网格线是否显示
        splitLine: {
          show: false,
          lineStyle: {
            color: ["#999"]
          }
        },
        //除去x轴刻度
        axisTick: {
          show: false
        },
        data: that.xAxisData
      },
      yAxisOption: {
        type: "value",
        name: "(温度℃)",
        max: that.yMax,
        min: that.yMin,
        splitNumber: 5,
        // boundaryGap: ["0", "2"],
        axisLine: {
          show: true, //Y轴的线
          lineStyle: {
            color: ["#999"]
          }
        },
        // 控制网格线是否显示
        splitLine: {
          show: true,
          lineStyle: {
            //网格颜色
            color: ["#999"]
          }
        },
        axisTick: {
          show: false
        }
      },
      //   seriesOption: that.seriesData
      seriesOption: [
        {
          name: "4号主变1000千伏侧压变B相",
          type: "line",
          data: [
            30,
            42,
            75,
            25,
            45,
            86,
            35,
            56,
            56,
            23,
            48,
            12,
            45,
            89,
            25,
            35,
            46,
            48,
            56,
            45,
            78,
            12
          ]
        },
        {
          name: "4号主变1000千伏侧压变C相",
          type: "line",
          data: [
            56,
            35,
            35,
            42,
            36,
            56,
            76,
            45,
            25,
            86,
            48,
            68,
            45,
            75,
            25,
            55,
            44,
            33,
            56,
            45,
            25,
            12
          ]
        }
      ]
    };
  },
  watch: {
    isChange: {
      handler(now) {
        this.isChangeFlag = now;
      },
      immediate: true
    },
    legendData: {
      handler(now) {
        let arr = [];
        if (now && now.length) {
          arr = now;
        }
        this.legendOption.data = arr;
      },
      deep: true
    },
    xAxisData: {
      handler(now) {
        let arr = [];
        if (now && now.length) {
          arr = now;
        }
        // this.xAxisOption.data = arr
      },
      deep: true
    },
    yName(now) {
      this.yAxisOption.yName = now;
    },
    yMax(now) {
      this.yAxisOption.yMax = now;
    },
    yMin(now) {
      this.yAxisOption.yMin = now;
    },
    ySplitNumber(now) {
      this.yAxisOption.ySplitNumber = now;
    },
    seriesData: {
      handler(now) {
        let arr = [];
        if (now && now.length) {
          arr = now;
        }
        this.seriesOption = arr;
      },
      deep: true
    }
  },
  methods: {
    changeType() {
      //   const dataList = res.data.dataList;
      this.dataList = this.dataAllList;
      const legendData = [];
      const xAxisData = [];
      const seriesData = [];
      for (let i = 0; i < dataList.length; i++) {
        legendData.push(dataList[i].itemName);
        const itemDataList = dataList[i].itemDataList;
        const obj = {
          name: dataList[i].itemName,
          type: "line",
          data: []
        };
        for (let item in itemDataList) {
          if (i == 0) {
            xAxisData.push(itemDataList[item].time);
          }
          obj.data.push(Number(itemDataList[item].data));
        }
        seriesData.push(obj);
      }
      that.legendData.push(...legendData);
      that.seriesData.push(...seriesData);
      that.$forceUpdate();
      that.isChangeFlag = !that.isChangeFlag;
    }
  }
};
</script>

<style lang="scss">
.echartsData {
  height: 100%;
  width: 100%;
  background: #142838;
  overflow: hidden;
}
</style>


