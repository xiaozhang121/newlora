<template>
    <div class="platformBox">
        <historical-documents :picSrc="picSrc" :routePath="{path: '/abnormalInfoPath/box'}" :tabPaneData="tabPaneData" :showHeader="true"  :title="title"  width="470px" @on-show="onChange" @close="onClose" :dialogTableVisible="dialogTableVisible" class="historical">
            <div class="mainPanel"  v-if="dialogTableVisible">
                <swiper :options="swiperOption">
                    <swiper-slide v-for="(item, index) in streamList" :key="'stream' + index">
                        <div class="slide_item">
                            <div class="main">
                                <key-monitor
                                        :autoplay="true"
                                        :isLive="false"
                                        :isNav="true"
                                        :pushCamera="false"
                                        :picCutAbsolute="false"
                                        :videoCut="false"
                                        :fullScreen="true"
                                        :monitorInfo="{monitorDeviceId: item.deviceId}"
                                        imgAdress
                                        :kilovolt="item.name"
                                        :streamAddr="item.url"
                                        :showBtmOption="true"
                                        width="100%"
                                ></key-monitor>
                            </div>
                        </div>
                    </swiper-slide>
                    <div class="swiper-button-prev  swiper-button-white" slot="button-prev"></div>
                    <div class="swiper-button-next  swiper-button-white" slot="button-next"></div>
                </swiper>
            </div>
            <div class="pop_title">
            <div>
                <span class="line">
                    <span class="block"></span>
                    <span class="block"></span>
                    <span class="block"></span>
                </span>
                <span class="nr">
                    服务器
                </span>
            </div>
            <a class="" href="javascript:void(0)" @click="serverTo">详情>></a>
    </div>
            <div class="deviceList">
                <div class="deviceItem">
                    <div class="pic"><i class="iconfont icon-fuwuqi1"></i></div>
                    <div class="count">{{ server['total'] }}</div>
                    <div class="nr">服务器总数</div>
                </div>
                <div class="deviceItem">
                    <div class="pic"><i class="iconfont icon-xuniji"></i></div>
                    <div class="count">{{ virtual['total'] }}</div>
                    <div class="nr">虚拟服务器</div>
                </div>
                <div class="deviceItem">
                    <div class="pic"><i class="iconfont icon-servise"></i></div>
                    <div class="count">{{ service['total'] }}</div>
                    <div class="nr">Service</div>
                </div>
            </div>
            <div class="deviceStatus">
                <span>内存占用量：<span class="data red">{{ 100 - rateData }}%</span></span>
                <span>存储空间占用量：<span class="data">{{ occupied }}%</span></span>
            </div>
            <div class="warning" v-if="(100 - rateData)> 95">
                <i class="iconfont icon-yichang"></i>
                <span class="nr_main">内存占用量超过95%</span>
            </div>
            <div class="noBack" style="height: 10px"></div>
            <div class="pop_title">
                <div>
                <span class="line">
                    <span class="block"></span>
                    <span class="block"></span>
                    <span class="block"></span>
                </span>
                    <span class="nr">
                    机器人
                </span>
                </div>
            </div>
            <div class="patteryContain">
                <div class="top">
                    <div class="robotTitle">
                        室外巡检机器人一
                    </div>
                    <pattery :rate="battery" class="pattery"></pattery>
                    <!--<div class="robotStauts green">{{ robotStatus }}</div>-->
                    <a class="" href="javascript:void(0)" @click="toRobot('/robot-one/list')">详情>></a>
                </div>
                <div class="bottom">
                    <div class="robotStauts green">{{ robotStatus }}</div>
                </div>
            </div>
            <div class="patteryContain">
                <div class="top">
                    <div class="robotTitle">
                        室内轨道机器人
                    </div>
                    <pattery :rate="insideBattery" class="pattery"></pattery>
                    <!--<div class="robotStauts green">{{ robotStatus }}</div>-->
                    <a class="" href="javascript:void(0)" @click="toRobot('/robot-two/list')">详情>></a>
                </div>
                <div class="bottom">
                    <div class="robotStauts green">{{ insideRobotStatus }}</div>
                </div>
            </div>
            <div class="noBack lastB" style="height: 10px"></div>
        </historical-documents>
    </div>
</template>

