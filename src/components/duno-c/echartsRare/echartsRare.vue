<template>
  <div class="echarts-rare">
    <div :style="{width:width}">
      <duno-charts
        :isChange="isChangeKps"
        :legendOption="legendKps"
        :titleOption="titleKps"
        :paddingBottom="paddingBottom"
        :isItemEchart="true"
        :tooltipOption="tooltipOption"
        :xAxisOption="xAxisKps"
        :yAxisOption="yAxisKps"
        :seriesOption="seriesKps"
        :colorOption="colorSpeed"
      ></duno-charts>
    </div>
    <div :style="{width:width}">
      <duno-charts
        :isChange="isChangeIo"
        :legendOption="legendIo"
        :titleOption="titleIo"
        :tooltipOption="tooltipOption"
        :paddingBottom="paddingBottom"
        :isItemEchart="true"
        :xAxisOption="xAxisIo"
        :yAxisOption="yAxisIo"
        :seriesOption="seriesIo"
        :colorOption="colorSpeed"
      ></duno-charts>
    </div>
    <div :style="{width:width}">
      <duno-charts
        :isChange="isChangeCpu"
        :titleOption="titleCpu"
        :paddingBottom="paddingBottom"
        :isItemEchart="true"
        :xAxisOption="xAxisCpu"
        :yAxisOption="yAxisCpu"
        :seriesOption="seriesCpu"
        :colorOption="colorSpeed"
      ></duno-charts>
    </div>
    <div :style="{width:width}" v-show="seriesGpuVisible">
      <el-carousel trigger="click">
        <el-carousel-item>
          <duno-charts
            :isChange="isChangeGpu"
            :titleOption="titleGpu"
            :paddingBottom="paddingBottom"
            :isItemEchart="true"
            :xAxisOption="xAxisGpu"
            :yAxisOption="yAxisCpu"
            :seriesOption="seriesGpu"
            :colorOption="colorSpeed"
          ></duno-charts>
        </el-carousel-item>
        <el-carousel-item v-if="browse">
          <duno-charts
            :isChange="isChangeGpu"
            :titleOption="titleGpu"
            :paddingBottom="paddingBottom"
            :isItemEchart="true"
            :xAxisOption="xAxisTwoGpu"
            :yAxisOption="yAxisCpu"
            :seriesOption="seriesTwoGpu"
            :colorOption="colorSpeed"
          ></duno-charts>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<script>
