<template>
  <div class="taskPanel">
    <el-form :model="form" label-width="80px">
      <el-form-item label="任务名称">
        <el-input v-model="form.taskName"></el-input>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="form.taskKind" @change="onChange" :value="form.taskKind">
          <el-option
            v-for="(item, index) in taskKindList"
            :key="index"
            :label="item['label']"
            :value="item['value']"
          ></el-option>
        </el-select>
      </el-form-item>
      <div class="steps">
        <steps :step="stepValue" />
      </div>
      <div class="titleInput">
        <span>选择电力设备</span>
        <el-input placeholder="请输入内容" v-model="input" @input="inputChange" clearable></el-input>
      </div>
      <chosen-list :dataListOption="dataList" />
    </el-form>
  </div>
</template>
<script>
import chosenList from "_c/duno-m/hwChoseList";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import steps from "_c/duno-m/steps";
export default {
  name: "taskPanel",
  components: {
    chosenList,
    steps
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
  watch: {},
  data() {
    return {
      form: {
        taskName: "",
        taskKind: "5"
      },
      input: "",
      dataList: [],
      taskKindList: [],
      choseType: -1,
      stepValue: 1
    };
  },
  methods: {
    inputChange(item) {
      this.initData(item);
    },
    onChange(value) {
      this.$emit("getchoseType", value);
      this.choseType = value;
      if (value != "4") {
        const that = this;
        let query = { pageIndex: 1, pageRows: 888888 };
        query["planType"] = value;
        getAxiosData("/lenovo-plan/api/device/multi", query).then(res => {
          let data = res.data.tableData;
          let info = data.map(item => {
            let obj = {
              title: item["deviceName"],
              deviceId: item["deviceId"],
              deviceTypeId: item["deviceTypeId"],
              deviceType: item["deviceType"],
              isCheck: false
            };
            return obj;
          });
          this.$forceUpdate();
          this.rowData["isChange"] = true;
          this.dataList = info;
        });
      } else {
        const that = this;
        let query = { pageIndex: 1, pageRows: 888888 };
        query["planType"] = value;
        getAxiosData("/lenovo-plan/api/environment/list/camera", query).then(
          res => {
            let data = res.data;
            let info = data.map(item => {
              let obj = {
                title: item["monitorDeviceName"],
                deviceId: item["monitorDeviceId"],
                isCheck: false
              };
              return obj;
            });
            try {
              this.rowData["isChange"] = true;
            } catch (e) {}
            // that.taskKindList=info;
            this.dataList = info;
            this.$forceUpdate();
          }
        );
      }
    },
    initData(deviceName) {
      const that = this;
      try {
        this.form.taskName = this.rowData["planName"];
      } catch (e) {}
      postAxiosData("/lenovo-plan/api/list/plan-type").then(res => {
        this.taskKindList = res.data;
        this.value = 5;
        // if (!this.rowDataLength) that.form.taskKind = res.data[0].value;
        this.$forceUpdate();
        let query = {
          pageIndex: 1,
          pageRows: 888888,
          deviceName: deviceName,
          monitorDeviceName: deviceName
        };
        query["planType"] = that.form.taskKind;
        getAxiosData(
          "/lenovo-plan/api/handheldinfrared/list/device",
          query
        ).then(res => {
          console.log(res);
          var dataList = [];
          for (var i = 0; i <= res.data.length - 1; i++) {
            if (dataList.length != 0) {
              for (var j = 0; j <= dataList.length - 1; j++) {
                if (res.data[i].areaId == dataList[j].areaId) {
                } else {
                  dataList.push({
                    areaId: res.data[i].areaId,
                    title: res.data[i].areaName,
                    isCheck: false,
                    children: []
                  });
                  break;
                }
              }
            } else {
              dataList.push({
                areaId: res.data[i].areaId,
                title: res.data[i].areaName,
                children: []
              });
            }
          }
          var allArr = [];
          for (var i = 0; i < dataList.length; i++) {
            var flag = true;
            for (var j = 0; j < allArr.length; j++) {
              if (dataList[i].areaId == allArr[j].areaId) {
                flag = false;
              }
            }
            if (flag) {
              allArr.push(dataList[i]);
            }
          }
          res.data.map(val => {
            for (var i = 0; i <= allArr.length - 1; i++) {
              if (val.areaId == allArr[i].areaId) {
                // dataList[i].id=val.parentDeviceId
                let obj = {
                  isCheck: false,
                  title: val.deviceName,
                  deviceId: val.deviceId,
                  deviceName: val.deviceName,
                  mainDevice: val.mainDevice,
                  phase: val.phase,
                  part: val.part,
                  areaName: val.areaName,
                  parentDeviceId: val.parentDeviceId,
                  deviceSeri: val.deviceSeri
                };
                try {
                  if (
                    that.rowData["devicemonitors"][0]["powerDeviceId"].indexOf(
                      obj["deviceId"]
                    ) > -1
                  ) {
                    allArr[i]["isCheck"] = true;
                    obj["isCheck"] = true;
                  }
                } catch (e) {}
                allArr[i].children.push(obj);
              }
            }
          });

          this.dataList = allArr;
        });
      });
    }
  },
  mounted() {
    // this.stepValue=1;
    this.initData();
  }
};
</script>
<style lang="scss">
.taskPanel {
  .el-select {
    width: 100%;
  }
  .titleInput {
    display: flex;
    justify-content: space-between;
    width: 50%;
    span {
      white-space: nowrap;
      padding-right: 10px;
      font-weight: 700;
      font-size: 18px;
    }
  }
}
</style>