<template>
    <div class="powerPop">
        <div class="pop_title">
            <div>
                <span class="line">
                    <span class="block"></span>
                    <span class="block"></span>
                    <span class="block"></span>
                </span>
                <span class="nr">
                    整体健康状态评估
                </span>
            </div>
            <a class="" href="javascript:void(0)" @click="jumpServer">详情>></a>
        </div>
        <div class="allHealthStatus">
            <div class="mainCharts">
                <charts :allPanel="allPanel" :isChange="allPanelV"/>
                <span class="chartsTitle">
                    平台整体
                </span>
            </div>
            <div class="child">
                <charts-u :chartsInfo="server" :isChange="serverV"/>
                <span class="childTitle"><i class="iconfont icon-fuwuqi1"></i>服务器</span>
            </div>
            <div class="child">
                <charts-u  :chartsInfo="virtual" :isChange="virtualV"/>
                <span class="childTitle"><i class="iconfont icon-xuniji"></i>虚拟机</span>
            </div>
            <div class="child">
                <charts-u  :chartsInfo="service" :isChange="serviceV"/>
                <span class="childTitle"><i class="iconfont icon-servise"></i>服务</span>
            </div>
            <div class="child">
                <charts-u  :chartsInfo="monitor" :isChange="monitorV"/>
                <span class="childTitle"><i class="iconfont icon-jianceshebei"></i>监测设备</span>
            </div>
            <div class="warning">
                <i class="iconfont icon-yichang"></i>
                <span class="nr_main">内存占用量超过{{ 100-rateData }}%</span>
            </div>
        </div>
        <div class="line_split"></div>
        <div class="pop_title">
            <div>
                <span class="line">
                    <span class="block"></span>
                    <span class="block"></span>
                    <span class="block"></span>
                </span>
                <span class="nr">
                    当前运行监测设备
                </span>
            </div>
            <a class="" href="javascript:void(0)" @click="jumpStatus">详情>></a>
        </div>
        <div class="watchDevice">
            <div class="mainD">
                <div class="deviceItem">
                    <div class="topM">
                        <img :src="lightNoCamera"/>
                        <span class="count">{{ visibleCount }}</span>
                    </div>
                    <div class="bottomM">
                        可见光
                    </div>
                </div>
                <div class="deviceItem">
                    <div class="topM">
                        <img :src="light"/>
                        <span class="count">{{ visibleCameraCount }}</span>
                    </div>
                    <div class="bottomM">
                        可见光(云台)
                    </div>
                </div>
                <div class="deviceItem">
                    <div class="topM">
                        <img :src="lightD"/>
                        <span class="count">{{ visibleNarrow }}</span>
                    </div>
                    <div class="bottomM">
                        可见光(窄道)
                    </div>
                </div>
                <div class="deviceItem">
                    <div class="topM">
                        <img :src="redLight"/>
                        <span class="count">{{  infrared }}</span>
                    </div>
                    <div class="bottomM">
                        红外测温
                    </div>
                </div>
                <div class="deviceItem">
                    <div class="topM">
                        <img :src="redLightCamera"/>
                        <span class="count">{{  infraredCamera }}</span>
                    </div>
                    <div class="bottomM">
                        红外测温(云台)
                    </div>
                </div>
            </div>
            <div class="mainD">
                <div class="deviceItem">
                    <div class="topM">
                        <img :src="ball"/>
                        <span class="count">{{   controlBall }}</span>
                    </div>
                    <div class="bottomM">
                        布控球
                    </div>
                </div>
                <div class="deviceItem">
                    <div class="topM">
                        <img :src="handRed"/>
                        <span class="count">{{   handInfrared }}</span>
                    </div>
                    <div class="bottomM">
                        手持红外
                    </div>
                </div>
                <div class="deviceItem">
                    <div class="topM">
                        <img :src="ARGlass"/>
                        <span class="count">{{   ARClass }}</span>
                    </div>
                    <div class="bottomM">
                        AR眼镜
                    </div>
                </div>
                <div class="deviceItem">
                    <div class="topM">
                        <img :src="pad"/>
                        <span class="count">{{   PAD }}</span>
                    </div>
                    <div class="bottomM">
                        PAD
                    </div>
                </div>
                <div class="deviceItem">
                    <div class="topM">
                        <img :src="robot"/>
                        <span class="count">{{   rebortCount }}</span>
                    </div>
                    <div class="bottomM">
                        机器人
                    </div>
                </div>
            </div>
        </div>
        <div class="line_split"></div>
        <div class="pop_title">
            <div>
                <span class="line">
                    <span class="block"></span>
                    <span class="block"></span>
                    <span class="block"></span>
                </span>
                <span class="nr">
                    网络
                </span>
            </div>
            <a class="" href="javascript:void(0)" @click="jumpNetwork">详情>></a>
        </div>
        <div class="allHealthStatus T" style="height: 20%; margin-bottom: 19px">
            <div class="mainCharts">
                <charts-line :isChange="netWorkChange" :chartData="netWorkData"></charts-line>
            </div>
            <div class="child">
                <charts-u :chartsInfo="switchData" :isChange="switchDataV" :hiddenM="true" mainColor="#00b3ff"/>
                <span class="childTitle"><img :src="switchPic"/>交换机</span>
            </div>
            <div class="child">
                <charts-u :chartsInfo="APData" :isChange="APDataV" :hiddenM="true"/>
                <span class="childTitle"><img :src="AP"/>AP</span>
            </div>
        </div>
        <div class="line_split"></div>
        <div class="pop_title">
            <div>
                <span class="line">
                    <span class="block"></span>
                    <span class="block"></span>
                    <span class="block"></span>
                </span>
                <span class="nr">
                    平台数据统计
                </span>
            </div>
            <!-- <a class="" href="javascript:void(0)">详情>></a> -->
        </div>
        <div class="dataPlateForm">
            <div class="plateform">
                <div class="left">
                    <div class="count">{{ totalAlarmCount }}</div>
                    <span class="nr_p">平台告警总数</span>
                </div>
                <div class="right">
                    <span class="redF">本月新增：{{ totalMonthAlarmCount }}</span>
                    <span class="redF">未复归数：{{ totalReturnAlarmCount }}</span>
                </div>
            </div>
            <div class="plateform">
                <div class="left">
                    <div class="count">{{ plateFormRecord }}</div>
                    <span class="nr_p">平台汇总记录总数</span>
                </div>
                <div class="right">
                    <span class="blueF">本月新增：{{ plateFormRecordMonth }}</span>
                </div>
            </div>
        </div>
        <div class="pushB" @click="visibleHandle()">
            <div class="btn">
                <img :src="close"/>
            </div>
        </div>
    </div>
