<template>
  <div class="keyErea not-print">
    <div class="dunoDrap">
      <div>重点监测区域</div>
      <div class="selectBtn">
        <div>
          <duno-btn-top
                  zIndex="10"
                  @on-select="onSelect"
                  class="dunoBtnTop"
                  :isCheck="false"
                  :dataList="numberCameras"
                  :title="titleValueL"
                  :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <duno-btn-top
             ref="btnTopRef"
             :showBtnList="false"
             :dataList="optionsList"
             :showAll="false"
             :keyChange="true"
             @on-disabled="onDisabled"
             @on-active="deviceShowHandle"
          >
          </duno-btn-top>
     <!--     <el-select
                  @change="selectData"
                  class="selectSearch"
                  multiple
                  collapse-tags
                  :multiple-limit="selectCount"
                  v-model="valueSelect"
                  filterable
                  :placeholder="titleValueR"
          >
            <el-option
                    v-for="item in optionsList"
                    :key="item.monitorDeviceId"
                    :label="item.serialNo"
                    :value="item.monitorDeviceId"
            ></el-option>
          </el-select>-->
        </div>
      </div>
    </div>
    <div class="monitorArea" :class="{'center': isCenter}">
      <!--@on-push="onPush"-->
        <KeyMonitor
                class="monitorN"
                style="margin-bottom: 47px"
                :routeName="routeNamed"
                :configType="configType"
                v-for="(item,index) in dataMonitor"
                :autoplay="true"
                :class="{'noMargin': (index+1) % active == 0}"
                :key="index"
                :isAlarm="item['isAlarm']"
                :imgAdress="item['pic']"
                :streamAddr="item['streamAddress']"
                :monitorInfo="item"
                :width="videoWidth"
                :showBtmOption="true"
                :kilovolt="item['monitorDeviceName']"
        />
    </div>
    <!--:patrol="item['monitorDeviceId']"-->
    <!--<push-mov :pic="cameraPic" @on-push="onPushReal" @on-close="onClose" :visible="pushMovVisable" />-->
  </div>
</template>

