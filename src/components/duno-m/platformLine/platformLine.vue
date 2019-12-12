<template>
    <div class="platformLine" >
        <historical-documents :routePath="routePath" :isShowTip="isShowTip" :itemId="itemId" :tabPaneData="tabPaneData" :picSrc="picSrc" :showHeader="true"  :title="title"  width="470px" @on-show="onChange" @close="onClose" :dialogTableVisible="visibleOption" class="historical">
            <div class="mainPanel">
                <div class="explain">
                    <div class="p_title">{{ Ftitle }}</div>
                    <div class="nr">{{ installTime }}</div>
                </div>
                <div class="explain">
                    <div class="p_title">{{ Stitle }}</div>
                    <div class="nr">{{ IP }}</div>
                </div>
                <div class="status">
                    <div class="circle" :class="isNormal"></div>
                    <div class="nr">
                        {{ deviceType }}
                    </div>
                    <div class="link">
                        <!--104m/s-->
                    </div>
                </div>
                <div class="connectDevice" v-if="showList">
                    <div class="titleD">
                        <span>连接的监测设备 ({{ linkCount }}/{{ totalCount }})</span>
                        <a href="javascript:void(0)" @click="routeTo">详情>></a>
                    </div>
                    <div class="mainD">
                        <ul :class="{'overflow': deviceLength}">
                            <li v-for="(item, index) in deviceList" :key="index" :class="{'colorLine': (index+1)%2!=0}">
                                <div class="nowS" :class="[{'green': item['status'] == 'green'}, {'red': item['status']  == 'red'}]"></div>
                                <div class="nrS">{{ item['cameraName'] }}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </historical-documents>
    </div>
</template>

