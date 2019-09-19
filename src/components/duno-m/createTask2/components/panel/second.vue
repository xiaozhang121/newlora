<template>
  <div class="taskPanel">
    <div class="steps">
      <steps :step="stepValue" />
    </div>
    <el-form :model="form" label-width="80px" >
      <div style="font-weight:700;font-size:18px">选择手持红外设备</div>
      <chosen-list :key="index" :controlOption="true" :dataListOption="dataList" />
    </el-form>
  </div>
</template>
<script>
import chosenList from "_c/duno-m/hwChoseList";
import steps from "_c/duno-m/steps";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
export default {
  name: "taskPanel",
  components: {
    chosenList,
    steps
  },
  data() {
    return {
      init: true,
      stepValue: 2,
      dataList: []
    };
  },
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    list: {}
  },
  computed: {},
  watch: {
    dataList: {
      handler(now) {
        if (now.length) {
          let data = now;
          let arr = this.rowData["devicemonitors"];
          for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < data.length; j++) {
              for (let z = 0; z < data[j]["monitorDevices"].length; z++) {
                let indexx = arr[i]["monitorDeviceId"].indexOf(
                  data[j]["monitorDevices"][z]["monitorDeviceId"]
                );
                if (indexx > -1) {
                  if (data[j]["powerDeviceId"] == arr[i]["powerDeviceId"]) {
                    if (!data[j]["monitorDevices"][z]["isCheck"])
                      arr[i]["monitorDeviceId"].splice(indexx, 1);
                    if (
                      data[j]["monitorDevices"][z]["monitorDeviceType"] == 1
                    ) {
                      arr[i]["analyseTypes"][indexx] =
                        data[j]["monitorDevices"][z]["analyseType"];
                    }
                  }
                } else if (data[j]["monitorDevices"][z]["isCheck"]) {
                  if (data[j]["powerDeviceId"] == arr[i]["powerDeviceId"]) {
                    arr[i]["monitorDeviceId"].push(
                      data[j]["monitorDevices"][z]["monitorDeviceId"]
                    );
                  }
                }
              }
            }
          }
        }
      },
      deep: true
    }
  },
  data() {
    return {
      dataList: [],
      lightList: [],
      redList: [],
      data
    };
  },
  methods: {},
  mounted() {
    var that = this;
    getAxiosData("/lenovo-iir/manager/device-handle/all/list").then(res => {
      var dataList = [];
      debugger
      console.log(res)
      console.log('ttttttttttttttttt')
      for (var i = 0; i <= res.data.data.length - 1; i++) {
        dataList.push({ title: res.data.data[i].deviceName, id: res.data.data[i].id, children: [],deviceNum:res.data.data[i].deviceNum});
      }
    
      that.dataList = dataList;
      this.$forceUpdate();
    });
    this.stepValue = 2;
  }
};
</script>
<style lang="scss">
.taskPanel {
  .el-select {
    width: 100%;
  }
}
</style>