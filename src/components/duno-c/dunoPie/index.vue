<template>
  <div class="duno-pie">
    <div v-for="(item,index) in dataList" :key="index">
      <duno-charts
        :isChange="isChangeProcessor"
        :legendOption="legendProcessor"
        :titleOption="titleProcessor"
        :paddingBottom="paddingBottom"
        :isItemEchart="true"
        :seriesOption="seriesProcessor"
        :colorOption="colorProcessor"
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
    paddingBottom: {
      type: String,
      default: () => {
        return "50%";
      }
    }
  },
  data() {
    return {
      dataList: [{}, {}, {}],
      isChangeProcessor: true,
      legendProcessor: {
        orient: "vertical",
        right: "20%",
        top: "60%",
        data: ["已占用 : 80%", "未占用 : 20%"],
        textStyle: {
          color: "#fff"
        }
      },
      titleProcessor: {
        text: "处理器",
        right: "25%",
        top: "45%",
        textStyle: {
          color: "#fff",
          fontSize: 25
        }
      },
      seriesProcessor: [
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
          data: [
            { value: 335, name: "已占用 : 80%" },
            { value: 150, name: "未占用 : 20%" }
          ]
        }
      ],
      colorProcessor: ["#1b6697", "#53cbc3"]
    };
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