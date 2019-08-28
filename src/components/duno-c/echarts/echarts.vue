<template>
  <div class="echartsData">
    <duno-charts
      :isChange="isChangeFlag"
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
    echartsKind:{

    },
    dataAllList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    title: {
      type: String,
      default: () => {
        return "油温数据";
      }
    },
    gridOptionTop: {
      type: String,
      default: () => {
        return "120";
      }
    }
  },
  data() {
    const that = this;
    return {
      dataList: [],
      isChangeFlag: true,
      titleOption: {
        text: "油温数据",
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
        data: []
      },
      gridOption: {
        top: that.gridOptionTop
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
        data: []
      },
      yAxisOption: {
        type: "value",
        name: "(温度℃)",
        max: 100,
        min: 0,
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
      seriesOption: []
    };
  },
  watch: {
    dataAllList(now) {
      this.dataList = now;
      this.changeType();
    },
    title(now) {
      this.titleOption.text = now + "油温数据";
      this.changeType();
    }
  },
  methods: {
    changeType() {
      let that = this;
      that.dataList = that.dataAllList;
      const legendData = [];
      const xAxisData = [];
      const seriesData = [];
      const yMax = [];
      const yMin = [];
      that.seriesOption = [];
      that.legendOption.data = [];
      that.xAxisOption.data = [];
      for (let i = 0; i < that.dataList.length; i++) {
        legendData.push(that.dataList[i].itemName);
        const itemDataList = that.dataList[i].itemDataList;
        yMax.push(Number(that.dataList[i].maxData));
        yMin.push(Number(that.dataList[i].minData));
        let obj = {
          name: that.dataList[i].itemName,
          type: "line",
          data: []
        };
        if(this.echartsKind){
            obj['step'] = 'start'
        }
        for (let item in itemDataList) {
          if (i == 0) {
            xAxisData.push(itemDataList[item].time);
          }
          obj.data.push(Number(itemDataList[item].data));
        }
        seriesData.push(obj);
      }
      that.yAxisOption.max = Math.ceil(yMax.sort((a, b) => b - a)[0]);
      that.yAxisOption.min = Math.floor(yMin.sort((a, b) => a - b)[0]);
      that.legendOption.data.push(...legendData);
      that.seriesOption.push(...seriesData);
      that.xAxisOption.data.push(...xAxisData);
      that.$forceUpdate();
      that.isChangeFlag = !that.isChangeFlag;
    }
  },
  mounted() {
    this.changeType();
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