<script>
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
    import Breadcrumb from "_c/duno-c/Breadcrumb";
    import dunoBtnTop from "_c/duno-m/duno-btn-top";
    import KeyMonitor from "_c/duno-c/KeyMonitor";
    import { mapState } from "vuex";
    import pushMov from "_c/duno-m/pushMov";
    import {
        getMonitorSelect,
        securityMonitor,
        editConfig,
        getMonitorView
    } from "@/api/currency/currency.js";
    export default {
        name: "keyErea",
        components: {
            Breadcrumb,
            dunoBtnTop,
            KeyMonitor,
            pushMov
        },
        data() {
            return {
                routeName: '',
                routeNamed: '',
                initCount: 0,
                isFirst: true,
                selectCount: 0,
                cameraPic: "",
                isSecond: false,
                isCenter: false,
                pushMovVisable: false,
                showBtnList: false,
                titleValueR: "监控摄像头选择",
                titleValueL: "监控摄像头数量",
                videoWidth: "calc(50% - 10px)",
                valueSelect: [],
                dataMonitor: [],
                active: 4,
                optionsList: [],
                numberCameras: [
                    {
                        circleColor: "#00B4FF",
                        describeName: "两个摄像头",
                        style: "calc(50% - 10px)",
                        widthType: 2,
                        count: 2,
                        isActive: true
                    },
                    {
                        circleColor: "#FF5EB9",
                        describeName: "四个摄像头",
                        style: "calc(50% - 10px)",
                        widthType: 2,
                        count: 4,
                        isActive: true
                    },
                    {
                        circleColor: "#4FF2B7",
                        describeName: "六个摄像头",
                        style: "calc(100%/3 - 14px)",
                        count: 6,
                        widthType: 3,
                        isActive: true
                    },
                    {
                        circleColor: "#FF9000",
                        describeName: "八个摄像头",
                        style: "calc(25% - 15px)",
                        count: 8,
                        widthType: 4,
                        isActive: true
                    }
                ]
            };
        },
        props: {
            configType: {
                type: String,
                default: "3"
            }
        },
        computed: {
            ...mapState(["app"]),
            isAlarmF() {
                return this.$store.state.user.isAlarm;
            }
        },
        watch: {
            isAlarmF: {
                handler(now) {
                   if(now && this.configType == '3'){
                       let monitorDeviceId = this.$store.state.user.alarmInfo['monitorDeviceId']
                       let data = JSON.parse(JSON.stringify(this.dataMonitor))
                       data.map(item=>{
                           if(item['monitorDeviceId'] == monitorDeviceId){
                                item['isAlarm'] = true
                           }else{
                                item['isAlarm'] = false
                           }
                       })
                       this.dataMonitor = data
                       this.$forceUpdate()
                   }
                },
                deep: true,
                immediate: true
            },
            '$route' (to) {
                this.routeName = to.name
            },
            routeName(now){
                setTimeout(()=>{
                    this.routeNamed = now
                },1300)
                if(now == 'infraredList'){
                    this.$nextTick(()=> {
                        try{
                            /*      document.querySelector('.video-player.vjs-custom-skin').style.transform = "scale(1,0.75)"
                                  document.querySelector('.video-player.vjs-custom-skin').style.transformOrigin = "left top"
                                  document.querySelector('.keyMonitor.camera').style.background = "black"
                                  document.querySelector('.vjs-big-play-button').style.top = "-32%"*/
                        }catch (e) {}
                    })
                }else{
                    this.$nextTick(()=> {
                        try {
                            /*      document.querySelector('.video-player.vjs-custom-skin').style.transform = "inherit"
                                  document.querySelector('.video-player.vjs-custom-skin').style.transformOrigin = "inherit"
                                  document.querySelector('.camera.main').style.background = "black"
                                  document.querySelector('.vjs-big-play-button').style.top = "0"*/
                        }catch (e) {}
                    })
                }
            },
            selectCount(now) {
                this.numberCameras.forEach(item => {
                    if (item["count"] == now) {
                        this.active = item["widthType"];
                        this.titleValueL = item["describeName"];
                        this.videoWidth = item["style"];
                    }
                });
            }
        },
        methods: {
            onDisabled(now){
                debugger
                if(this.selectCount!=0 && (now.length == this.selectCount)){
                    this.$refs.btnTopRef.disabled = true
                }else{
                    this.$refs.btnTopRef.disabled = false
                }
            },
            deviceShowHandle(arr){
                if(this.selectCount){
                    this.$refs.btnTopRef.disabled = false
                }
                const that = this
                let target = arr.filter(item=>{
                    return item['isActive'] == true
                })
                let data = []
                target.forEach(item=>{
                    data.push(item['monitorDeviceId'])
                })
                securityMonitor({
                    monitorDeviceId: data.join(","),
                    configType: that.configType,
                    userId: this.$store.state.user.userId
                }).then(res => {
                    // that.titleValueL = "监控摄像头数量";
                    that.dataMonitor = res.data.tableData;
                    that.$forceUpdate();
                    if(that.selectCount)
                      that.saveCamera();
                    // that.videoWidth = "calc(50%)";
                    // that.active = 1;
                    // that.isCenter = true;
                });
            },
            onClose() {
                this.pushMovVisable = false;
            },
            onPushReal(index) {
                const that = this;
                let query = {
                    ["cameraPos0" + index]: this.cameraInfo["monitorDeviceId"],
                    id: this.$store.state.user.configInfo.id
                };
                editConfig(query).then(res => {
                    if (res.data.isSuccess) that.$message.success(res.msg);
                    else that.$message.error(res.msg);
                });
            },
            onPush(item) {
                this.pushMovVisable = true;
                this.cameraInfo = item;
                if (this.cameraInfo) {
                    this.cameraPic = this.cameraInfo["pic"];
                } else {
                    this.cameraPic = "";
                }
            },
            getCamera() {
                const that = this;
                securityMonitor({
                    configType: this.configType,
                    userId: this.$store.state.user.userId
                }).then(res => {
                    if (res.data && res.data.tableData.length) {
                        let data = res.data.tableData;
                        /*  data.map(item=>{
                            item['pic'] = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563287964020&di=5e687df08ed0f7f258186ce35c8a6ae9&imgtype=0&src=http%3A%2F%2Fp1.ifengimg.com%2Ffck%2F2018_01%2F4b3586c88209a81_w640_h429.jpg'
                        })*/
                        that.dataMonitorAll = data;
                        that.selectCount = res.data.cameraNum;
                        that.initCount = that.selectCount;
                        that.dataMonitor = data.slice(0, that.selectCount);
                        this.onDisabled(that.$refs.btnTopRef.checkedCities)
                    }
                });
            },
            initData() {
                const that = this;
                getMonitorSelect({
                    configType: that.configType,
                    userId: this.$store.state.user.userId
                }).then(res => {
                    if (res.data) {
                        let data = res.data;
                        data = data.filter(item => {
                            return item["isSelected"] == true || item["isSelected"] == 1;
                        });
                        if (data.length) {
                            let arr = [];
                            data.forEach(item => {
                                if (item["monitorDeviceId"] != null)
                                    arr.push(item["monitorDeviceId"]);
                            });
                            that.$nextTick(()=> {
                                that.$refs.btnTopRef.checkedCities = arr
                                that.onDisabled(arr)
                            })
                                // that.valueSelect = arr;
                            // that.getCameraInfo(data)
                        } else {
                            that.$nextTick(()=>{
                                that.$refs.btnTopRef.checkedCities = []
                            })
                            // that.valueSelect = [];
                        }
                        let dataB = res.data
                        dataB.map(item=>{
                            if(item['isSelected'] == true || item["isSelected"] == 1)
                              item['isActive'] = true
                            item['describeName'] = item['serialNo']
                        })
                        that.optionsList = dataB;
                    }
                });
            },
            getCameraInfo(arr) {
                const that = this;
                // 现在正在播放，但是没有被选择的项
                let addArr = [];
                /* that.dataMonitor.forEach((item, index)=>{
                      if(arr.indexOf(item['monitorDeviceId'])< 0){
                          addArr.push(item['monitorDeviceId'])
                      }
                  })*/
                /*  arr = [...arr].slice(0,that.selectCount)
                  if(!arr.length){
                      that.selectCount = this.$store.state.user.cameraNum
                  }
                  securityMonitor({configType: '3', monitorDeviceId: arr.join(','), userId: that.$store.state.user.userId }).then(res=>{
                      that.dataMonitor = res.data
                  })*/
            },
            saveCamera() {
                const that = this;
                if(that.isFirst){
                    that.isFirst = false
                    return
                }
                let query = {};
                that.$refs.btnTopRef.checkedCities.forEach((item, index) => {
                    query["camera0" + (index + 1) + "Id"] = item;
                });
                query["cameraNum"] = that.selectCount;
                query["userId"] = this.$store.state.user.userId;
                query["configType"] = that.configType;
                postAxiosData("/lenovo-device/api/camera/config/update", query).then(
                    res => {}
                );
            },
            selectData(value) {
                const that = this;
                if (!value.length) {
                    that.selectCount = this.initCount;
                }
                securityMonitor({
                    monitorDeviceId: value.join(","),
                    configType: that.configType,
                    userId: this.$store.state.user.userId
                }).then(res => {
                    // that.titleValueL = "监控摄像头数量";
                    that.dataMonitor = res.data.tableData;
                    that.$forceUpdate();
                    that.saveCamera();
                    // that.videoWidth = "calc(50%)";
                    // that.active = 1;
                    // that.isCenter = true;
                });
            },
            onSelect(item) {
                this.selectCount = item["count"];
                this.titleValueL = item["describeName"];
                console.log(item.widthType);
                this.dataMonitor = this.dataMonitor.slice(0, item["count"]);
                this.$refs.btnTopRef.checkedCities = this.$refs.btnTopRef.checkedCities.slice(0, item["count"])
                this.optionsList.map(item=>{
                    if(this.$refs.btnTopRef.checkedCities.indexOf(item['monitorDeviceId'])>-1){
                        item['isActive'] = true
                    }else{
                        item['isActive'] = false
                    }
                })
                // this.valueSelect = this.valueSelect.slice(0, item["count"]);
                switch (item.widthType) {
                    case 2:
                        this.videoWidth = "calc(50% - 10px)";
                        this.active = 2;
                        this.isCenter = false;
                        break;
                    case 3:
                        this.videoWidth = "calc(100%/3 - 14px)";
                        this.active = 3;
                        this.isCenter = false;
                        break;
                    case 4:
                        this.videoWidth = "calc(25% - 15px)";
                        this.active = 4;
                        this.isCenter = false;
                        break;
                    default:
                        this.active = 4;
                        this.isCenter = false;
                }
                this.saveCamera();
                this.onDisabled(this.$refs.btnTopRef.checkedCities)
            },
            beforeunload(e) {
                const that = this;
                console.log("保存相关操作");
                console.log("I want to cancel");
                // Cancel the event
                e.preventDefault();
                // that.saveCamera()
                // Chrome requires returnValue to be set
                e.returnValue = "hello";
            }
        },
        beforeDestroy() {
            const that = this;
            console.log("destory");
        },
        created() {
            this.initData();
            this.getCamera();
        },
        mounted() {
            this.routeName = this.$route.name
            this.$nextTick(() => {
                window.addEventListener("beforeunload", this.beforeunload);
            });
        }
    };
