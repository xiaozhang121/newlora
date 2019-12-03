<template>
    <div class="redPanel"  v-if="show">
        <el-tabs type="border-card"  v-model="activeName">
            <el-tab-pane name="first" label="实时监控">
                <div class="main">
                    <div class="title">
                        <!--<span>实时监控</span>-->
                        <span style="float: right; cursor: pointer" @click="onClose"><i class="el-icon-close"></i></span>
                    </div>
                    <!--<img :src="redDevice" style="width: 300px">-->
                <div class="imgList">
                        <div class="img"><img :src="backImg"/></div>
                    </div>
                   <!-- <div class="circleList">
                        <div class="circle"><circle-pic /></div>
                        <div class="circle"><circle-pic /></div>
                    </div>-->
                </div>
            </el-tab-pane>
            <el-tab-pane name="second" label="历史告警">
               <!--<img :src="historyAlarm" >-->
                <span style="float: right; cursor: pointer" @click="onClose"><i class="el-icon-close"></i></span>
                <div class="historyAlarm">
                    <div class="item">
                        <div class="img">
                            <img  width="108" height="94" :src="clock"/>
                        </div>
                        <div class="explain">
                            <div class="title">2019-05-28 <span style="margin-left: 10px">13:22:40</span></div>
                            <div class="info">温度：60℃  超出阈值：15%</div>
                            <div class="info">安全等级：一般</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="img">
                            <img  width="108" height="94" :src="clock"/>
                        </div>
                        <div class="explain">
                            <div class="title">2019-05-28 <span style="margin-left: 10px">13:29:40</span></div>
                            <div class="info">温度：60℃  超出阈值：15%</div>
                            <div class="info">安全等级：一般</div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane name="third" label="历史数据">
                <!--<img :src="echarts">-->
               <div style="position: relative; width: 100%">
                   <span style="float: right; cursor: pointer" @click="onClose"><i class="el-icon-close"></i></span>
                   <el-date-picker
                           style="width: 70%"
                           v-model="timeRange"
                           type="daterange"
                           range-separator="-"
                           size="mini"
                           start-placeholder="开始日期"
                           end-placeholder="结束日期">
                   </el-date-picker>
                   <el-button type="text" style="position: absolute; right: 47px;color: #00b5be">搜索</el-button>
                   <duno-charts
                           :isItemEchart="true"
                           width="360px"
                           :isChange="isChange"
                           height="210px"
                           :gridOption="{
                              top:40,
                          }"
                           :xAxisOption="{
                            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        }"
                           :yAxisOption=" {
                                type: 'value',
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                               }
                            }"
                           :seriesOption="dataCharts"
                   />
               </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import { getAxiosData } from '@/api/axiosType.js'
    import clock from '@/assets/images/clock.png'
    import banner from '_c/self_com/banner'
    import circlePic from '_c/self_com/circlePic'
    import echarts from '@/assets/images/echarts.png'
    import historyAlarm from '@/assets/images/historyAlarm.png'
    import redImg from '@/assets/images/redImg.png'
    import redDevice from '@/assets/images/redDevice.png'
    import { DunoCharts } from '_c/duno-charts'
    export default {
        name: 'panel',
        components: {
            banner,
            circlePic,
            DunoCharts
        },
        data() {
            return {
                clock,
                redImg,
                isChange: true,
                activeName: 'first',
                backImg:'',
                dataCharts: [{
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line'
                }],
                imgList:[],
                show: false,
                echarts,
                timeRange: '',
                historyAlarm,
                redDevice
            }
        },
        watch: {
            activeName(now){
                if(now == 'third'){
                    this.$emit('hide-other')
                }
            },
            dataCharts:{
              handler(now){
              },
              deep: true
            },
            initShow(now){
                this.show = now
            }
        },
        props: {
            initShow: {
                type: Boolean,
                default: false
            },
            title:{
                type: String,
                default: '主变压器'
            },
        },
        created(){
            const that = this
            this.show = this.initShow
          /*  setInterval(()=>{
                getAxiosData('/isAlarm').then(res=>{
                    if(res.data == 0){
                        getAxiosData('/normalImg').then(res=>{
                            that.backImg = 'data:image/png;base64,'+res.data
                        })
                    }else{
                        getAxiosData('/infrared').then(res=>{
                            that.backImg = 'data:image/png;base64,'+res.data
                        })
                    }
                })
            },2000)*/
        },
        methods:{
            onClose(){
                this.show = false
                this.activeName = 'first'
                this.$emit('on-close')
            },
            changePic(item){
                this.backImg = item
            }
        }
    }
</script>

<style lang="scss">
    .redPanel{
        width: 370px;
        .charts{
            width: 370px;
            height: 100px;
        }
        .el-range-editor--mini.el-input__inner{
            background: transparent;
            border: 1px solid #00b5be;
        }
        .el-range-editor--mini .el-range-separator{
            margin-right: 8px;
            color: white;
        }
        .el-range-editor--mini .el-range-input{
            background: transparent;
            color: white;
        }
        .el-input__icon.el-range__close-icon{
            position: absolute;
            right: 0;
        }
        .historyAlarm{
            display: flex;
            flex-direction: column;
            .item{
                display: flex;
                margin-bottom: 24px;
                .img{
                    position: relative;
                    display: flex;
                    img{
                    }
                }
                .explain{
                    display: flex;
                    flex-direction: column;
                    padding-left: 15px;
                    .title{
                        font-weight: bold;
                        margin-bottom: 7px;
                    }
                }
            }
            .item:last-child{
                margin-bottom: 0;
            }
        }
         .el-tabs__header{
            background-color: transparent !important;
        }
        .el-tabs--border-card{
            border: none;
            background: transparent;
        }
        .el-tabs--border-card > .el-tabs__header .el-tabs__item:not(.is-disabled):hover{
            color: white;
        }
        .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active{
            color: white;
            background: rgba(37, 23, 74, 0.6);
        }
        .el-tabs__header{
            border-bottom:1px solid #f55eb6;
        }
        .el-tabs__nav{
            border: 1px solid #f55eb6;
            border-bottom: 0;
        }
        .el-tabs__content{
            border: 1px solid #f55eb6;
            color: white;
            border-top: none;
            background: rgba(37, 23, 74, 0.6);
        }
        .el-tabs--border-card > .el-tabs__header .el-tabs__item{
            border: 1px solid #f55eb6;
            background: rgba(255, 255, 255, 0.2);
            color: white;
        }
        .main{
            display: flex;
            flex-direction: column;
            .title{
                margin-bottom: 8px;
            }
            .title span:first-child{
                /*font-size: 18px;*/
            }
            .imgList{
                display: flex;
                height: 140px;
                padding-left: 10px;
                margin-bottom: 5px;
                .img{
                    position: relative;
                    flex: 1;
                    margin-right: 19px;
                    img{
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .circleList{
                display: flex;
                .circle{
                    text-align: center;
                    flex: 1;
                }
            }
        }
    }
</style>
