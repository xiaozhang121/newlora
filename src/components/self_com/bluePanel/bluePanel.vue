<template>
    <div class="bluePanel" v-if="show">
        <el-tabs type="border-card">
            <el-tab-pane label="实时监控">
                <div class="main">
                    <div class="title">
                        <span>实时监控</span>
                        <span style="float: right; cursor: pointer" @click="onClose"><i class="el-icon-close"></i></span>
                    </div>
                    <div class="imgList">
                        <div class="img"><img :src="clock"/></div>
                        <div class="circleList">
                            <div class="circle"><circle-pic /></div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="历史告警">
                <div class="main">
                    <div class="title">
                        <span>历史告警</span>
                        <span style="float: right"　 @click="onClose"><i class="el-icon-close"></i></span>
                    </div>
                    <div class="imgList">
                        <div class="img"><img :src="clock"/></div>
                        <div class="img"><img :src="clock"/></div>
                    </div>
                    <div class="circleList">
                        <div class="circle"><circle-pic /></div>
                        <div class="circle"><circle-pic /></div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="历史数据">
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
                            width="420px"
                            height="250px"
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
                            :seriesOption=" [{
                            data: [820, 932, 901, 934, 1290, 1330, 1320],
                            type: 'line'
                        }]"
                    />
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import { getAxiosData } from '@/api/axiosType.js'
    import banner from '_c/self_com/banner'
    import circlePic from '_c/self_com/circlePic'
    import clock from '@/assets/images/clock.png'
    import echarts from '@/assets/images/echarts.png'
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
                backImg:require('@/assets/images/test/backImg.jpg'),
                imgList:[],
                clock,
                echarts,
                timeRange: '',
                show: false
            }
        },
        watch: {
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
            this.show = this.initShow
        },
        methods:{
            onClose(){
                this.show = false
                this.$emit('on-close')
            },
            changePic(item){
                this.backImg = item
            }
        }
    }
</script>

<style lang="scss">
    .bluePanel{
        width: 445px;
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
            background: rgba(1, 35, 63, 0.6);
        }
        .el-tabs__header{
            border-bottom:1px solid #07a8ea;
        }
        .el-tabs__nav{
            border: 1px solid #07a8ea;
            border-bottom: 0;
        }
        .el-tabs__content{
            border: 1px solid #07a8ea;
            color: white;
            border-top: none;
            background: rgba(1, 35, 63, 0.6);
        }
        .el-tabs--border-card > .el-tabs__header .el-tabs__item{
            border: 1px solid #07a8ea;
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
                font-size: 18px;
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
                .circleList{
                    display: flex;
                    align-items: center;
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
