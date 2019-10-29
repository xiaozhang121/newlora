<template>
    <div class="reportData" >
        <div class="title" v-if="taskCurreny['doneStepsCnt']">
            <span>第{{ stepCount }}步上报数据</span>
            <span @click="visible = true">人工否定</span>
        </div>
        <div class="title" v-else>
            <span v-if="taskStatus['taskState'] == 2">正在巡视中</span>
            <span v-else>任务暂停中</span>
            <span></span>
        </div>
        <div :style="{visibility: taskCurreny['doneStepsCnt']?'visible':'hidden'}" class="middle">
            <div class="img">
                <img :src="imgData" />
            </div>
        </div>
        <div :style="{visibility: taskCurreny['doneStepsCnt']?'visible':'hidden'}" class="last">
            <div class="item">
                <div class="name">设备名：</div>
                <el-tooltip  effect="dark" :content="deviceName" placement="top">
                <div class="nr itemNr">{{ deviceName }}</div>
                </el-tooltip>
            </div>
            <div class="item">
                <div class="name">数据类型：</div>
                <div class="nr">{{ dataType }}</div>
            </div>
            <div class="item result" :style="{marginLeft:'0'}">
                <div class="name">分析结果：</div>
                <div class="nr"><span :class="{'redColor': taskCurreny['alarmFlag']}">{{ analysisResult }}</span><span class="smallGrey" v-if="analysisResult">(机器人识别)</span>&nbsp;{{yinShiResult}}<span class="smallGrey" v-if="yinShiResult">(音视识别)</span></div>
               <!-- <i-dropdown
                        v-if="taskCurreny['alarmLevel']"
                        class="dropAlarmDown"
                        trigger="click"
                        placement="bottom-start"
                >
                    <div
                            class="table_select"
                            :class="[{'serious': taskCurreny['alarmLevel'] == '2104'},{'commonly': taskCurreny['alarmLevel'] == '2101' || taskCurreny['alarmLevel'] == '2102' || taskCurreny['alarmLevel'] == '2103'},{'danger': taskCurreny['alarmLevel'] == '2105'}]"
                    >
                  <span class="member_operate_div">
                    <span>{{ taskName }}</span>
                  </span>
                        <i class="iconfont icon-xiala"></i>
                    </div>
                    <i-dropdownMenu slot="list">
                        <i-dropdownItem
                                v-for="(itemL, indexL) in selectList"
                                :key="'select'+indexL"
                                @click.native="selectItem(indexL)"
                        >
                            <div class="alarmLevel">{{ itemL }}</div>
                        </i-dropdownItem>
                    </i-dropdownMenu>
                </i-dropdown>-->
            </div>
        </div>
        <person-judge :taskCurreny="taskCurreny" :dataType="dataType" :analysisResult="analysisResult" @on-close="visible = false" :visible="visible"></person-judge>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import personJudge  from '_c/duno-m/personJudgeRobot'
    export default {
        name: 'reportData',
        components: {
            personJudge
        },
        data() {
            return {
                visible: false,
                selectList: ["正常", "预警", "一般","严重","危急"]
            }
        },
        props: {
            taskStatus:{},
            imgData:{},
            taskCurreny: {},
            imgUr:{
                type: String,
                default: ''
            },
            alarmLevel: {
                type: [Number, String],
                default: 1
            },
            stepCount: {
                type: [Number, String],
                default: 1
            },
            deviceName: {
                type: String,
                default: '4号主变1000kv侧'
            },
            dataType: {
                type: String,
                default: '隔离开关触头'
            },
            analysisResult:{
                type: String,
                default: '未识别'
            },
            yinShiResult: {
                type: String,
                default: '未识别'
            },
        },
        watch: {

        },
        computed: {
            taskName(){
                if(this.taskCurreny['alarmLevel'] == '2101'){
                    return '正常'
                }else if(this.taskCurreny['alarmLevel'] == '2102'){
                    return '预警'
                }else if(this.taskCurreny['alarmLevel'] == '2103'){
                    return '一般'
                }else if(this.taskCurreny['alarmLevel'] == '2104'){
                    return '严重'
                }else if(this.taskCurreny['alarmLevel'] == '2105'){
                    return '危急'
                }
            }
        },
        methods:{
            selectItem(index) {
                console.log(index+1)
            }
        },
        created(){
        },
        mounted() {

        }
    }
</script>

<style lang="scss">
    .reportData{
        width: 100%;
        .serious {
            span {
                background: #f4a723;
            }
        }
        .commonly {
            span {
                background: #5eb0fc;
            }
        }
        .danger {
            span {
                background: #d0011b;
            }
        }
        .title{
            display: flex;
            justify-content: space-between;
            color: #3a77ff;
            font-size: 16px !important;
            & span:first-child{
                color: white;
            }
            & span:last-child{
                position: relative;
                text-decoration: underline;
                cursor: pointer;
            }
        }
        .middle{
            width: 200px;
            position: relative;
            .img{
                width: 100%;
                padding-bottom: 56%;
                position: relative;
                img{
                    width: 100%;
                    height: 100%;
                    position: absolute;
                }
            }
        }
        .last{
            display: flex;
            flex-direction: column;
            .item{
                display: flex;
                color: #cccccc;
                font-size: 14px;
                margin-bottom: 10px;
                &:first-child{
                    margin-top: 10px;
                    color: white;
                }
                &.result{
                    justify-items: center;
                    .dropAlarmDown{
                        margin-left: 58px;
                        position: relative;
                        top: -3px;
                    }
                }
            }
        }
        .itemNr{
            overflow:hidden; 
            text-overflow:ellipsis; 
            white-space:nowrap;
        }
        .smallGrey{
            font-size: 14px;
            color: #cccccc;
        }
        .redColor{
            color: red;
        }
    }
</style>


