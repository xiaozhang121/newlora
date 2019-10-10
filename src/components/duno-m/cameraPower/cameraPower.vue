<template>
    <div class="cameraPower" >
        <historical-documents v-if="mainType == 1" :showHeader="true" :tabPaneData="[]"  :title="dialogTitle"  width="444px" @close="onClose" :dialogTableVisible="visible" class="historical">
            <div class="monitor">
                <key-monitor :autoplay="true" :monitorInfo="monitorInfo" :streamAddr="monitorInfo['addr']"></key-monitor>
            </div>
            <div class="from">
                来源：
                <span class="click_title" @click="handleJump">{{ mainName }}</span>
                <el-dropdown  trigger="click">
                  <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item, index) in dataList" :key="index"  @click.native="chosenItem(item)">{{ item['monitorDeviceName'] }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="moreInfo" @click="handleMore">更多记录信息>></div>
            <div class="camera" v-for="(item, index) in recentList" :key="index">
                <camera-d @on-detail="toDetail" :dataInfo="item"></camera-d>
            </div>
            <ul class="threeClass">
                <li
                :class="{active:active=='A'}"
                @click="activeItem('A')"
                >A相</li>
                <li
                
                :class="{active:active=='B'}"
                @click="activeItem('B')">B相</li>
                <li
                :class="{active:active=='C'}"
                @click="activeItem('C')"
                >C相</li>
            </ul>
        </historical-documents>
        <historical-documents v-else :showHeader="true" :tabPaneData="[]"  :title="dialogTitle"  width="744px" @close="onClose" :dialogTableVisible="visible" class="historical">
            <div class="monitor" style="display: flex">
                <key-monitor :isPic="isPic" :autoplay="true" style="flex: 1; margin-right: 20px" class="monitorM" :monitorInfo="monitorInfo" :streamAddr="playerOptionsd.streamAddr"></key-monitor>
                <key-monitor style="flex: 1" class="monitorM" :monitorInfo="monitorInfo" :streamAddr="playerOptions.streamAddr"></key-monitor>
            </div>
            <div class="from">
                来源：
                <span class="click_title"  @click="handleJump">{{ mainName }}</span>
                <el-dropdown  trigger="click">
                  <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item, index) in dataList" :key="index" @click.native="chosenItem(item)">{{ item['monitorDeviceName'] }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="moreInfo" @click="handleMore">更多记录信息>></div>
            <div class="camera" v-for="(item, index) in recentList" :key="index">
                <camera-d @on-detail="toDetail" :dataInfo="item"></camera-d>
            </div>
            <ul class="threeClass">
                <li
                :class="{active:active=='A'}"
                @click="activeItem('A')"
                >A相</li>
                <li
                
                :class="{active:active=='B'}"
                @click="activeItem('B')">B相</li>
                <li
                :class="{active:active=='C'}"
                @click="activeItem('C')"
                >C相</li>
            </ul>
        </historical-documents>
        <wraning
                :discriminate="false"
                :hasSelect="true"
                :alarmLevel="alarmLevel"
                :visible="visibleInner"
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
                isPic: false,
                streamAddr: '',
                dialogTitle: '暂无名称',
                dataList: [],
                allList:[],
                mainName: '',
                mainType: '',
                monitorInfo: {},
                monitorInfo1:{},
                recentList: [],
                popData: {},
                alarmLevel: '',
                visibleInner: false,
                active:'A',
                playerOptions: {
                    streamAddr: "",
                    autoplay: true
                },
                playerOptionsd: {
                    streamAddr: "",
                    autoplay: true
                }
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
                        this.dialogTitle = now['deviceName']
                        this.getData()
                    }
                },
                deep: true,
                immediate: true
            }
        },
        methods:{
            activeItem(type){
                this.active=type
                let data=this.allList
                let dataList=[]
                data.forEach((el,i) => {
                        if(el.powerDevicePhase==type){
                            dataList.push(data[i])
                        }
                });
                this.dataList=dataList;
                this.mainName = dataList[0]['monitorDeviceName']
                    this.mainType = dataList[0]['monitorDeviceType']
                    this.monitorInfo = dataList[0]
                    this.streamAddr = dataList[0]['addr']
                    if(this.mainType=='2'){
                        this.monitorInfo1 = dataList[1]
                    }
            },
            handleJump() {
                getAxiosData("/lenovo-device/api/preset/type", {
                    monitorDeviceId: this.monitorInfo["monitorDeviceId"]
                }).then(res => {
                    let supportPreset = res.data["supportPreset"];
                    let monitorDeviceType = res.data["monitorDeviceType"];
                    if (monitorDeviceType == 1) {
                        if (supportPreset) {
                            this.$router.push({
                                path: "/surveillancePath/detailLight",
                                query: {
                                    monitorDeviceId: this.monitorInfo["monitorDeviceId"],
                                    monitorDeviceName: this.monitorInfo["monitorDeviceName"]
                                }
                            });
                        } else {
                            this.$router.push({
                                path: "/surveillancePath/detailLightN",
                                query: {
                                    monitorDeviceId: this.monitorInfo["monitorDeviceId"],
                                    monitorDeviceName: this.monitorInfo["monitorDeviceName"]
                                }
                            });
                        }
                    } else if (monitorDeviceType == 2) {
                        this.$router.push({
                            path: "/surveillancePath/detailRedN",
                            query: {
                                monitorDeviceId: this.monitorInfo["monitorDeviceId"],
                                monitorDeviceName: this.monitorInfo["monitorDeviceName"],
                                typeId: res.data["typeId"]
                            }
                        });
                    } else if (monitorDeviceType == 3 || monitorDeviceType == 6) {
                        this.$router.push({
                            path: "/surveillancePath/detailEnv",
                            query: {
                                monitorDeviceId: this.monitorInfo["monitorDeviceId"],
                                monitorDeviceName: this.monitorInfo["monitorDeviceName"]
                            }
                        });
                    }
                });
            },
            handleMore(){
                this.$router.push({
                    path:'/meterdata/allReport-detail',
                    query: {
                        powerDeviceId: this.itemData['deviceIdStr'],
                        url:"/lenovo-plan/api/statistics/meter-data/list"
              }
                })
            },
            handleClose() {
                this.popData = {};
                this.visibleInner = false;
            },
            toDetail(item){
                const that = this
                that.popData = item;
                that.alarmLevel = item.alarmLevel;
                that.visibleInner = true;
            },
            initList(){
                const that = this
                getAxiosData('/lenovo-plan/api/task/result/list', {'monitorDeviceId': this.monitorInfo['monitorDeviceId'], 'pageIndex': 1, 'pageRows': 2}).then(res=>{
                    this.recentList = res.data.details || res.data.data || res.data.tableData || res.data.dutyData || res.data.todayData || res.data.monthData || res.data
                })
            },
            chosenItem(item){
                this.monitorInfo = item
                this.mainType = item['monitorDeviceType']
                this.mainName = item['monitorDeviceName']
                this.streamAddr = item['addr']
                this.initList()
            },
            getData(){
                getAxiosData('/lenovo-device/api/device/newrtmp', {powerDeviceId: this.itemData['deviceIdStr']}).then(res=>{
                    let data = res.data.dmDeviceRtmpOutputs
                    let dataList=[]
                    data.forEach((el,i) => {
                        if(el.powerDevicePhase=='A'){
                            dataList.push(data[i])
                        }
                    });
                    this.allList=data;
                    this.dataList = dataList
                    this.mainName = dataList[0]['monitorDeviceName']
                    this.mainType = dataList[0]['monitorDeviceType']
                    this.monitorInfo = dataList[0]
                    this.streamAddr = dataList[0]['addr']
                    if(this.mainType=='2'){
                        this.monitorInfo1 = dataList[1]
                    }
                    this.initList()
                })
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
        position: relative;
        .threeClass{
            position: absolute;
            top: 0;
            left: -42px;
            color: white;
            li{
                background: rgba(32, 54, 68, 0.7);
                padding: 5px 10px;
                font-size: 12px;
                margin-bottom: 8px;
                border-radius: 3px;
                cursor: pointer;
                
            }
            .active{
                    color: #00e5ff;
            }
        }
        .el-dialog{
            margin-top: 24vh !important;
        }
        .monitorM{
            .vjs-fluid {
                padding-top: 56%;
            }
        }
        .el-icon-arrow-down{
            color: white;
            cursor: pointer;
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
            cursor: pointer;
            color: #4bbdc1;
        }
        .moreInfo{
            cursor: pointer;
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

