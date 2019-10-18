<template>
  <div class="duno-pie">
    <div>
      <duno-charts
        :isChange="isChangeProcessorFir"
        :legendOption="legendProcessorFir"
        :titleOption="titleProcessorFir"
        :paddingBottom="paddingBottom"
        :seriesOption="seriesProcessorFir"
        :colorOption="colorProcessor"
      ></duno-charts>
    </div>
    <div>
      <duno-charts
        :isChange="isChangeProcessorSec"
        :legendOption="legendProcessorSec"
        :titleOption="titleProcessorSec"
        :paddingBottom="paddingBottom"
        :seriesOption="seriesProcessorSec"
        :colorOption="colorProcessor"
      ></duno-charts>
    </div>
    <div>
      <duno-charts
        :isChange="isChangeProcessorThr"
        :legendOption="legendProcessorThr"
        :titleOption="titleProcessorThr"
        :paddingBottom="paddingBottom"
        :seriesOption="seriesProcessorThr"
        :colorOption="colorProcessor"
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
    paddingBottom: {
      type: String,
      default: () => {
        return "50%";
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
    const that = this;
    return {
      isChangeProcessorFir: true,
      isChangeProcessorSec: true,
      isChangeProcessorThr: true,
      colorProcessor: ["#1b6697", "#53cbc3"],
      legendProcessorFir: {
        orient: "vertical",
        right: "20%",
        top: "60%",
        data: [],
        textStyle: {
          color: "#fff"
        }
      },
      titleProcessorFir: {
        text: "处理器",
        right: "25%",
        top: "45%",
        textStyle: {
          color: "#fff",
          fontSize: 25
        }
      },
      seriesProcessorFir: [
        {
          name: "半径模式",
          type: "pie",
          radius: "55%",
          roseType: "radius",
          center: ["35%", "50%"],
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          data: []
        }
      ],
      legendProcessorSec: {
        orient: "vertical",
        right: "20%",
        top: "60%",
        data: that.legendSec,
        textStyle: {
          color: "#fff"
        }
      },
      titleProcessorSec: {
        text: "内存",
        right: "25%",
        top: "45%",
        textStyle: {
          color: "#fff",
          fontSize: 25
        }
      },
      seriesProcessorSec: [
        {
          name: "半径模式",
          type: "pie",
          radius: "55%",
          roseType: "radius",
          center: ["35%", "50%"],
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          data: that.seriesSec
        }
      ],
      legendProcessorThr: {
        orient: "vertical",
        right: "20%",
        top: "60%",
        data: that.legendThr,
        textStyle: {
          color: "#fff"
        }
      },
      titleProcessorThr: {
        text: "磁盘",
        right: "25%",
        top: "45%",
        textStyle: {
          color: "#fff",
          fontSize: 25
        }
      },
      seriesProcessorThr: [
        {
          name: "半径模式",
          type: "pie",
          radius: "55%",
          roseType: "radius",
          center: ["35%", "50%"],
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          data: that.seriesThr
        }
      ]
    };
  },
  watch: {
    pieData: {
      handler(now) {
        this.getPie();
      },
      deep: true
    }
  },
  methods: {
    getPie() {
      let that = this;
      let cupUrl = "/lenovo-mon/api/monitoring/pro/zabbix/getCpuLoad";
      let memoryUrl = "/lenovo-mon/api/monitoring/memory/zabbix/getMemoryLoad";
      let diskUrl = "/lenovo-mon/api/monitoring/disk/zabbix/getDiskStatus";
      let query = {
        hostId: that.pieData.hostId,
        hostType: that.pieData.htype
      };
      getAxiosData(cupUrl, query).then(res => {
        let cupData = res.data;
        let occupied = [];
        let unoccupied = [];
        occupied = Math.round(
          ((cupData.total - cupData.used) / cupData.total) * 100
        );
        unoccupied = Math.round((cupData.used / cupData.total) * 100);
        that.legendProcessorFir.data = [
          `已占用 : ${occupied}%`,
          `未占用 : ${unoccupied}%`
        ];
        that.seriesProcessorFir[0].data = [
          { value: occupied, name: that.legendProcessorFir.data[0] },
          { value: unoccupied, name: that.legendProcessorFir.data[1] }
        ];
        that.isChangeProcessorFir = !that.isChangeProcessorFir;
        that.$forceUpdate();
      });
      getAxiosData(memoryUrl, query).then(res => {
        let memoryData = res.data;
        let occupied = [];
        let unoccupied = [];
        occupied = Math.round((memoryData.available / memoryData.total) * 100);
        unoccupied = Math.round(
          ((memoryData.total - memoryData.available) / memoryData.total) * 100
        );
        that.legendProcessorSec.data = [
          `已占用 : ${occupied}%`,
          `未占用 : ${unoccupied}%`
        ];
        that.seriesProcessorSec[0].data = [
          { value: occupied, name: that.legendProcessorSec.data[0] },
          { value: unoccupied, name: that.legendProcessorSec.data[1] }
        ];
        that.isChangeProcessorSec = !that.isChangeProcessorSec;
        that.$forceUpdate();
      });
      getAxiosData(diskUrl, query).then(res => {
        let diskData = res.data;
        let occupied = [];
        let unoccupied = [];
        occupied = Math.round((diskData.available / diskData.total) * 100);
        unoccupied = Math.round(
          ((diskData.total - diskData.available) / diskData.total) * 100
        );
        that.legendProcessorThr.data = [
          `已占用 : ${occupied}%`,
          `未占用 : ${unoccupied}%`
        ];
        that.seriesProcessorThr[0].data = [
          { value: occupied, name: that.legendProcessorThr.data[0] },
          { value: unoccupied, name: that.legendProcessorThr.data[1] }
        ];
        that.isChangeProcessorThr = !that.isChangeProcessorThr;
        that.$forceUpdate();
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getPie();
    });
  }
};
</script>
<style lang="scss">
.duno-pie {
  display: flex;
  justify-content: flex-start;
  & > div {
    width: 33%;
  }
}
</style>