</template>

<script>
    import charts from "_c/duno-m/chartsCircle"
    import chartsU from "_c/duno-m/chartsCircleU"
    import chartsLine from "_c/duno-m/chartsLine"
    import mixinViewModule from "@/mixins/view-module";
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
    export default {
        name: 'powerPop',
        mixins: [mixinViewModule],
        components: {
            charts,
            chartsU,
            chartsLine
        },
        data() {
            return {
                switchData: {},
                switchDataV: false,
                netWorkChange: false,
                netWorkData: [],
                totalAlarmCount: 0,
                totalMonthAlarmCount: 0,
                totalReturnAlarmCount: 0,
                plateFormRecord: '0',
                plateFormRecordMonth: '0',
                allPanel: '',
                allPanelV: false,
                APData: {normal: 1, total: 1},
                APDataV: false,
                server: {normal: 1, total: 1},
                serverV: false,
                virtual:{normal: 1, total: 1},
                virtualV:false,
                service:{normal: 1, total: 1},
                serviceV:false,
                monitor:{normal: 1, total: 1},
                monitorV:false,
                close: require('@/assets/runDevice/close.png'),
                visibleCount: 0,
                visibleCameraCount: 7,
                visibleNarrow: 9,
                infrared: 0,
                infraredCamera: 9,
                controlBall: 2,
                handInfrared: 0,
                ARClass: 1,
                PAD: 1,
                rebortCount: 1,
                rateData: 0

            }
        },
        props: {

        },
        watch: {

        },
        computed: {

        },
        methods:{
            initData(){
                const that = this
                getAxiosData('/lenovo-mon/api/monitoring/zabbix/health-status').then(res=>{
                    let data = res.data.data
                    this.allPanel = data.hostData[0]/data.total
                    this.allPanelV = !this.allPanelV
                })
                getAxiosData('/lenovo-mon/api/monitoring/analyse/physics-machine').then(res=>{
                    let data = res.data.data
                    this.server =  { normal: data['normal'], total:  data['total'] }
                    this.serverV = !this.serverV
                })
                getAxiosData('/lenovo-mon/api/monitoring/analyse/virtual-machine').then(res=>{
                    let data = res.data.data
                    this.virtual =  { normal: data['normal'], total:  data['total'] }
                    this.virtualV = !this.virtualV
                })
                getAxiosData('/lenovo-mon/api/monitoring/analyse/services').then(res=>{
                    let data = res.data.data
                    this.service =  { normal: data['normal'], total:  data['total'] }
                    this.serviceV = !this.serviceV
                })
                getAxiosData('/lenovo-mon/api/monitoring/analyse/terminals').then(res=>{
                    let data = res.data.data
                    this.monitor =  { normal: data['normal'], total:  data['total'] }
                    this.monitorV = !this.monitorV
                })
                getAxiosData('/lenovo-mon/api/monitoring/memory/zabbix/countMemory').then(res=>{
                    let data = res.data.rate
                    this.rateData = Number(data).toFixed(0)
                })
                /*   getAxiosData('/lenovo-mon/api/monitoring/visible/count').then(res=>{
                       this.visibleCount = res.data.total
                   })
                   getAxiosData('/lenovo-mon/api/monitoring/thermal/count').then(res=>{
                       this.infrared = recs.data.total
                   })*/
                getAxiosData('/lenovo-mon/api/monitoring/ap/zabbix/getApStatus').then(res=>{
                    let data = res.data
                    this.APData =  { normal: data['apData'][0], total:  data['total'] }
                    this.APDataV = !this.APDataV
                })
                getAxiosData('/lenovo-mon/api/monitoring/visible/run/count').then(res=>{
                    let data = res.data
                    data.forEach(item=>{
                        if(item['cameraType'] == '可见光(云台)'){
                            this.visibleCameraCount = item['count']
                        }else if(item['cameraType'] == '可见光'){
                            this.visibleCount  = item['count']
                        }else if(item['cameraType'] == '布控球'){
                            this.controlBall   = item['count']
                        }else if(item['cameraType'] == '可见光(窄道)'){
                            this.visibleNarrow    = item['count']
                        }
                    })
                })

                getAxiosData('/lenovo-mon/api/monitoring/thermal/run/count').then(res=>{
                    let data = res.data
                    data.forEach(item=>{
                        if(item['cameraType'] == '红外测温'){
                            this.infrared = item['count']
                        }else if(item['cameraType'] == '红外测温(云台)'){
                            this.infraredCamera = item['count']
                        }
                    })
                })

                getAxiosData('/lenovo-mon/api/monitoring/alarm/count').then(res=>{
                    let data = res.data
                    this.totalAlarmCount = data.totalAlarmCount
                    this.totalMonthAlarmCount = data.totalMonthAlarmCount
                    this.totalReturnAlarmCount = data.totalReturnAlarmCount
                })

                getAxiosData('/lenovo-mon/api/monitoring/record/count').then(res=>{
                    this.plateFormRecord = res.data.totalRecordCount
                    this.plateFormRecordMonth = res.data.monthRecordCount
                })
                getAxiosData('/lenovo-mon/api/monitoring/host/zabbix/port/flow').then(res=>{
                    let data = res.data
                    this.netWorkData = [{inPortFlow: [], outPortFlow: [], date: []}]
                    for(let i=data.length-1; i>-1; i--){
                        this.netWorkData[0]['date'].push(data[i]['time'])
                        this.netWorkData[0]['inPortFlow'].push(data[i]['inPortFlow'].toFixed(2))
                        this.netWorkData[0]['outPortFlow'].push(data[i]['outPortFlow'].toFixed(2))
                    }
                    this.$forceUpdate()
                    this.netWorkChange = !this.netWorkChange
                })
                getAxiosData('/lenovo-mon/api/monitoring/host/zabbix/exchange/count').then(res=>{
                    let data = res.data
                    this.switchData =  { normal: data['normal'], total:  data['total'] }
                    this.switchDataV = !this.switchDataV
                })
                /*





                 */
            },
            visibleHandle(){
                this.$emit('on-visible')
            },
            eventFn(){
                let height = window.innerHeight
                $('.powerPop .allHealthStatus .warning').css({'bottom':'-32px'})
                $('.powerPop .allHealthStatus .mainCharts .chartsTitle').css({'bottom':'-12%'})
                if(height < 663){
                    $('.childTitle').css({'bottom':'-6%'})
                }else if(height < 860){
                    $('.childTitle').css({'bottom':'-2%'})
                }else if(height > 860 && height < 1000){
                    $('.childTitle').css({'bottom':'9%'})
                }else{
                    $('.childTitle').css({'bottom':'16%'})
                    $('.powerPop .allHealthStatus .warning').css({'bottom':'-18px'})
                    $('.powerPop .allHealthStatus .mainCharts .chartsTitle').css({'bottom':'2%'})
                }
            },
            jumpServer(){
                this.$router.push({
                    path:'/abnormalInfoPath/server'
                })
            },
            jumpNetwork(){
                this.$router.push({
                    path:'/abnormalInfoPath/networkDevice'
                })
            },
            jumpStatus(){
                this.$router.push({
                    path:'/abnormalInfoPath/deviceStatus'
                })
            }
        },
        created(){
            this.initData()
        },
        mounted() {
            this.eventFn()
            window.addEventListener('resize', this.eventFn)
        }
    }