</script>

<style lang="scss">
  .keyErea {
    .monitorN{
      .vjs-fluid {
        padding-top: 56%;
      }
    }
    .el-select .el-tag:first-child {
      margin-left: 14px;
    }
    .el-select{
      max-height: 53px;
    }
    .el-select__tags{
      max-width: none !important;
    }
    .dunoDrap {
      display: flex;
      justify-content: space-between;
      & > div:first-child {
        margin-top: 20px;
        margin-bottom: 20px;
        font-size: 20px;
        color: #ffffff;
      }
      .selectBtn {
        display: flex;
        justify-content: space-between;
        width: 380px;
        margin-top: 14px;
        height: 50px;
        .dunoBtnTop {
          width: 185px;
          display: inline-flex;
          padding-bottom: 0;
          height: 40px;
          .btnList {
            top: inherit !important;
            width: 185px;
            .title {
              padding: 8px 20px;
            }
            .btnNr {
              color: white;
            }
          }
        }
      }
    }
    .monitorArea {
      box-sizing: border-box;
      width: 100%;
      min-height: 491px;
      background-color: #142838;
      opacity: 0.8;
      padding: 20px 20px;
      overflow: hidden;
      &.center {
        display: flex;
        justify-content: center;
      }
      & > div {
        float: left;
        margin-bottom: 20px;
        margin-right: 20px;
      }
      .noMargin {
        margin-right: 0;
      }
    }
  }
</style>

