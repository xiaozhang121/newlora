<template>
  <div class="robotReport">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="title">
      历史巡视报告
      <!-- <el-date-picker
               v-model="selectTime"
               type="daterange"
               start-placeholder="开始日期"
               end-placeholder="结束日期"
               @change="onChangeTime"
              >
       </el-date-picker>-->
    </div>
    <duno-main  v-loading="loading"
                 element-loading-background="rgba(0, 0, 0, 0)"
                element-loading-text="请稍后，正在加载数据…">
      <div class="content">
        <div class="bottom">
          <div class="main">
            <template v-for="(item, index) in newsReportLength">
              <div class="item" :key="index">
                <report-table
                        :taskRunHisId="newsReport[index].ID"
                        :taskCurreny="taskCurreny"
                        path="report"
                        url="/lenovo-robot/rest/reportDownload"
                        kind="robot"
                        :reportData="newsReport[index]"
                        v-if="newsReport[index]"
                ></report-table>
              </div>
            </template>
          </div>
          <el-pagination
                  v-show="newsReportLength"
                  @current-change="currentChange"
                  layout="prev, pager, next"
                  :total="reportNow.dataNum">
          </el-pagination>
        </div>
      </div>
    </duno-main>
    <!--<popup-one-info  :itemDataOption="$store.state.user.alarmInfo" v-if="visible" @onClose="alarmClose" :visible="visible"></popup-one-info>-->
  </div>
</template>