</script>

<style lang="scss">
    .powerPop{
        padding: 12px 25px;
        background: #041624;
        height: 100%;
        width: 618px;
        overflow-y: auto;
        margin-right: -10px;
        .pushB{
            background: rgba(17, 34, 51,0.7);
            width: 20px;
            height: 100%;
            position: absolute;
            left: -19px;
            top: 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            .btn{
                width: 10px;
                height: 20px;
                /*background: pink;*/
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .line_split{
            border-bottom: 2px dashed #0d3a43;
            width: 100%;
            margin-bottom: 14px;
        }
        .pop_title{
            margin-bottom: 9px;
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
        .allHealthStatus{
            display: flex;
            height: 20%;
            margin-bottom: 44px;
            position: relative;
            &.T{
                .mainCharts{
                    width: 54%;
                }
                .childTitle{
                    img{
                        margin-right: 4px;
                        position: relative;
                        top: 4px;
                    }
                }
                .child{
                    margin-left: 0;
                    margin-right: 40px;
                    &:last-child{
                        margin-right: 0;
                    }
                }
            }
            & > div{
                flex-grow: 1;
            }
            .mainCharts{
                width: 20%;
                height: 100%;
                position: relative;
                padding-right: 15px;
                .chartsTitle{
                    position: absolute;
                    /*bottom: 3%;*/
                    bottom: -12%;
                    text-align: center;
                    width: 100%;
                    color: white;
                    padding-right: 11px;
                }
            }
            .child{
                height: 100%;
                flex-basis: 0;
                flex-grow: 1;
                margin-left: 16px;
                /*background: skyblue;*/
                position: relative;
                padding-bottom: 24px;
                .chartBox{
                    position: relative;
                    top: 0;
                }
                .childTitle{
                    text-align: center;
                    color: white;
                    width: 110%;
                    position: absolute;
                    /*bottom: 19%;*/
                    bottom: 9%;
                    /*bottom: 0;*/
                    font-size: 14px;
                    left: -5px;
                    .iconfont{
                        position: relative;
                        top: 2px;
                        font-size: 21px;
                        margin-right: 4px;
                    }
                }
            }
            .child:last-child{
            }
            .warning{
                position: absolute;
                width: 100%;
                padding-left: 29%;
                text-align: center;
                bottom: -32px;
                .iconfont{
                    color: #f11134;
                    font-weight: bold;
                    margin-right: 10px;
                }
                .nr_main{
                    color: white;
                }
            }
        }
        .watchDevice{
            display: flex;
            flex-direction: column;
            position: relative;
            left: -9px;
            margin-bottom: 16px;
            .mainD{
                flex-grow: 1;
                display: flex;
                &:first-child{
                    margin-bottom: 12px;
                }
                .deviceItem{
                    color: white;
                    flex-grow: 1;
                    flex-basis: 0px;
                    .topM{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        img{
                            width: 25px;
                            height: 25px;
                            margin-right: 6px;
                        }
                        .count{
                            font-size: 20px;
                            font-weight: bold;
                        }
                    }
                    .bottomM{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 14px;
                        margin-top: 5px;
                    }
                }
            }
        }
        .dataPlateForm{
            height: 13%;
            .redF{
                color: #c10e33;
            }
            .blueF{
                color: #3e84c8;
            }
            display: flex;
            .plateform{
                flex-grow: 1;
                flex-basis: 0;
                display: flex;
                color: white;
                background: #002233;
                border-radius: 9px;
                &:first-child{
                    margin-right: 20px;
                    border: 1px solid #c10e33;
                }
                &:last-child{
                    border: 1px solid #3e84c8;
                }
                .left{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    width: 46%;
                    .count{
                        font-size: 24px;
                        font-weight: bold;
                    }
                    .nr_p{
                        display: flex;
                        flex-direction: column;
                        font-size: 14px;
                        color: #cccccc;
                    }
                }
                .right{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-grow: 1;
                    flex-basis: 0;
                    flex-direction: column;
                }
            }
        }
    }
</style>