import { DunoCharts } from "_c/duno-charts";
import { getAxiosData, postAxiosData } from "@/api/axiosType";
export default {
  name: "dunoPie",
  components: {
    DunoCharts
  },
  props: {
    serve: {
      type: String,
      default: () => {
        return "";
      }
    },
    width: {
      type: String,
      default: () => {
        return "48%";
      }
    },
    paddingBottom: {
      type: String,
      default: () => {
        return "280px";
      }
    },
    pieData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      seriesGpuVisible: true,
      browseData: [],
      browse: true,
      tooltipOption: {
        trigger: "axis"
      },
      isChangeKps: true,
      legendKps: {
        // type: "scroll",
        top: "30",
        left: "center",
        orient: "horizontal",
        data: ["出网kbs", "入网kbs"],
        textStyle: {
          color: "#fff"
        }
      },
      titleKps: {
        text: "出入网速率",
        left: "center",
        textStyle: {
          color: "#fff"
        }
      },
      xAxisKps: {
        type: "category",
        name: "(min)",
        // boundaryGap: false,
        data: [],
        axisLine: {
          lineStyle: {
            color: "#46565f"
          }
        },
        axisTick: {
          show: false
        },
        nameTextStyle: {
          padding: [25, 0, 0, 0]
        },
        axisLabel: {
          interval: 0
        }
      },
      yAxisKps: [
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
      seriesKps: [
        {
          name: "出网kbs",
          type: "bar",
          barWidth: 20,
          data: []
        },
        {
          name: "入网kbs",
          type: "bar",
          barWidth: 20,
          data: []
        }
      ],
      isChangeIo: true,
      legendIo: {
        // type: "scroll",
        top: "30",
        left: "center",
        orient: "horizontal",
        data: ["读（MB/s）", "写（MB/s）"],
        textStyle: {
          color: "#fff"
        }
      },
      titleIo: {
        text: "读写速率",
        left: "center",
        textStyle: {
          color: "#fff"
        }
      },
      xAxisIo: {
        type: "category",
        name: "(min)",
        boundaryGap: false,
        data: [],
        axisLine: {
          lineStyle: {
            color: "#46565f"
          }
        },
        axisTick: {
          show: false
        },
        nameTextStyle: {
          padding: [25, 0, 0, 0]
        },
        axisLabel: {
          interval: 0
        }
      },
      yAxisIo: [
        {
          type: "value",
          name: "(MB)",
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
      seriesIo: [
        {
          name: "读（MB/s）",
          type: "line",
          stack: "读",
          data: []
        },
        {
          name: "写（MB/s）",
          type: "line",
          stack: "写",
          data: []
        }
      ],
      isChangeCpu: true,
      titleCpu: {
        text: "CPU使用率",
        left: "center",
        textStyle: {
          color: "#fff"
        }
      },
      xAxisCpu: {
        type: "category",
        name: "(min)",
        boundaryGap: false,
        data: [],
        axisLine: {
          lineStyle: {
            color: "#46565f"
          }
        },
        axisTick: {
          show: false
        },
        nameTextStyle: {
          padding: [25, 0, 0, 0]
        },
        axisLabel: {
          interval: 0
        }
      },
      yAxisCpu: [
        {
          type: "value",
          name: "(%)",
          max: 100,
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
      seriesCpu: [
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
          data: [],
          itemStyle: {
            normal: {
              color: "#05e6eb",
              borderColor: "#05e6eb"
            }
          }
        }
      ],
      isChangeGpu: true,
      titleGpu: {
        text: "GPU使用率",
        left: "center",
        textStyle: {
          color: "#fff"
        }
      },
      xAxisGpu: {
        type: "category",
        name: "(min)",
        boundaryGap: false,
        data: [],
        axisLine: {
          lineStyle: {
            color: "#46565f"
          }
        },
        axisTick: {
          show: false
        },
        nameTextStyle: {
          padding: [25, 0, 0, 0]
        }
      },
      xAxisTwoGpu: {
        type: "category",
        name: "(min)",
        boundaryGap: false,
        data: [],
        axisLine: {
          lineStyle: {
            color: "#46565f"
          }
        },
        axisTick: {
          show: false
        },
        nameTextStyle: {
          padding: [25, 0, 0, 0]
        }
      },
      seriesGpu: [
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
          data: [],
          itemStyle: {
            normal: {
              color: "#05e6eb",
              borderColor: "#05e6eb"
            }
          }
        }
      ],
      seriesTwoGpu: [
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
          data: [],
          itemStyle: {
            normal: {
              color: "#05e6eb",
              borderColor: "#05e6eb"
            }
          }
        }
      ]
    };
  },
  watch: {
    pieData: {
      handler() {
        this.getBar();
        if (this.seriesGpu[0].data.length > 0) {
          this.changeWidth(0);
        } else {
          this.changeWidth(1);
        }
      },
      deep: true
    }
  },
  methods: {
    getBar() {
      let that = this;
      let netUrl = "/lenovo-mon/api/monitoring/net/zabbix/getNetByHostId";
      let diskUrl = "/lenovo-mon/api/monitoring/disk/zabbix/getDiskByHostId";
      let cupUrl = "/lenovo-mon/api/monitoring/pro/zabbix/getCpuByHostId";
      let gupUrl = "/lenovo-mon/api/monitoring/host/zabbix/gpu/load";
      let query = {
        hostid: that.pieData.hostId
      };
      let queryGpu = {
        hostId: that.pieData.hostId
      };
      getAxiosData(netUrl, query).then(res => {
        let netData = res.data;
        let outData = [];
        let enterData = [];
        let timeData = [];
        netData.forEach(el => {
          outData.push(el.netOut);
          enterData.push(el.netInput);
          timeData.push(el.createTime.substr(5));
        });
        that.xAxisKps.data = timeData;
        that.seriesKps[0].data = outData;
        that.seriesKps[1].data = enterData;
        that.isChangeKps = !that.isChangeKps;
        that.$forceUpdate();
      });
      getAxiosData(diskUrl, query).then(res => {
        let diskData = res.data;
        let outData = [];
        let enterData = [];
        let timeData = [];
        diskData.forEach(el => {
          outData.push(el.ioRead);
          enterData.push(el.ioWrite);
          timeData.push(el.createTime.substr(5));
        });
        that.xAxisIo.data = timeData;
        that.seriesIo[0].data = enterData;
        that.seriesIo[1].data = outData;
        that.isChangeIo = !that.isChangeIo;
        that.$forceUpdate();
      });
      getAxiosData(cupUrl, query).then(res => {
        let cupData = res.data;
        let usedData = [];
        let timeData = [];
        if (that.serve == "") {
          cupData.forEach(el => {
            usedData.push(el.used / el.total);
            timeData.push(el.createTime.substr(5));
          });
        } else {
          cupData.forEach(el => {
            usedData.push(el.used);
            timeData.push(el.createTime.substr(5));
          });
        }
        that.xAxisCpu.data = timeData;
        that.seriesCpu[0].data = usedData;
        that.isChangeCpu = !that.isChangeCpu;
        that.$forceUpdate();
      });
      getAxiosData(gupUrl, queryGpu).then(res => {
        let browseData = res.data;
        let gupData = res.data[0].load;
        let usedData = [];
        let timeData = [];
        gupData.forEach(el => {
          usedData.push(el.used);
          timeData.push(el.time);
        });
        that.xAxisGpu.data = timeData;
        that.seriesGpu[0].data = usedData;
        let gpuDataLength = usedData.length;
        if (!gpuDataLength) {
          this.$emit("changeWidth", 99, "32%");
        }
        that.seriesGpuVisible = Boolean(gpuDataLength);
        if (browseData.length == 2) {
          let twoGpuData = res.data[1].load;
          let twoUsedData = [];
          let twoTimeData = [];
          twoGpuData.forEach(el => {
            twoUsedData.push(el.used);
            twoTimeData.push(el.time);
          });
          that.xAxisTwoGpu.data = twoTimeData;
          that.seriesTwoGpu[0].data = twoUsedData;
        } else {
          this.browse = false;
        }
        that.isChangeGpu = !that.isChangeGpu;
        that.$forceUpdate();
      });
    },
    changeWidth(item) {
      this.$emit("changeWidth", item);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getBar();
    });
    if (this.seriesGpu[0].data.length > 0) {
      this.changeWidth(0);
    } else {
      this.changeWidth(1);
    }
  }
};
</script>
<style lang="scss">
.echarts-rare {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  & > div {
    margin-left: 1%;
  }
  .el-carousel__indicators{
    display: none;
  }
}
</style>
