<template>
    <div class="warningDialog three warningT new">
        <el-dialog  class="elDialogClass" :visible="true" width="900px" center @close="handleClose">
            <div slot="title">
                <div class="title_top">
          <span>
            <p>{{ '记录'+ '20190716022'}}</p>
            <p>{{ '相间比较'}}</p>
          </span>
                    <span class="iconList">
            <i class="iconfont icon-dayin" @click="toPrint($event)"  v-print="target"></i>
          </span>
                </div>
                <!--<div class="extend">{{ dataList.alarmTypeValue }}</div>-->
            </div>
            <div class="main">
                <div class="monitor">
                    <img src="" alt />
                    <img src="" alt />
                    <img src="" alt />
                </div>
                <div class="info">
                    <div class="info_item">
                        <div class="info_title">
                            判定结果：
                        </div>
                        <div class="info_main">
                            <p>变压器-本体邮箱</p>
                            <p class="bold">
                                <span>A相：22℃</span>
                                <span>B相：22℃</span>
                                <span>C相：22℃</span>
                            </p>
                            <p class="alarmType">
                                <span>三项告警</span>
                                <span class="from">结果修订</span>
                                <span class="from">差值修订</span>
                            </p>
                        </div>
                    </div>
                    <div class="info_item">
                        <div class="info_title">
                            来源：
                        </div>
                        <div class="info_main">
                            <p class="from">4号主变东侧红外221-23</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="handleInfo">
                <div>
                    <p class="monitorTitle">处理记录</p>
                    <div class="monitorMain">
                        <p v-for="(item, index) in [{createTime:'123123', manualRecognType: '2', manualValueShow: '4'}]" :key="index" class="item">
                            <span class="title">{{ item['createTime'] }}</span>
                            <span class="info">{{ item['manualRecognType']+'  '+item['manualValueShow'] }}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div style="clear: both"></div>
        </el-dialog>
        <!--<personJudge @on-close="onClose" :visible="visibleJudge" :taskCurreny="{taskDeviceId: $route.query.taskDeviceId}" :dataType="warnData['recognType']" :analysisResult="warnData['valueShow']" />-->
    </div>
</template>
<script>
    import { Base64 } from 'js-base64'
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
    import personJudge  from '_c/duno-m/personJudgeRobot'
    export default {
        components: { personJudge },
        data() {
            return {
                target: null,
                searchId: "",
                searchType: "",
                visibleJudge: false,
                handleList: [],
                newVisible: true,
                selectList: ["一般", "严重", "危急"],
                alarmLevelT: "",
                alarmLevelN: "",
                newMonitorUrl: "",
                dataList: [],
                discriminate: false
            };
        },
        props: {
            dataBread:{},
            warnData:{},
            popData: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            alarmType: {
                type: String,
                default: ""
            },
            handleNotes: {
                type: Array,
                default: () => {
                    return [
                        { time: "2019-06-31 12:22:32", info: "自定义文字描述" },
                        { time: "2019-06-31 12:22:32", info: "自定义文字描述" },
                        { time: "2019-06-31 12:22:32", info: "自定义文字描述" },
                        { time: "2019-06-31 12:22:32", info: "自定义文字描述" },
                        { time: "2019-06-31 12:22:32", info: "自定义文字描述" }
                    ];
                }
            },
            hasSelect: {
                type: Boolean,
                default: () => {
                    return false;
                }
            },
            // discriminate: {
            //   type: Boolean,
            //   default: () => {
            //     return false;
            //   }
            // },
            alarmLevel: {
                type: [String, Number],
                default: "1"
            },
            visible: {
                type: Boolean
            },
            monitorUrl: {
                type: String,
                default: () => {
                    return "";
                }
            },
            warningID: {
                type: String,
                default: () => {
                    return "";
                }
            },
            judgeResult: {
                type: String
            },
            origin: {
                type: String | Number,
                default: () => {
                    return "";
                }
            },
            handleResult: {
                type: String
            }
        },
        computed: {},
        watch: {
            popData(now) {
                if ("alarmId" in now) {
                    this.searchId = now["alarmId"];
                    this.searchType = "alarmId";
                } else {
                    this.searchId = now["resultId"];
                    this.searchType = "resultId";
                }
                this.initData();
            },
            // handleNotes(now) {
            //   this.handleList = [];
            //   let obj = {};
            //   now.forEach(el => {
            //     obj.time = el.dealTime;
            //     obj.info = el.dealType;
            //     this.handleList.push(obj);
            //   });
            // },
            alarmLevel: {
                handler(now) {
                    this.alarmLevelN = now;
                    this.alarmLevelT = this.selectList[now - 1];
                },
                deep: true,
                immediate: true
            },
            visible(now) {
                this.newVisible = now;
            }
        },
        methods: {
            openPage(){
                /*   sessionStorage.setItem('datainfo', Base64.encode(JSON.stringify(this.popData)))
                   sessionStorage.setItem('info', Base64.encode(JSON.stringify(this.warnData)))*/
                let routeData = this.$router.resolve({ name: 'newPageT', params: { } });
                window.open(routeData.href, '_blank');
            },
            toPrint(e){
                this.target = e.path[5]
            },
            onClose(){
                this.visibleJudge = false
                this.$emit('on-fresh')
            },
            initData() {
                //   debugger;
                getAxiosData("/lenovo-plan/api/task-result/view", {
                    [this.searchType]: this.searchId
                }).then(res => {
                    this.dataList = res.data;
                    let obj = {};
                    res.data.dealList.forEach(el => {
                        obj.time = el.dealTime;
                        obj.info = el.dealType;
                        this.handleList.push(obj);
                    });

                    if (this.dataList.alarmTypeValue == "动态环境类") {
                        this.discriminate = true;
                    }
                });
            },
            selectItem(item, index) {
                this.alarmLevelT = item;
                this.alarmLevelN = index + 1;
            },
            handleClose() {
                this.newVisible = false;
                // this.$emit('change-level', item, index+1)
                this.$emit("handleClose");
            },
            getJump() {
                if (this.popData.monitorDeviceType == "1") {
                    this.$router.push({
                        path: "/surveillancePath/detailLight",
                        query: {
                            monitorDeviceId: this.popData.monitorDeviceId
                        }
                    });
                } else if (this.popData.monitorDeviceType == "2") {
                    this.$router.push({
                        path: "/surveillancePath/detailRed",
                        query: {
                            monitorDeviceId: this.popData.monitorDeviceId
                        }
                    });
                }
            },
            clickJudge() {
                //   debugger;
                this.visibleJudge = true;
            }
        },
        mounted() {
            this.newVisible = this.visible;
        }
    };