<script>
    import dunoMain  from '_c/duno-m/duno-main'
    import Breadcrumb from "_c/duno-c/Breadcrumb";
    import moment from "moment";
    import mixinViewModule from "@/mixins/view-module";
    import KeyMonitor from "_c/duno-c/KeyMonitor";
    import cameraPanel from "_c/duno-m/cameraPanel";
    import controBtn from "_c/duno-m/controBtn";
    import buttonCustom from "_c/duno-m/buttonCustom";
    import reportData from "_c/duno-m/reportData";
    import ReportTable from "_c/duno-c/ReportTable";
    import rouTineInspection from "_c/duno-m/rouTineInspection";
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
    import { mapState } from "vuex";
    import { popupinfo, popupOneInfo, popupinfod } from "_c/popupinfo";
    export default {
        mixins: [mixinViewModule],
        name: "RoleIndex",
        components: {
            Breadcrumb,
            cameraPanel,
            controBtn,
            rouTineInspection,
            KeyMonitor,
            ReportTable,
            buttonCustom,
            reportData,
            popupOneInfo,
            dunoMain
        },
        computed: {
            ...mapState(["user"]),
            isAlarm() {
                return this.$store.state.user.isAlarm;
            },
            newsReportLength() {
                if (this.newsReport.length % 5 != 0) {
                    let base = parseInt(this.newsReport.length / 5);
                    return (base + 1) * 5;
                } else {
                    return this.newsReport.length;
                }
            }
        },
        data() {
            const that = this;
            return {
                reportNow: {
                    currentPage: 1,
                    dataNum: 0
                },
                selectTime: false,
                loading: true,
                noPic: require("@/assets/noPic.png"),
                visible: false,
                ischange: false,
                timer: null,
                socketUrl: "10.0.0.1",
                substationId: "",
                robotId: "",
                taskId: "",
                taskCurreny: "",
                robotStatus: "",
                taskStatus: "",
                reportsList: [],
                robotName: "",
                routeName: "",
                newsReport: [],
                cameraPath: [],
                dataBread: [
                    { path: "/realEnv/list", name: "操作中台" },
                    { path: "/robot-one/list", name: "机器人巡视" },
                    { path: "/robot-one/list", name: "室外巡检机器人一" },
                    { path: "", name: "历史巡视报告" }
                ],
                baseUrl:
                    process.env.NODE_ENV === "development"
                        ? that.$config.baseUrl.dev
                        : that.$config.baseUrl.pro
            };
        },
        watch: {
            isAlarm: {
                handler(now) {
                    this.visible = now;
                },
                deep: true,
                immediate: true
            },
            $route(to) {
                clearInterval(this.timer);
                this.routeName = to.name;
            },
            routeName(now) {
                try {
                    this.$refs.rouTineInspection.$refs.gisMapObj.pointListObj = [];
                    this.$refs.rouTineInspection.deviceList = [];
                    this.$refs.rouTineInspection.$refs.gisMapObj.$forceUpdate();
                } catch (e) {}

                if (now == "robot-twoList") {
                    this.dataBread[2]['name'] = '室外巡检机器人二'
                    this.dataBread[2]['path'] = "/robotN-two/list"
                    this.substationId = "1";
                    this.robotId = "9";
                } else {
                    this.dataBread[2]['name'] = '室外巡检机器人一'
                    this.substationId = "1";
                    this.robotId = "1";
                }
                try {
                    this.$refs.rouTineInspection.$refs.gisMapObj.rmCover(
                        this.$refs.rouTineInspection.$refs.gisMapObj.pointListObj[0]["anchor"]
                    );
                } catch (e) {}
                try {
                    this.$refs.rouTineInspection.$refs.gisMapObj.removeLineList(
                        this.$refs.rouTineInspection.$refs.gisMapObj.coverList
                    );
                } catch (e) {}
                this.initReport();
                this.initData();
                this.ischange = !this.ischange;
                this.timer = setInterval(() => {
                    // this.initData();
                }, 3000);
            }
        },
        methods: {
            currentChange(currentPage){
                this.reportNow.currentPage = currentPage
                this.initReport()
            },
            onChangeTime(data){
                let startTime = "";
                let endTime = "";
                if (data) {
                    startTime = moment(data[0]).format("YYYY-MM-DD");
                    endTime = moment(data[1]).format("YYYY-MM-DD");
                }
                this.startDay = startTime;
                this.endDay = endTime;
                this.initReport()
            },
            toMore(){
                const that = this
                this.$router.push({
                    path: "reportList",
                    query: {
                        substationId:  that.substationId,
                        robotId: that.robotId
                    }
                });
            },
            /*   alarmClose(){
                   this.visible = false
                   this.$store.state.user.isAlarm = false
               },*/
            onFresh(){
                this.initReport()
            },
            initData(){
                const that = this
                postAxiosData('/lenovo-robot/rest/taskStatus',{substationId: that.substationId, robotId: that.robotId}).then(res=>{
                    that.taskStatus = res.data
                    postAxiosData('/lenovo-robot/rest/taskCurLink',{substationId: that.substationId, robotId: that.robotId,taskRunHisId: that.taskStatus['taskRunHisId']}).then(res=>{
                        that.taskCurreny = res.data
                    })
                })
                postAxiosData('/lenovo-robot/rest/robotStatus',{substationId: that.substationId, robotId: that.robotId}).then(res=>{
                    that.robotStatus = res.data
                })
            },
            initReport(){
                const that = this
                that.loading = true
                that.newsReport = []
                let start = this.reportNow.currentPage - 1
                postAxiosData('/lenovo-robot/rest/reportsByPage',{substationId: that.substationId, robotId: that.robotId, length: 10, start:  start}).then(res=>{
                    that.reportsList = res.data
                    let data = res.data.tableData
                    this.reportNow.dataNum = Number(res.data.pageParam.totalRows)
                    data.map(item=>{
                        // item['pic'] = that.baseUrl+'/'+item['RoadImgPath']
                        if('taskImg' in item && item['taskImg'])
                            item['pic'] = item['taskImg']
                        item['planId'] = item['TaskID']
                        if(item['taskType'] == '1501')
                            item['name'] = '全面巡视'
                        else if(item['taskType'] == '1502')
                            item['name'] = '例行巡视'
                        else if(item['taskType'] == '1503')
                            item['name'] = '专项巡视'
                        else if(item['taskType'] == '1504')
                            item['name'] = '特殊巡视'
                        else
                            item['name'] = '暂无数据'
                        item['date'] = item['PlanStartTime']
                        item['alarmNum'] = item['AlarmCount']
                        item['timeLong'] = item['timeLong']
                    })
                    that.newsReport = data
                    that.loading = false
                })
                postAxiosData('/lenovo-robot/getRobotVedioPath',{stationID: that.substationId, robotID: that.robotId}).then(res=>{
                    that.cameraPath = res.data
                })
            }
        },
        created(){
        },
        created() {},
        beforeDestroy() {
            clearInterval(this.timer);

        },
        mounted() {
            this.routeName = this.$route.name;
        }
    };
