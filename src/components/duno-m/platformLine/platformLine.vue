<template>
    <div class="platformLine" >
        <historical-documents  :tabPaneData="tabPaneData" :picSrc="picSrc" :showHeader="true"  :title="title"  width="470px" @on-show="onChange" @close="onClose" :dialogTableVisible="visibleOption" class="historical">
            <div class="mainPanel">
                <div class="explain">
                    <div class="p_title">安装时间：</div>
                    <div class="nr">{{ installTime }}</div>
                </div>
                <div class="explain">
                    <div class="p_title">IP：</div>
                    <div class="nr">{{ IP }}</div>
                </div>
                <div class="status">
                    <div class="circle"></div>
                    <div class="nr">
                        {{ deviceType }}
                    </div>
                    <div class="link">
                        <!--104m/s-->
                    </div>
                </div>
                <div class="connectDevice" v-if="showList">
                    <div class="titleD">
                        <span>连接的监测设备 (10/12)</span>
                        <a href="javascript:void(0)">详情>></a>
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
    export default {
        name: 'platformLine',
        mixins: [mixinViewModule],
        components: {
            HistoricalDocuments
        },
        data() {
            return {
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
                      let type = now['monitorDeviceType']
                      this.installTime = now['deviceMessage']['createTime']?now['deviceMessage']['createTime']:'/'
                      this.IP = now['deviceMessage']['ipAddr']?now['deviceMessage']['ipAddr']:'/'
                      this.deviceType = '正常'
                      if(type == 1){
                          if (now.deviceMessage.supportPreset) {
                              this.picSrc = this.light
                          }else{
                              this.picSrc = this.lightNoCamera
                          }
                          this.title = now['monitorDeviceName']
                      }else if(type == 2){
                          if(now.deviceMessage.supportPreset){
                              this.picSrc = this.redLightCamera
                          }else{
                              this.picSrc = this.redLight
                          }
                          this.title = now['deviceMessage']['name']
                      }
                  },
                  deep: true
            },
            visible(now){
                this.visibleOption = now
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