</script>
<style lang="scss">
    .three{
        .el-dialog__close{
            left: 5px;
        }
        .el-dialog__headerbtn{
            right: 14px;
            top: 20px;
        }
    }
    .warningDialog.three .handleInfo > div{
        max-height: 200px;
        height: inherit !important;
        overflow-y: auto;
    }
    .warningDialog.three {
        &.new{
            .el-dialog__close{
                display: none;
            }
        }
        @media print {
            .not-print {
                opacity: 0;
            }
            .el-dialog__headerbtn{
                display: none;
            }
            .iconList{
                display: none;
            }
            .elDialogClass {
                .el-dialog--center {
                    width: 710px !important;
                }
            }
            .warningDialog .handleInfo > div{
                max-height: inherit;
            }
            .el-dialog.el-dialog--center{
                margin-top: 0vh !important;
            }
        }
        .el-dialog__body{
            padding: 25px 21px 30px !important;
        }
        .iconfont.icon-xiala {
            color: #999999;
            font-size: 10px;
            margin-left: 3px;
        }
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
        .table_select {
            cursor: pointer;
            color: #1d1f26;
            .member_operate_div {
                span {
                    font-size: 14px !important;
                }
            }
            span {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 47px !important;
                height: 24px !important;
                border-radius: 20px;
            }
            &.serious {
                span {
                    background: #f4a723;
                }
            }
            &.commonly {
                span {
                    background: #5eb0fc;
                }
            }
            &.danger {
                span {
                    background: #d0011b;
                }
            }
        }
        .main {
            display: flex;
            flex-direction: column;
            .monitor {
                width: 85%;
                height: 130px;
                background-color: inherit !important;
                display: flex;
                img {
                    width: 100%;
                    height: 100%;
                    margin-right: 20px;
                    display: block;
                    background: grey;
                    &:last-child{
                        margin-right: 0;
                    }
                }
            }
            .info {
                position: relative;
                margin-left: 0px;
                flex: 1;
                color: #333333;
                font-size: 14px;
                .from{
                    color: #3774fe;
                    text-decoration: underline;
                    position: inherit;
                    bottom: inherit;
                }
                .info_item{
                    display: flex;
                    margin-top: 20px;
                    line-height: 31px;
                    .info_title{
                        text-align: right;
                        width: 71px;
                        margin-right: 30px;
                    }
                    .info_main{
                        .bold{
                            font-size: 20px;
                            font-weight: bold;
                            margin: 4px 0;
                            span{
                                margin-right: 40px;
                            }
                        }
                        .alarmType{
                            span{
                                margin-right: 40px;
                                &.from{
                                    cursor: pointer;
                                }
                            }
                        }
                    }
                }
            }
        }
        .handleInfo {
            color: #333333;
            .monitorMain{
                max-height: 300px;
                overflow-y: auto;
            }
            .monitorTitle {
                margin: 14px 0;
                margin-top: 40px;
            }
            .item {
                display: flex;
                line-height: 34px;
                padding: 0 20px;
                .title {
                    margin-right: 40px;
                }
                .info {
                    flex-grow: 1;
                }
                &:nth-last-child(odd) {
                    background: #c7c7c7;
                }
            }
        }
        .el-dialog {
            background: #e0e0e0;
        }
        .el-dialog__header {
            text-align: left;
            padding-bottom: 0;
        }
        .title_top {
            font-weight: bold;
            text-align: left;
            & > span:first-child{
                p:last-child{
                    color: #969696;
                    font-size: 15px;
                }
            }
            .iconList{
                position: absolute;
                right: 33px;
                top: 20px;
                .iconfont{
                    font-size: 22px;
                    cursor: pointer;
                    color: #909399;
                    margin-right: 10px;
                }
            }
        }
        .extend {
            font-size: 14px;
            margin-top: 3px;
        }
    }
</style>

