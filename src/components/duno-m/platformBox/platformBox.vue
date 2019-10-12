<template>
    <div class="platformBox" >
        <historical-documents :tabPaneData="tabPaneData" :showHeader="true"  :title="title"  width="470px" @on-show="onChange" @close="onClose" :dialogTableVisible="visible" class="historical">
            <div class="mainPanel">
                <swiper :options="swiperOption">
                    <swiper-slide>
                        <div class="slide_item">
                            <div class="main">

                            </div>
                        </div>
                    </swiper-slide>
                    <swiper-slide>
                        <div class="slide_item"  style="background: grey">
                            <div class="main">

                            </div>
                        </div>
                    </swiper-slide>
                    <swiper-slide>
                        <div class="slide_item">
                            <div class="main">

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
            <a class="" href="javascript:void(0)">详情>></a>
    </div>
            <div class="deviceList">
                <div class="deviceItem">
                    <div class="pic"><i class="iconfont icon-fuwuqi1"></i></div>
                    <div class="count">40</div>
                    <div class="nr">服务器总数</div>
                </div>
                <div class="deviceItem">
                    <div class="pic"><i class="iconfont icon-xuniji"></i></div>
                    <div class="count">81</div>
                    <div class="nr">虚拟服务器</div>
                </div>
                <div class="deviceItem">
                    <div class="pic"><i class="iconfont icon-servise"></i></div>
                    <div class="count">120</div>
                    <div class="nr">Service</div>
                </div>
            </div>
            <div class="deviceStatus">
                <span>内存占用量：<span class="data red">96%</span></span>
                <span>存储空间占用量：<span class="data">60%</span></span>
            </div>
            <div class="warning">
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
                <a class="" href="javascript:void(0)">详情>></a>
            </div>
            <div class="patteryContain">
                <pattery rate="100" class="pattery"></pattery>
                <div class="robotStauts green">充电中</div>
            </div>
            <div class="noBack lastB" style="height: 10px"></div>
        </historical-documents>
    </div>
</template>

<script>
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
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
            pattery
        },
        data() {
            return {
                tabPaneData: [],
                title: '24口万兆交换机',
                visible: true,
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

        },
        watch: {

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
            getMonitor(){
                getAxiosData('/lenovo-mon/api/monitoring/rack/zabbix/rack-stream').then(res=>{
                    debugger
                })
            },
            onChange(){

            },
            onClose(){

            }
        },
        created(){
            this.getMonitor()
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
            margin: 10px 0;
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
            background: pink;
            width: 350px;
            margin: 0 auto;
            .main{
                padding-bottom: 56%;
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
            .data{
                font-weight: bold;
            }
        }
        .patteryContain{
            display: flex;
            margin-left: 10px;
            margin-bottom: 20px;
            margin-top: 17px;
            .robotStauts{
                margin-left: 25px;
            }
            .rouTineInspection{
                
            }
        }
    }
</style>


