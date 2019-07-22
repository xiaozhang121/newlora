<template>
    <div class="reportData" >
        <div class="title">
            <span>第{{ stepCount }}步上报数据</span>
            <span>人工否定</span>
        </div>
        <div class="middle">
            <div class="img">
                <img src="" />
            </div>
        </div>
        <div class="last">
            <div class="item">
                <div class="name">设备名：</div>
                <div class="nr">{{ deviceName }}</div>
            </div>
            <div class="item">
                <div class="name">数据类型：</div>
                <div class="nr">{{ dataType }}</div>
            </div>
            <div class="item result">
                <div class="name">分析结果：</div>
                <div class="nr">{{ analysisResult }}</div>
                <i-dropdown
                        class="dropAlarmDown"
                        trigger="click"
                        placement="bottom-start"
                >
                    <div
                            class="table_select"
                            :class="[{'serious': alarmLevel == '2'},{'commonly': alarmLevel == '1'},{'danger': alarmLevel == '3'}]"
                    >
                  <span class="member_operate_div">
                    <span>正常</span>
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
                </i-dropdown>
            </div>
        </div>
        <person-judge :visible="false"></person-judge>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import personJudge  from '_c/duno-m/personJudge'
    export default {
        name: 'reportData',
        components: {
            personJudge
        },
        data() {
            return {
                selectList: ["一般", "严重", "危急"]
            }
        },
        props: {
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
                default: '正常'
            }
        },
        watch: {

        },
        computed: {

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
                left: -18px;
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
    }
</style>


