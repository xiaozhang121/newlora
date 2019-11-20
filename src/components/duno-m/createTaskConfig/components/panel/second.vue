<template>
  <div class="taskPanel">
    <div class="steps">
      <steps :step="stepValue" />
    </div>
    <el-form :model="form" label-width="80px">
      <div style="font-weight:700;font-size:18px">选择预置位和时间</div>
      <div class="chosenGroupR">
        <chosen-list
                v-for="(item, index) in dataList2"
                :key="index"
                @change="getDataList"
                :titleOption="item['monitorDeviceName']"
                :controlOption="true"
                :dataListOption="item['presets']"
        />
      </div>
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
                    console.log(now);
                    var data = [];
                    for (var i = 0; i <= now.length - 1; i++) {
                        data.push({
                            deviceId: now[i].deviceId,
                            monitorDeviceId: now[i].monitorDeviceId,
                            monitorDeviceName: now[i].monitorDeviceName,
                            presets: now[i].presets,
                            title: now[i].title
                        });
                    }
                    this.obj = data;
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
                        res.data.map((item)=>{
                            item['isCheck'] = false
                        })
                        let maxLength = that.preList.length
                        that.preList.unshift({
                            label: "全选",
                            value: "0",
                            selected: "0",
                            group: null
                        });
                        for (var i = 0; i <= that.preList.length - 1; i++) {
                            that.preList.isCheck = false;
                        }
                        getAxiosData("/lenovo-plan/api/environment/list/camera/preset", {
                            monitorDeviceIds: query.join(",")
                        }).then(res => {
                            console.log(this.rowData)
                            console.log(res);
                            for (let i = 0; i < res.data.length; i++) {
                                res.data[i]["title"] = res.data[i]["monitorDeviceName"];
                                res.data[i]["deviceId"] = res.data[i]["monitorDeviceId"];
                                res.data[i]["presets"].map(item => {
                                    item["isCheck"] = false;
                                    item["title"] = item["presetName"];
                                    item["psIndex"] = item["psIndex"];
                                    try{
                                        for(let w=0; w<that.rowData.devicePresets.length; w++){
                                            console.log( that.rowData.devicePresets[w]['monitorDeviceId'])
                                            if(res.data[i]["deviceId"] == that.rowData.devicePresets[w]['monitorDeviceId']){
                                                let psIndex = that.rowData.devicePresets[w]['presetIds'].indexOf(item["psIndex"]+'')
                                                if(psIndex>-1){
                                                    item["isCheck"] = true
                                                    item["time"] = that.rowData.devicePresets[w]['taskTimes'][psIndex].split('-')
                                                    // item['time'] =
                                                    // let info = that.rowData.devicePresets[i]['analyseTypes']['psIndex']
                                                }
                                            }
                                        }
                                    }catch (e) {

                                    }
                                });
                            }
                            let data = res.data;
                            that.dataList2 = data;
                            for (var i = 0; i <= that.dataList2.length - 1; i++) {
                                for (var j = 0; j <= that.dataList2[i].presets.length - 1; j++) {
                                    let info = JSON.parse(
                                        JSON.stringify(that.preList)
                                    );
                                    /* for(let z=0; z<info.length; z++){
                                         if(info[z].value == that.rowData.devicePresets[i]){

                                         }
                                     }*/
                                    that.dataList2[i].presets[j].listArr = info

                                }
                            }
                            for(let i=0; i<that.dataList2.length; i++){
                                for(let w=0; w<that.rowData.devicePresets.length; w++){
                                    if(that.dataList2[i]['monitorDeviceId'] == that.rowData.devicePresets[w]['monitorDeviceId']){
                                        for(let q=0; q<that.dataList2[i]['presets'].length; q++){
                                            if(that.dataList2[i]['presets'][q].isCheck){
                                                let index = that.rowData.devicePresets[w]['presetIds'].indexOf(that.dataList2[i]['presets'][q]['psIndex']+'')
                                                if(index>-1){
                                                    for(let h=0; h<that.dataList2[i].presets[q].listArr.length; h++){
                                                        if(that.rowData.devicePresets[w]['analyseTypes'][index].split(',').indexOf(that.dataList2[i].presets[q].listArr[h].value)>-1){
                                                            that.dataList2[i].presets[q].listArr[h].isCheck = true
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            this.$forceUpdate()
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
                obj: {}
            };
        },
        methods: {
            getDataList(val) {
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
    .chosenGroupR{
      max-height: 400px;
      overflow-y: auto;
    }
    .chosenGroupR::-webkit-scrollbar {/*滚动条整体样式*/
      width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
    }
    .chosenGroupR::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: rgba(0,0,0,0.2);
    }
    .chosenGroupR::-webkit-scrollbar-track {/*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 0;
      background: rgba(0,0,0,0.1);
    }
  }
</style>