<script>
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
    import KeyMonitor from "_c/duno-c/KeyMonitor";
    import pattery from '_c/duno-m/pattery'
    import "swiper/dist/css/swiper.css";
    import { swiper, swiperSlide } from "vue-awesome-swiper";
    import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
    export default {
        name: 'platformBox',
        components: {
            HistoricalDocuments,
            swiperSlide,
            swiper,
            pattery,
            KeyMonitor
        },
        data() {
            return {
                picSrc: require('@/assets/boxPng.png'),
                robotStatus: '',
                insideRobotStatus: '',
                insideBattery: 0,
                occupied: 0,
                unoccupied: 0,
                rateData: 0,
                server: {},
                virtual: {},
                service: {},
                streamList: [],
                tabPaneData: [],
                title: '泛在盒子',
                dialogTableVisible: false,
                swiperOption: {
                    slidesPerView: 1,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev'
                    }
                }
            }
        },
        props: {
            visible:{
              type: Boolean,
              default: false
            },
        },
        watch: {
          visible:{
             handler(now){
                this.dialogTableVisible = now
             },
             immediate: true
          }
        },
        computed: {
            deviceLength(){
                if(this.deviceList.length > 6){
                    return true
                }else{
                    return false
                }
            }
        },
        methods:{
            toRobot(path){
              this.$router.push({path: path})
            },
            getRobot(){
              let substationId = 1
              let robotId = 1
              getAxiosData(`/lenovo-mon/api/monitoring/robot/status/substation/${substationId}/robot/${robotId}`).then(res=>{
                let data = res.data
                this.robotStatus = data.status
                this.battery = data.battery == ""?0:Number(data.battery)
              })
              getAxiosData(`/lenovo-mon/api/monitoring/robot/status/substation/10/robot/26`).then(res=>{
                let data = res.data
                this.insideRobotStatus = data.status
                this.insideBattery = data.battery == ""?0:Number(data.battery)
              })
            },
            storeSpace(){
              getAxiosData("/lenovo-mon/api/monitoring/disk/zabbix/getDiskStatus").then(res => {
                let data2 = res.data;
                this.unoccupied= (Math.round((data2.available / data2.total) * 100));
                this.occupied = (Math.round(((data2.total - data2.available) / data2.total) * 100));
              })
            },
            serverTo(){
              this.$router.push({path: '/abnormalInfoPath/server'})
            },
            getUse(){
              getAxiosData('/lenovo-mon/api/monitoring/memory/zabbix/countMemory').then(res=>{
                let data = res.data.rate
                this.rateData = Number(data).toFixed(0)
              })
            },
            getSever(){
              getAxiosData('/lenovo-mon/api/monitoring/analyse/physics-machine').then(res=>{
                let data = res.data.data
                this.server =  { normal: data['normal'], total:  data['total'] }
              })
              getAxiosData('/lenovo-mon/api/monitoring/analyse/virtual-machine').then(res=>{
                let data = res.data.data
                this.virtual =  { normal: data['normal'], total:  data['total'] }
              })
              getAxiosData('/lenovo-mon/api/monitoring/analyse/services').then(res=>{
                let data = res.data.data
                this.service =  { normal: data['normal'], total:  data['total'] }
              })
            },
            getMonitor(){
                getAxiosData('/lenovo-mon/api/monitoring/rack/zabbix/rack-stream').then(res=>{
                  console.log(res);
                  this.streamList = res.data.data;
                })
            },
            onChange(){

            },
            onClose(){
               this.$emit('on-close')
            }
        },
        created(){
            this.getMonitor()
            this.getSever()
            this.getUse()
            this.storeSpace()
            this.getRobot()
        },
        mounted() {

        }
    }
</script>

<style lang="scss">
    .platformBox{
        display: flex;
        flex-direction: column;
        .red{
            color: red;
        }
        .green{
            color: #47d4a5;
        }
        .noBack{
            position: relative;
            left: -11px;
            width: 106%;
            background: rgba(14, 30, 38, 0.5);
        }
        .lastB{
            position: absolute;
            bottom: 0;
            height: 10px;
            width: 96%;
            left: 9px;
        }
        .warning{
            width: 100%;
            margin-bottom: 10px;
            .iconfont{
                color: #f11134;
                font-weight: bold;
                margin-right: 10px;
            }
            .nr_main{
                color: white;
            }
        }
        .swiper-container{
            width: 100%;
        }
        .swiper-button-prev, .swiper-button-next{
            background-size: 15px 44px;
        }
        .swiper-button-prev{
            left: 0px;
        }
        .swiper-button-next{
            right: 0px;
        }
        .slide_item{
            background: black;
            width: 350px;
            margin: 0 auto;
            .main{
                /*padding-bottom: 56%;*/
                width: 100%;
            }
        }
        .pop_title{
            margin: 9px 0;
            & > div{
                display: flex;
                position: relative;
                left: -13px;
            }
            .line{
                margin: 0 10px;
                height: 100%;
                width: 3px;
                display: inline-block;
                .block{
                    background: #106461;
                    height: 19.3%;
                    width: 2px;
                    display: inline-block;
                    float: left;
                    margin-bottom: 2px;
                }
            }
            .nr{
                margin-top: -2px;
                color: white;
                font-size: 16px;
            }
            display: flex;
            justify-content: space-between;
            a{
                font-size: 15px;
                text-decoration: underline;
            }
        }
        .mainPanel{

        }
        .deviceList{
            display: flex;
            .deviceItem{
                flex-grow: 1;
                flex-basis: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                .pic{
                    .iconfont{
                        font-size: 33px;
                    }
                }
                .count{

                }
                .nr{

                }
            }
        }
        .deviceStatus{
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            .data{
                font-weight: bold;
            }
        }
        .patteryContain{
            margin-left: 10px;
            margin-bottom: 20px;
            margin-top: 17px;
            .top{
                display: flex;
                justify-content: space-between;
                .pattery{
                    margin-left: -41px;
                }
            }
            .robotTitle{
                margin-right: -22px;
            }
            .robotStauts{
                /*margin-left: 25px;*/
            }
            .rouTineInspection{
                
            }
        }
    }
</style>


