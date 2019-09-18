<template>
  <div class="taskPanel">
    <div class="steps">
      <steps :step="stepValue" />
    </div>
    <el-form :model="form" label-width="80px">
      <div>确认执行巡检的设备</div>
      <!---->
      <chosen-list
        v-for="(item, index) in dataList2"
        :key="index"
        @change='getDataList'
        :titleOption="item['monitorDeviceName']"
        :controlOption="true"
        :dataListOption="item['presets']"
      />
    </el-form>
  </div>
</template>
<script>
import chosenList from "_c/duno-m/chosenList2";
import steps from "_c/duno-m/stepsConfig";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import { debuglog } from "util";
export default {
  name: "taskPanel",
  components: {
    chosenList,
    steps
  },
  data() {
    return {
      init: true,
      preList: []
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
  computed: {
    rowDataLength() {
      return Object.keys(this.rowData).length;
    }
  },
  watch: {
    dataList: {
      handler(now) {
        var data2 = now;
        console.log(now)
        var data=[]
        for (var i = 0; i <= now.length - 1; i++) {
         data.push({
            deviceId:now[i].deviceId,
          monitorDeviceId:now[i].monitorDeviceId,
          monitorDeviceName:now[i].monitorDeviceName,
          presets:now[i].presets,
          title:now[i].title
         })
        }
        this.obj=data
    
        this.dataList2 = data;
      },
       deep: true
    },
    list: {
      handler(now) {
        console.log(now);
        let data = now.dataList.map(item => {
          if (item["isCheck"]) {
            return item["deviceId"];
          }
        });
        let query = [];
        data.forEach(item => {
          if (item) {
            query.push(item);
          }
        });
        var that = this;
        postAxiosData("/lenovo-plan/api/list/person-alarm-type").then(res => {
          that.preList = res.data;
          for (var i = 0; i <= that.preList.length - 1; i++) {
            that.preList.isCheck = false;
          }
          getAxiosData("/lenovo-plan/api/environment/list/camera/preset", {
            monitorDeviceIds: query.join(",")
          }).then(res => {
            console.log(res);
            for (let i = 0; i < res.data.length; i++) {
              res.data[i]["title"] = res.data[i]["monitorDeviceName"];
              res.data[i]["deviceId"] = res.data[i]["monitorDeviceId"];
              res.data[i]["presets"].map(item => {
                item["isCheck"] = false;
                item["title"] = item["presetName"];
                item["psIndex"] = item["psIndex"];
              });
            }
            let data = res.data;

            that.dataList2 = data;
            for (var i = 0; i <= that.dataList2.length - 1; i++) {
              for (var j = 0; j <= that.dataList2[i].presets.length - 1; j++) {
                that.dataList2[i].presets[j].listArr = JSON.parse(
                  JSON.stringify(that.preList)
                );
              }
            }
          });
        });
      },
      deep: true
    }
  },
  created() {
    var that = this;
  },
  data() {
    return {
      dataList2: [],
      lightList: [],
      redList: [],
      stepValue: 1,
      obj:{}
    };
  },
  methods: {
    getDataList(val){
      // this.obj
      // this.dataList2 =[]
      // this.dataList2 = val;
      // console.log(val)
      // debugger
    }
  },
  mounted() {
    const that = this;
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