<script>
    import mixinViewModule from "@/mixins/view-module";
    import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
    import {getAxiosData} from "../../../api/axiosType";
    export default {
        name: 'platformLine',
        mixins: [mixinViewModule],
        components: {
            HistoricalDocuments
        },
        data() {
            return {
                routePath: {},
                routeQuery: {},
                isShowTip: false,
                itemId: -1,
                linkCount: 0,
                totalCount: 0,
                Ftitle: '安装时间：',
                Stitle: 'IP：',
                picSrc: null,
                installTime: '',
                IP: '',
                deviceType: '',
                tabPaneData: [],
                title: '暂无名称',
                visibleOption: false,
                deviceList: [
                    {status: 'green', cameraName: '4号主变红外11号摄像头'},
                    {status: 'green', cameraName: '4号主变红外11号摄像头'},
                    {status: 'red', cameraName: '4号主变红外11号摄像头'},
                    {status: 'green', cameraName: '4号主变红外11号摄像头'},
                    {status: 'green', cameraName: '4号主变红外11号摄像头'},
                    {status: 'green', cameraName: '4号主变红外11号摄像头'}
                ]
            }
        },
        props: {
            dataInfo:{},
            showList: {
                type: Boolean,
                default: true
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            dataInfo:{
                  handler(now){
                      this.routePath = {}
                      this.isShowTip = false
                      this.installTime = ''
                      this.IP = ''
                      this.deviceType = ''
                      if(now['monitorDeviceId']){
                        this.itemId = now['monitorDeviceId']
                        this.isShowTip = true
                      }
                      let type = now['monitorDeviceType']
                      if(type == 1 || type == 5 || type == 4){
                          this.installTime = now['deviceMessage']['instTime']?now['deviceMessage']['instTime']:'/'
                          this.IP = now['deviceMessage']['ipAddr']?now['deviceMessage']['ipAddr']:'/'
                          this.deviceType = now['deviceMessage']['status']?'正常':'异常'
                          if (now.deviceMessage.supportPreset) {
                              this.picSrc = this.light
                          }else{
                              this.picSrc = this.lightNoCamera
                          }
                          if(type == 5){
                             this.picSrc = this.lightD
                          }
                          if(type == 4){
                             this.picSrc = this.ball
                             this.routePath = {path: '/surveillancePath/ballControlM', query: {
                                 monitorDeviceId: now['monitorDeviceId'],
                                 monitorDeviceName: now['monitorDeviceName']
                             }}
                          }
                          this.title = now['deviceMessage']['cameraName']
                      }
                      else if(type == 2){
                          this.installTime = now['deviceMessage']['installDate']?now['deviceMessage']['installDate']:'/'
                          this.IP = now['deviceMessage']['ip']?now['deviceMessage']['ip']:'/'
                          this.deviceType = now['deviceMessage']['connect']?'正常':'异常'
                          if(now.deviceMessage.supportPreset){
                              this.picSrc = this.redLightCamera
                          }else{
                              this.picSrc = this.redLight
                          }
                          this.title = now['deviceMessage']['name']
                      }
                      else if(type == 'AP'){
                         this.getAP(now)
                      }
                      else if(type == 'Caisson'){
                         this.getCaission()
                      }
                  },
                  deep: true
            },
            visible(now){
                this.visibleOption = now
            }
        },
        computed: {
            isNormal(){
              return (this.deviceType == '正常' || this.deviceType == '上线')?"":"unNormal"
            },
            deviceLength(){
                if(this.deviceList.length > 6){
                    return true
                }else{
                    return false
                }
            }
        },
        methods:{
            routeTo(){
               this.$router.push(this.routePath)
            },
            getSwitchData(now){
              this.picSrc = this.waterBox
              this.Ftitle = '防水箱号：'
              this.Stitle = 'IP：'
              this.deviceList = []
              this.routePath = {path: '/abnormalInfoPath/networkDevice', query: { type: 'SWITCH' }}
              getAxiosData('/lenovo-mon/api/monitoring/popup/exchange', {hostId: now['hostId'], ip: now['ip']}).then(res=>{
                try{
                  let data = res.data
                  this.title = data.realName
                  this.installTime = data.boxNum
                  this.IP = data.ip
                  this.deviceType = data['status']?'正常':'异常'
                  let arr = []
                  let green = 0
                  let red = 0
                  for(let i=0; i<data['connectDevice'].length; i++){
                    let item = data['connectDevice'][i]
                    let status = item['isConnect']?'green':'red'
                    status == 'green'?green++:red++
                    arr.push({
                      cameraName: item['deviceName'],
                      status: status
                    })
                  }
                  this.linkCount = green
                  this.totalCount = green + red
                  this.deviceList = arr
                }catch (e) {}
              })
            },
            getCaission(){
              getAxiosData('/lenovo-mon/api/monitoring/host/zabbix/exchange/count').then(res=>{
                this.linkCount = res.data['normal']
                this.totalCount = res.data['total']
              })
            },
            getAP(data){
              this.routePath = {path: '/abnormalInfoPath/networkDevice', query: { type: 'AP' }}
              this.picSrc = this.AP
              getAxiosData('/lenovo-mon/api/monitoring/popup/ap', {mac: data.apMac}).then(res=>{
                this.title = '802.11ac Wave2天线一一体化室外无无线AP'
                this.Ftitle = '型号：'
                this.Stitle = 'IP：'
                this.installTime = res.data.model
                this.IP = res.data.ip
                this.deviceType = res.data['status']?'正常':'异常'
              })
            },
            onChange(){

            },
            onClose(){
                this.visibleOption = false
                this.$emit('on-close')
            }
        },
        created(){
        },
        mounted() {

        }
    }
</script>

<style lang="scss">
    .platformLine{
        .el-dialog__body{
            min-height: auto !important;
        }
    }
    .mainPanel{
        display: flex;
        flex-direction: column;
        .overflow{
            overflow-y: auto;
        }
        .explain{
            display: flex;
            font-size: 18px;
            color: #cccccc;
            margin-top: 10px;
            .p_title{
            }
            .nr{
                display: flex;
                align-items: center;
            }
        }
        .status{
            display: flex;
            align-items: center;
            margin-top: 10px;
            .circle{
                background: #1fc17f;
                border-radius: 100%;
                width: 15px;
                height: 15px;
                margin-right: 12px;
                &.unNormal{
                    background: #ffce27;
                }
            }
            .nr{
                color: white;
                font-size: 16px;
            }
            .link{
                margin-left: 20px;
                font-size: 16px;
                color: #138150;
            }
        }
        .connectDevice{
            margin-top: 12px;
            .titleD{
                display: flex;
                justify-content: space-between;
                font-size: 16px;
                a{
                    text-decoration: underline;
                }
            }
            .mainD{
                ul{
                    margin-top: 10px;
                    max-height: 240px;
                    li{
                        display: flex;
                        align-items: center;
                        line-height: 40px;
                        padding: 0 14px;
                        &.colorLine{
                            background-color: #2a526c;
                        }
                        .nowS{
                            width: 15px;
                            height: 15px;
                            margin-right: 10px;
                            &.green{
                                background-color: #15af4f;
                            }
                            &.red{
                                background-color: #f0183a;
                            }
                        }
                        .nrS{

                        }
                    }
                }
            }
        }
    }
</style>


