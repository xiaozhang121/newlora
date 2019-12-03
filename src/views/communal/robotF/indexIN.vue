<template>
  <div class="robotfRoad">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="title">
      <span>室内轨道机器人</span>
      <button-custom
              class="moreTask"
              title="更多任务>"
              @click.native="$router.push({'path': 'detailIN',query: {substationId: substationId, robotId:robotId}})"
      />
    </div>
    <div class="content">
      <div class="top not-print">
        <div class="item">
          <div class="nr">
            <!--:streamAddr="cameraPath['rtspCDD']"-->
            <KeyMonitor
                    class="keyMonitor"
                    :autoplay="true"
                    :pushCamera="false"
                    :isLive='false'
                    :isNav='true'
                    :isAux='true'
                    :isRobot='true'
                    :streamAddr="video"
            />
          </div>
        </div>
        <div class="item" style="overflow: hidden;">
          <div style="height: 100%">
            <!--:streamAddr="cameraPath['rtspINF']"-->
            <div class="middle">
              <rou-tine-inspection
                      class="rouTine"
                      @on-fresh="onFresh"
                      :hidden="true"
                      type="indoor"
                      :isChange="ischange"
                      :robotId="robotId"
                      :substationId="substationId"
                      ref="rouTineInspection"
                      :taskStatus="taskStatus"
                      :robotStatus="robotStatus"
              >
                <div class="reportData1">
                  <report-data
                          v-if="taskStatus['taskType']"
                          :taskStatus="taskStatus"
                          :imgData="taskCurreny['taskCurLinkImg']"
                          :taskCurreny="taskCurreny"
                          :analysisResult="taskCurreny['valueShow']"
                          :dataType="taskCurreny['recognType']"
                          :deviceName="taskCurreny['deviceName']"
                          :stepCount="taskCurreny['doneStepsCnt']"
                  ></report-data>
                </div>
              </rou-tine-inspection>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="title">历史巡视报告</div>
        <div class="main">
          <template v-for="(item, index) in newsReportLength">
            <div class="item" :key="index">
              <report-table
                      :taskRunHisId="newsReport[index].ID"
                      :taskCurreny="taskCurreny"
                      path="report"
                      url="/lenovo-robot-indoor/rest/reportDownload"
                      kind="robot"
                      :reportData="newsReport[index]"
                      v-if="newsReport[index]"
              ></report-table>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!--<popup-one-info  :itemDataOption="$store.state.user.alarmInfo" v-if="visible" @onClose="alarmClose" :visible="visible"></popup-one-info>-->
  </div>
</template>

<script>
    import Breadcrumb from "_c/duno-c/Breadcrumb";
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
            popupOneInfo
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
                video: '',
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
                // dataBread: ['操作中台','机器人巡视','机器人一'],
                dataBread: [
                    { path: "/realEnv/list", name: "操作中台" },
                    { path: "/robot-two/list", name: "机器人巡视" },
                    { path: "", name: "室内轨道机器人" }
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
                  /*  this.$set(this.dataBread, 2, "机器人二");
                    this.robotName = "机器人二";*/
                    this.substationId = "10";
                    this.robotId = "26";
                } else {
                   /* this.dataBread[2] = "机器人一";
                    this.robotName = "机器人一";
                    this.$set(this.dataBread, 2, "机器人一");*/
                    this.substationId = "10";
                    this.robotId = "26";
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
                    this.initData();
                }, 3000);
            }
        },
        methods: {
            /*   alarmClose(){
                   this.visible = false
                   this.$store.state.user.isAlarm = false
               },*/
            onFresh(){
                this.initReport()
            },
            initData(){
                const that = this
                postAxiosData('/lenovo-robot-indoor/rest/taskStatus',{substationId: 10, robotId: 26}).then(res=>{
                    that.taskStatus = res.data
                    postAxiosData('/lenovo-robot-indoor/rest/taskCurLink',{substationId: 10, robotId: 26,taskRunHisId: that.taskStatus['taskRunHisId']}).then(res=>{
                        that.taskCurreny = res.data
                    })
                })
                postAxiosData('/lenovo-robot-indoor/rest/robotStatus',{substationId: 10, robotId: 26}).then(res=>{
                    that.robotStatus = res.data
                })
            },
            initReport(){
                const that = this
                postAxiosData('/lenovo-robot-indoor/rest/reports',{substationId: 10, robotId: 26,length: 10}).then(res=>{
                    that.reportsList = res.data
                    let data = res.data
                    data = data.reportList
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
                })
            },
            getVideo(){
                postAxiosData('/lenovo-robot-indoor/getRobotVedioPath',{substationID: 10, robotID: 26}).then(res=>{
                      let data = res.data.rtspCDD
                      postAxiosData('/lenovo-device/api/stream/transfer',{rtspUrl: data}).then(res=>{
                          this.video = res.data.rtmpUrl
                      })
                })
            }
        },
        created(){
            this.getVideo()
        },
        beforeDestroy() {
            clearInterval(this.$refs.rouTineInspection.timer);
            clearInterval(this.timer);
        },
        mounted() {
            this.routeName = this.$route.name;
        }
    };
</script>
<style lang="scss">
  .robotfRoad {
    color: white;
    width: 100%;
    height: 100%;
    .rouTineInspection_last{
      width: 100%;
      align-items: normal;
      justify-content: normal;
      .item{
        .name{
          flex-basis: 87px;
        }
        .nr{
          flex: 1;
        }
      }
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
          /*background: grey;*/
          &:last-child {
            margin-left: 1%;
          }
          .nr {
            position: relative;
            padding-bottom: 56%;
            width: 100%;
            /*background: grey;*/
            .keyMonitor {
              width: 100% !important;
              height: 100%;
              position: absolute;
            }
          }
        }
      }
      .middle {
        /*margin-top: 1%;*/
        background: #142838;
        height: 100%;
        .nr{
          padding-bottom: 0 !important;
        }
        .rouTineInspection{
          // width: 40%;
          height: 100%;
          padding-top: 6px;
        }
        .reportData1 {
          margin-top: 5px;
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
          .item {
            display: inline-block;
            margin-right: 1.5%;
            width: calc(94% / 5);
            .reportTable{
              height: 380px;
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
