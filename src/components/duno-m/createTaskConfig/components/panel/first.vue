<template>
  <div class="taskPanel">
    <el-form :model="form" label-width="80px" >
      <el-form-item label="任务名称">
        <el-input v-model="form.taskName"></el-input>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="form.taskKind" @change="onChange" :vlaue="value">
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
      <chosen-list :isInput="true" :dataListOption="dataList" @change='demo' @inputChange="inputChange" />
    </el-form>
  </div>
</template>
<script>
    import chosenList from "_c/duno-m/chosenList2";
    import steps from "_c/duno-m/stepsConfig";
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
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
            list: {},
            value: 4
        },
        computed: {
            rowDataLength() {
                return Object.keys(this.rowData).length;
            },
            Ids() {
                let arr = [];
                this.rowData["devicemonitors"].forEach((item, index) => {
                    arr.push(item["powerDeviceId"]);
                });
                return arr;
            }
        },
        watch: {

            list: {
                handler(now) {},
                deep: true
            }
        },
        data() {
            return {
                form: {
                    taskName: "",
                    taskKind: "4"
                },
                dataList: [],
                infoData:[],
                taskKindList: [],
                stepValue: 1
            };
        },
        methods: {
            // demo() {
            //     debugger
            //      putAxiosData("/lenovo-visible/api/visible-equipment/ptz/preset-move/69/1").then(
            //     res => {
            //     console.log(res)
            //     debugger;
            //     }
            //   );
            //   getAxiosData("/lenovo-visible/api/visible-equipment/sdk/rtmp/69").then(
            //     res => {
            //     console.log(res)
            //     debugger;
            //     }
            //   );
            // },
            inputChange(item) {
                // this.initData(item);
                let data = this.infoData;
                let selectData = [];
                if (item != "") {
                    data.forEach(el => {
                    if (el["title"].indexOf(item) > -1) {
                        selectData.push(el);
                    }
                    });
                    this.dataList = selectData;
                } else {
                    this.dataList = this.infoData;
                }
            },
            onChange(value) {
                const that = this;
                if (value != "4") {
                    this.$emit("getchoseType", value);
                }
            },
            initData() {
                const that = this;
                postAxiosData("/lenovo-plan/api/list/plan-type").then(res => {
                    this.taskKindList = res.data;
                    this.$forceUpdate();
                    let query = { pageIndex: 1, pageRows: 888888 };
                    query["monitorDeviceType"] = 3;
                    getAxiosData("/lenovo-plan/api/environment/list/camera", query).then(
                        res => {
                            let data = res.data;
                            let info = data.map(item => {
                                let obj = {
                                    title: item["monitorDeviceName"],
                                    deviceId: item["monitorDeviceId"],
                                    // deviceTypeId: item["deviceTypeId"],
                                    // deviceType: item["deviceType"],
                                    isCheck: false
                                };
                                if(Object.keys(this.rowData).length){
                                    this.form.taskName = this.rowData['planName']
                                    for(let i=0; i<this.rowData['devicePresets'].length; i++){
                                        if(this.rowData['devicePresets'][i]['monitorDeviceId'] == obj['deviceId']){
                                            obj['isCheck'] = true
                                        }
                                    }
                                }
                                return obj;
                            });
                            console.log(info);
                            var monitorDeviceIds = [];
                            info.map(function(val, index) {
                                monitorDeviceIds.push(val.deviceId);
                            });
                            var query = monitorDeviceIds.join(",");
                            this.dataList=info;
                            this.infoData=info;
                            this.$forceUpdate();
                        }
                    );
                });
            }
        },
        mounted() {
            //   this.demo();
            this.initData();
            // this.dataList = [
            //   { title: "abccaoim", deviceId: "dklsdfj" },
            //   { title: "abccao423im", deviceId: "dk333lsdfj" }
            // ];
        }
    };
</script>
<style lang="scss">
  .taskPanel {
    .el-select {
      width: 100%;
    }
  }
  .el-input--small .el-input__inner {
  background-color: #fff;
}
</style>