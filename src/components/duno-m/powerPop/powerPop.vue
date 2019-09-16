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
            <a class="" href="javascript:void(0)">详情>></a>
        </div>
        <div class="allHealthStatus">
            <div class="mainCharts">
                <charts />
                <span class="chartsTitle">
                    平台整体
                </span>
            </div>
            <div class="child">
                <charts-u />
                <span class="childTitle"><i class="iconfont icon-fuwuqi1"></i>服务器</span>
            </div>
            <div class="child">
                <charts-u />
                <span class="childTitle"><i class="iconfont icon-xuniji"></i>虚拟机</span>
            </div>
            <div class="child">
                <charts-u />
                <span class="childTitle"><i class="iconfont icon-servise"></i>服务</span>
            </div>
            <div class="child">
                <charts-u />
                <span class="childTitle"><i class="iconfont icon-jianceshebei"></i>监测设备</span>
            </div>
            <div class="warning">
                <i class="iconfont icon-yichang"></i>
                <span class="nr_main">内存占用量超过95%</span>
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
            <a class="" href="javascript:void(0)">详情>></a>
        </div>
        <div class="watchDevice">
           <div class="mainD">
               <div class="deviceItem">
                   <div class="topM">
                       <img :src="lightNoCamera"/>
                       <span class="count">31</span>
                   </div>
                   <div class="bottomM">
                       可见光
                   </div>
               </div>
               <div class="deviceItem">
                   <div class="topM">
                       <img :src="light"/>
                       <span class="count">31</span>
                   </div>
                   <div class="bottomM">
                       可见光(云台)
                   </div>
               </div>
               <div class="deviceItem">
                   <div class="topM">
                       <img :src="lightD"/>
                       <span class="count">31</span>
                   </div>
                   <div class="bottomM">
                       可见光(窄道)
                   </div>
               </div>
               <div class="deviceItem">
                   <div class="topM">
                       <img :src="redLight"/>
                       <span class="count">31</span>
                   </div>
                   <div class="bottomM">
                       红外测温
                   </div>
               </div>
               <div class="deviceItem">
                   <div class="topM">
                       <img :src="redLightCamera"/>
                       <span class="count">31</span>
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
                        <span class="count">31</span>
                    </div>
                    <div class="bottomM">
                        布控球
                    </div>
                </div>
                <div class="deviceItem">
                    <div class="topM">
                        <img :src="handRed"/>
                        <span class="count">31</span>
                    </div>
                    <div class="bottomM">
                        手持红外
                    </div>
                </div>
                <div class="deviceItem">
                    <div class="topM">
                        <img :src="ARGlass"/>
                        <span class="count">31</span>
                    </div>
                    <div class="bottomM">
                        AR眼镜
                    </div>
                </div>
                <div class="deviceItem">
                    <div class="topM">
                        <img :src="pad"/>
                        <span class="count">31</span>
                    </div>
                    <div class="bottomM">
                        PAD
                    </div>
                </div>
                <div class="deviceItem">
                    <div class="topM">
                        <img :src="robot"/>
                        <span class="count">31</span>
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
            <a class="" href="javascript:void(0)">详情>></a>
        </div>
        <div class="allHealthStatus T" style="height: 20%; margin-bottom: 19px">
            <div class="mainCharts">
                <charts-line></charts-line>
            </div>
            <div class="child">
                <charts-u :hiddenM="true"/>
                <span class="childTitle"><i class="iconfont icon-fuwuqi1"></i>交换机</span>
            </div>
            <div class="child">
                <charts-u :hiddenM="true"/>
                <span class="childTitle"><i class="iconfont icon-xuniji"></i>AP</span>
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
            <a class="" href="javascript:void(0)">详情>></a>
        </div>
        <div class="dataPlateForm">
            <div class="plateform">
                <div class="left">
                    <div class="count">124</div>
                    <span class="nr_p">平台告警总数</span>
                </div>
                <div class="right">
                    <span class="redF">本月新增：12</span>
                    <span class="redF">未复归数：12</span>
                </div>
            </div>
            <div class="plateform">
                <div class="left">
                    <div class="count">124</div>
                    <span class="nr_p">平台汇总记录总数</span>
                </div>
                <div class="right">
                    <span class="blueF">本月新增：32</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import charts from "_c/duno-m/chartsCircle"
    import chartsU from "_c/duno-m/chartsCircleU"
    import chartsLine from "_c/duno-m/chartsLine"
    import mixinViewModule from "@/mixins/view-module";
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

            }
        },
        props: {

        },
        watch: {

        },
        computed: {

        },
        methods:{
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
            }
        },
        created(){
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
                    width: 100%;
                    position: absolute;
                    /*bottom: 19%;*/
                    bottom: 9%;
                    /*bottom: 0;*/
                    font-size: 14px;
                    .iconfont{
                        position: relative;
                        top: 2px;
                        font-size: 21px;
                        margin-right: 6px;
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


