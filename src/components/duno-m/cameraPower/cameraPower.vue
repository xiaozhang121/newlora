<template>
    <div class="cameraPower" >
        <historical-documents v-if="mainType == 1" :showHeader="true" :tabPaneData="[]"  :title="dialogTitle"  width="444px" @close="onClose" :dialogTableVisible="visible" class="historical">
            <div class="monitor">
                <key-monitor streamAddr="45456465"></key-monitor>
            </div>
            <div class="from">
                来源：
                <el-dropdown  trigger="click">
                  <span class="el-dropdown-link">
                    <span class="click_title">{{ mainName }}</span><i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="item in dataList" @click.native="chosenItem(item)">{{ item['monitorDeviceName'] }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="moreInfo">更多记录信息>></div>
            <div class="camera" v-for="(item, index) in recentList" :key="index">
                <camera-d :data="item"></camera-d>
            </div>
        </historical-documents>
        <historical-documents v-else :showHeader="true" :tabPaneData="[]"  :title="dialogTitle"  width="744px" @close="onClose" :dialogTableVisible="visible" class="historical">
            <div class="monitor" style="display: flex">
                <key-monitor style="flex: 1; margin-right: 20px" class="monitorM" :monitorInfo="monitorInfo" :streamAddr="streamAddr"></key-monitor>
                <key-monitor style="flex: 1" class="monitorM" :monitorInfo="monitorInfo" :streamAddr="streamAddr"></key-monitor>
            </div>
            <div class="from">
                来源：
                <el-dropdown  trigger="click">
                  <span class="el-dropdown-link">
                    <span class="click_title">{{ mainName }}</span><i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="item in dataList" @click.native="chosenItem(item)">{{ item['monitorDeviceName'] }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="moreInfo">更多记录信息>></div>
            <div class="camera" v-for="(item, index) in recentList" :key="index">
                <camera-d :data="item"></camera-d>
            </div>
        </historical-documents>
        <wraning
                :discriminate="false"
                :hasSelect="true"
                :alarmLevel="alarmLevel"
                :visible="visible"
                warningID="20190711002"
                :popData="popData"
                :monitorUrl="popData.alarmFileAddress || ''"
                :judgeResult="popData.alarmContent || ''"
                :origin="popData.monitorDeviceId"
                :handleResult="popData.dealRecord || ''"
                @handleClose="handleClose"
        />
    </div>
</template>

<script>
    import wraning from "_c/duno-j/warning";
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
    import KeyMonitor from "_c/duno-c/KeyMonitor";
    import cameraD from './components/cameraD'
    import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
    export default {
        name: 'cameraPower',
        components: {
            HistoricalDocuments,
            KeyMonitor,
            cameraD,
            wraning
        },
        data() {
            return {
                streamAddr: '',
                dialogTitle: '暂无名称',
                dataList: [],
                mainName: '',
                mainType: '',
                monitorInfo: {},
                recentList: []
            }
        },
        props: {
            itemData: {},
            visible: {
                type: Boolean,
                default: () => {
                    return false
                }
            }
        },
        watch: {
            itemData:{
                handler(now){
                    if(Object.keys(now).length){
                        debugger
                        this.dialogTitle = now['deviceName']
                        this.getData()
                    }
                },
                deep: true,
                immediate: true
            }
        },
        methods:{
            initList(){
                this.recentList = [
                    {
                        alarmLevel: null,
                        alarmLevelName: null,
                        alarmTime: "2019-09-23 16:30:02",
                        alarmValue: "57.203",
                        areaName: "1000千伏",
                        batchId: "667",
                        content: "正常",
                        dealRecord: null,
                        executeTime: "2019-09-23 16:30:02",
                        fileType: "1",
                        id: "203755",
                        isAlarm: "0",
                        isPhaseAlarm: "0",
                        isReturn: null,
                        isRobot: "0",
                        mainDevice: "4号主变",
                        monitorDeviceId: "10002",
                        monitorDeviceName: "新视界-练塘站-1000KV-4号主变A相风控箱红外41#-232",
                        monitorDeviceType: null,
                        part: "A相",
                        phaseData: null,
                        pic: "http://10.0.10.35:8100/lenovo-storage/api/storageService/file/imgFile?bucketName=roibucket&fileName=A相风控箱左侧下部器件.jpg",
                        powerDeviceName: "A相风控箱左侧下部器件",
                        sourceType: "自动",
                        taskId: "620656413568679936"
                    }
                ]
               /* getAxiosData('/lenovo-plan/api/task/result/list', {'monitorDeviceId': this.monitorInfo['monitorDeviceId'], 'pageIndex': 1, 'pageRows': 2}).then(res=>{
                    this.recentList = res.data.details || res.data.data || res.data.tableData || res.data.dutyData || res.data.todayData || res.data.monthData || res.data
                })*/
            },
            chosenItem(item){
                this.monitorInfo = item
                this.mainType = item['monitorDeviceType']
                this.mainName = item['monitorDeviceName']
                this.streamAddr = item['videoAddr']
                this.initList()
            },
            getData(){
                    let res = {
                        'data': [
                            {
                                "monitorDeviceId": "51",
                                "monitorDeviceName": "Name1新视界 -练塘站-1000kV-4号主变C相温度表-18",
                                "monitorDeviceType": 2,
                                "videoAddr": '123'
                            },
                            {
                                "monitorDeviceId": "51",
                                "monitorDeviceName": "Name2新视界 -练塘站-1000kV-4号主变C相温度表-18",
                                "monitorDeviceType": 1,
                                "videoAddr": '56+'
                            }
                        ]
                    }
                // getAxiosData('/lenovo-device/api/monitors/device', {powerDeviceId: this.itemData['deviceIdStr']}).then(res=>{
                    let data = res.data
                    this.dataList = data
                    this.mainName = data[0]['monitorDeviceName']
                    this.mainType = data[0]['monitorDeviceType']
                    this.monitorInfo = data[0]
                    this.streamAddr = data[0]['videoAddr']
                    this.initList()
                // })
            },
            onClose(){
            }
        },
        mounted() {
        }
    }
</script>
<style lang="scss">
    .cameraPower{
        .monitorM{
            .vjs-fluid {
                padding-top: 56%;
            }
        }
        .el-icon-arrow-down{
            color: white;
        }
        .camera{
            margin-bottom: 10px;
            &:first-child{
                margin-top: 10px;
            }
        }
        .monitor{
            .keyMonitor{
                width: 100% !important;
            }
        }
        .from{
            margin: 10px 0;
        }
        .el-loading-text{
            color: #969696   !important;
        }
        .click_title{
            color: #4bbdc1;
        }
        .moreInfo{
            color: #4bbdc1 !important;
            text-align: right;
            text-decoration: underline;
        }
        .HistoricalDocuments{
            .titleBtn{
                margin-right: 48px;
                margin-top: -40px;
            }
        }
        .historyfile{
            padding-bottom: 15px;
        }
    }
</style>

