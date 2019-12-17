<template>
  <div class="echarts-rare">
    <div :style="{width:width}">
      <duno-charts
        :isChange="isChangeKps"
        :legendOption="legendKps"
        :titleOption="titleKps"
        :paddingBottom="paddingBottom"
        :isItemEchart="true"
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
    <div :style="{width:width}">
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
        return "50%";
      }
    },
    paddingBottom: {
      type: String,
      default: () => {
        return "310px";
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
          padding: [25, 0, 0, -20]
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
          padding: [25, 0, 0, -20]
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
          stack: "总量",
          data: []
        },
        {
          name: "写（MB/s）",
          type: "line",
          stack: "总量",
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
          padding: [25, 0, 0, -20]
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
        text: "GUP使用率",
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
          padding: [25, 0, 0, -20]
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
          timeData.push(el.createTime);
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
          timeData.push(el.createTime);
        });
        that.xAxisIo.data = timeData;
        that.seriesIo[0].data = outData;
        that.seriesIo[1].data = enterData;
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
            timeData.push(el.createTime);
          });
        } else {
          cupData.forEach(el => {
            usedData.push(el.used);
            timeData.push(el.createTime);
          });
        }
        that.xAxisCpu.data = timeData;
        that.seriesCpu[0].data = usedData;
        that.isChangeCpu = !that.isChangeCpu;
        that.$forceUpdate();
      });
      getAxiosData(gupUrl, queryGpu).then(res => {
        let gupData = res.data[0].load
        let usedData = [];
        let timeData = [];
        if (that.serve == "") {
          gupData.forEach(el => {
            usedData.push(el.used);
            timeData.push(el.time);
          });
        } else {
          gupData.forEach(el => {
            usedData.push(el.used);
            timeData.push(el.time);
          });
        }
        that.xAxisGpu.data = timeData;
        that.seriesGpu[0].data = usedData;
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
}
</style>