</script>
<style lang="scss">
  .robotReport {
    color: white;
    width: 100%;
    height: 100%;
    //分页--
    .el-pagination {
      color: #fff;
      display: flex;
      justify-content: center;
    }
    .el-pagination .btn-prev,
    .el-pagination .btn-next {
      background-color: rgba(0, 0, 0, 0);
      color: #142838;
    }
    .el-pager li {
      background-color: rgba(0, 0, 0, 0);
    }
    .el-pager li.active {
      color: #5fafff;
    }
    .el-pager li.btn-quicknext,
    .el-pager li.btn-quickprev {
      color: #fff;
    }
    //--
    .el-loading-text {
      color: #969696 !important;
    }
    .el-date-editor .el-range__icon{
      color: white;
    }
    .el-range-editor--small .el-range-separator{
      color: white;
    }
    .el-range-editor--small.el-input__inner{
      height: 32px;
      width: 254px;
      background: #1a2f42;
      border: none;
      input{
        background: #1a2f42;
        color: white;
      }
    }
    .dunoMain{
      height: auto;
      .dunoMain_nr{
        padding: 0 17px;
        padding-top: 17px;
      }
    }
    .moreInfo{
      font-size: 16px;
      text-align: center;
      cursor: pointer;
      width: 106px;
      background-size: 100% 100%;
      line-height: 34px;
      background-image: url(../../../assets/images/btn/createTask.png);
    }
    .noLoading{
      /*.vjs-fluid {
        padding-top: 56%;
      }*/
      .el-loading-mask{
        display: none;
      }
      .video-player.vjs-custom-skin{
        transform: scale(1,1.38);
        transform-origin: left top;
      }
    }
    .redCamera {
      .video-player.vjs-custom-skin {
        /*transform: scale(1,1.38);*/
        /*transform-origin: left top;*/
      }
    }
    .breadcrumb {
      margin-bottom: 15px;
    }
    .title {
      display: flex;
      font-size: 20px;
      margin-bottom: 15px;
      justify-content: space-between;
      align-items: center;
      .moreTask {
        transform: scale(0.8);
      }
    }
    .content {
      .top {
        display: flex;
        .item {
          width: 100%;
          background: grey;
          &:last-child {
            margin-left: 1%;
          }
          .nr {
            position: relative;
            padding-bottom: 56%;
            width: 100%;
            background: grey;
            .keyMonitor {
              width: 100% !important;
              height: 100%;
              position: absolute;
            }
          }
        }
      }
      .middle {
        margin-top: 1%;
        background: #142838;
        .reportData {
          position: relative;
          margin-right: 50px;
          margin-left: 44px;
        }
      }
      .bottom {
        .title {
          margin: 15px 0;
        }
        .main {
          display: flex;
          flex-wrap: wrap;
          min-height: calc(100vh - 234px);
          .item {
            display: inline-block;
            margin-right: 1.5%;
            width: calc(94% / 5);
            .reportTable{
              height: 360px;
            }
            &:nth-last-child(5n + 1) {
              margin-right: 0;
            }
          }
          h3 {
            width: 100% !important;
          }
        }
      }
    }
  }
</style>
