<template>
  <div class="polygonal" :style="{width:width+'px'}">
     <p>云台可见光-TGTYS</p>
    <div class="time">
      <div>
        <el-radio-group v-model="radio" @change="onChangeRadio">
          <el-radio :label="1">今日</el-radio>
          <el-radio :label="2">昨日</el-radio>
        </el-radio-group>
      </div>
      <div class="block">
        <el-date-picker
          v-model="value"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="onChangeTime"
        ></el-date-picker>
      </div>
    </div>
    <div class="echarts">
      <duno-charts
        :isChange="isChange"
        :isItemEchart="isItemEchart"
        :legendOption="legendOption"
        :xAxisOption="xAxisOption"
        :yAxisOption="yAxisOption"
        :seriesOption="seriesOption"
      />
    </div>
    <p class="move">你可拖拽设备图标至此处进行对比</p>
  </div>
</template>

<script>
import moment from 'moment'
import { DunoCharts } from "_c/duno-charts";
import { constants } from 'crypto';
export default {
  name: "Polygonal",
  components: { DunoCharts },
  props: {
    width: {
      type: String,
      default: ""
    },
    legendData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    xAxisData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    xName: {
      type: String,
      default: "(时)"
    },
    yName: {
      type: String,
      default: "(温度℃)"
    },
    yMax: {
      type: Number,
      default: 100
    },
    yMin: {
      type: Number,
      default: 0
    },
    ySplitNumber: {
      type: Number,
      default: 5
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
        return true
      }
    },
    isItemEchart: {
      type: Boolean,
      default: () => {
        return true
      }
    }
  },
  data() {
    const that = this
    return {
      radio: 1,
      value: "",
      datePeriod: "",
      legendOption: {
        icon: "circle",
        textStyle: {
          color: "#999"
        },
        data: that.legendData
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
        name: that.yName,
        max: that.yMax,
        min: that.yMin,
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
      seriesOption: that.seriesData
    };
  },
  methods: {
    onChangeRadio(data) {
      this.radio = data;
      let date = null
      let arr = []
      if(data == 1){
        date = moment()
      }else{
        date = moment().subtract(1, 'days')
      }
      arr.push(date,date)
      this.$emit("onChange", arr);
    },
    onChangeTime(data) {
      this.datePeriod = data;
      this.radio = null;
      this.$emit("onChange", this.datePeriod);
    },
    handle() {
      this.$emit("changeHandle");
    }
  },
  watch: {
    legendData: {
      handler(now) {
        let arr = []
        if (now && now.length) {
          arr = now
        }
        this.legendOption.data = arr
      },
      deep: true
    },
    xAxisData: {
      handler(now) {
        let arr = []
        if (now && now.length) {
          arr = now
        }
        this.xAxisOption.data = arr
      },
      deep: true
    },
    yName(now) {
      this.yAxisOption.yName = now
    },
    yMax(now) {
      this.yAxisOption.yMax = now
    },
    yMin(now) {
      this.yAxisOption.yMin = now
    },
    ySplitNumber(now) {
      this.yAxisOption.ySplitNumber = now
    },
    seriesData: {
      handler(now) {
        let arr = []
        if (now && now.length) {
          arr = now
        }
        this.seriesOption = arr
      },
      deep: true
    }
  },
  mounted () {}
};
</script>

<style lang="scss">
.polygonal {
  height: 100%;
  .time {
    overflow: hidden;
    margin-top: 20px;
    & > div {
      float: left;
      .el-radio {
        margin-right: 20px;
        .el-radio__label {
          color: #fff;
        }
      }
    }
    & > div:first-child {
      margin-top: 5px;
      margin-right: 30px;
    }
  }
  &  .move {
    color: #999;
    text-align: center;
    font-size: 14px !important;
  }
  .block {
    .el-date-editor {
      background-color: rgba(81, 89, 112, 0.7);
      border: none;
      .el-range-input {
        background-color: rgba(81, 89, 112, 0);
      }
      .el-range-separator {
        font-size: 20px;
        color: #fff;
      }
      .el-range-input {
        color: #fff;
      }
    }
  }
  .echarts {
    margin-top: 30px;
  }
}
.el-picker-panel {
  background-color: rgba(47, 51, 63, 0.7);
  color: #fff;
  border: none;
  .el-picker-panel__body-wrapper {
    .el-picker-panel__body {
      .in-range {
        div {
          background-color: rgba(81, 89, 112, 0.7);
        }
      }
    }
  }
}
</style>


