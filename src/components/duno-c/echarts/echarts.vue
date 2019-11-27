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
      paddingBottom="200px"
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
    dataOBJ: {
      type: [Object, Array],
      default: ()=>{
        return {}
      }
    },
    unit: {},
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
        name: that.yName,
        minInterval: 1,
        data: ["合", "分"],
        // max: that.yMax,
        // min: that.yMin,
        splitNumber: that.ySplitNumber,
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
    dataOBJ: {
      handler(now){
        if(Object.keys(now).length){
          const that = this
          that.seriesOption = [];
          that.legendOption.data = [];
          that.xAxisOption.data = [];
          if (that.echartsKind == 1) {
            this.yAxisOption["type"] = "category";
            this.yAxisOption.splitLine.show = false;
          }else{
            this.yAxisOption["type"] = "value";
            this.yAxisOption.splitLine.show = false;
          }
          that.legendOption.data.push(...now.legendData);
          that.seriesOption.push(...now.seriesData);
          that.xAxisOption.data.push(...now.xAxisData);
          that.$forceUpdate();
          that.isChangeFlag = !that.isChangeFlag
        }
      },
      deep: true,
      immediate: true
    },
    unit:{
        handler(now){
            if(now)
              this.yAxisOption['name'] = now
        },
        immediate: true
    },
    dataAllList(now) {
      this.dataList = now;
      this.changeType();
    },
    title(now) {
      this.titleOption.text = now;
    }
  },
  methods: {
    changeType() {
      let that = this;
      that.dataList = that.dataAllList;
      const legendData = [];
      let xAxisData = [];
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
        xAxisData = []
        let obj = {
          name: that.dataList[i].itemName,
          type: "line",
          data: []
        };
        if(this.echartsKind){
            obj['step'] = 'start'
        }
        for (let item in itemDataList) {
          xAxisData.push(itemDataList[item].time);
          obj.data.push(Number(itemDataList[item].data));
        }
        seriesData.push(obj);
      }
      // that.yAxisOption.max = Math.ceil(yMax.sort((a, b) => b - a)[0]);
      // that.yAxisOption.min = Math.floor(yMin.sort((a, b) => a - b)[0]);
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


