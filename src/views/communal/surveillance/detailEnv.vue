<template>
  <div class="detailEnv">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="controlTitle">
      <div>
        <span>{{ dataForm.monitorDeviceName }}</span>
        <span class="isEqual" :class="{'hidden': isEqual}"  @click="toReal">切换至实时视频</span>
      </div>
    </div>
    <div class="Main_contain">
      <div class="content">
        <div class="left nr">
          <div class="item">
            <div class="camera_surveillanceDetail">
              <div class="contain">
                <key-monitor
                  :monitorInfo="{ monitorDeviceId: dataForm.monitorDeviceId }"
                  paddingBottom="56%"
                  class="monitor child"
                  :autoplay="playerOptions.autoplay"
                  :streamAddr="playerOptions.streamAddr"
                  :showBtmOption="false"
                  :Initialization="true"
                ></key-monitor>
              </div>
            </div>
          </div>
        </div>
          <div class="left nr">
          <div class="item" style="background: transparent">
            <div class="camera_surveillanceDetail">
              <div class="contain color">
                  <div class="main_add">
                    <div class="title_add">
                      <span>24小时监测记录</span>
                      <duno-btn-top
                              @on-select="onSelect"
                              :zIndex="1"
                              class="timeSelect"
                              :isCheck="false"
                              :dataList="timeList"
                              :title="timeValue"
                              :showBtnList="false"
                      ></duno-btn-top>
                    </div>
                    <div class="contain_add">
                      <div class="loading" :class="{'zIndex': loading}"  v-loading="loading"  element-loading-background="rgba(0, 0, 0, 0.8)"
                           element-loading-text="加载中"></div>
                      <video-list class="videoList" :index="index" v-for="(item, index) in videoList"  :dataInfo="item" :key="index" @on-play="onPlay" />
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="middle_table">
        <div class="top not-print">
          <div class="name">动态环境异常记录</div>
          <!-- <div class="select">
            <div>
              <duno-btn-top
                @on-select="onSelect"
                :zIndex="1"
                class="dunoBtnTo"
                :isCheck="false"
                :dataList="allDataKind"
                :title="titleTypeL"
                :showBtnList="false"
              ></duno-btn-top>
            </div>
            <div>
              <duno-btn-top
                @on-select="onSelect"
                :zIndex="1"
                class="dunoBtnTop"
                :isCheck="false"
                :dataList="allDataLevel"
                :title="titleTypeR"
                :showBtnList="false"
              ></duno-btn-top>
            </div>
          </div>-->
          <div class="btn">
            <div class="dateChose">
              <el-date-picker
                unlink-panels
                v-model="dataTime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="onChangeHis"
              ></el-date-picker>
            </div>
            <div>
              <div @click="clickExcel" class="clickBtn">
                <i class="iconfont icon-daochu1"></i>
                导出表格
              </div>
            </div>
          </div>
        </div>
        <duno-tables-tep
          class="table_abnormalInfo"
          :columns="columns"
          :data="dataList"
          :totalNum="totalNum"
          :pageSize="pageRows"
          :current="pageIndex"
          :border="true"
          :showSizer="true"
          @on-select="dataListSelectionChangeHandle"
          @clickPage="pageCurrentChangeHandle"
          @on-page-size-change="pageSizeChangeHandle"
        />
      </div>
      <!--<div class="historicalData">
        <div class="top">
          <div>历史数据</div>
          <div class="btn">
            <div>
              <duno-btn-top
                @on-select="onSelect"
                class="dunoBtnTop"
                :isCheck="false"
                :dataList="typeList"
                :title="titleType"
                :showBtnList="false"
              ></duno-btn-top>
            </div>
            <div class="dateChose">
              <el-date-picker
                unlink-panels
                v-model="value"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="onChangeTime"
              ></el-date-picker>
            </div>
            <div>
              <div @click="clickExcel" class="clickBtn">
                <i class="iconfont icon-daochu1"></i>
                导出表格
              </div>
            </div>
          </div>
        </div>
        <div class="con-chart">
          <echarts :dataAllList="echartData" />
        </div>
      </div>-->
    </div>
    <wraning :popData="popData" detailsType="alarm" :visible="visible" @handleClose="handleClose" />
    <enlarge :isShow="isEnlarge" :srcData="srcData" @closeEnlarge="closeEnlarge" />
    <Remarks :isShow="dialogVisible" :alarmId="alarmId" @beforeClose="beforeClose" />
  </div>
</template>

<script>
import videoList from "./components/videoList";
import axios from 'axios'
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import enlarge from "_c/duno-c/enlarge";
import echarts from "_c/duno-c/echarts";
import controBtn from "_c/duno-m/controBtn";
import buttonCustom from "_c/duno-m/buttonCustom";
import Remarks from "_c/duno-c/Remarks";
import mixinViewModule from "@/mixins/view-module";
import inspection from "_c/duno-m/inspection";
import { DunoTablesTep } from "_c/duno-tables-tep";
import warningSetting from "_c/duno-j/warningSetting";
import wraning from "_c/duno-j/warning";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import moment from "moment";
import {
  getVLIght,
  getVType,
  getVGrade,
  getVPreset,
  getVEcharts,
  getPosition,
  dealRemarks
} from "@/api/configuration/configuration.js";
export default {
  name: "detailEnv",
  mixins: [mixinViewModule],
  components: {
    videoList,
    dunoBtnTop,
    KeyMonitor,
    Breadcrumb,
    controBtn,
    inspection,
    DunoTablesTep,
    echarts,
    warningSetting,
    wraning,
    buttonCustom,
    enlarge,
    Remarks
  },
  data() {
    const that = this;
    return {
      loading: false,
      pageIndexD: 1,
      timeList: [],
      timeValue: '全部日期',
      videoList: [],
      chosenDate: "",
      addOrEdit: "添加",
      disabled: false,
      mixinViewModuleOptions: {
        // activatedIsNeed: true,
        getDataListURL: "/lenovo-alarm/api/security/list",
        exportURL: "/lenovo-alarm/api/security/history/export"
      },
      titleType: "选择预置位",
      titleTypeL: "全部数据类型",
      titleTypeR: "全部异常类型",
      isControl: "1",
      alarmId: "",
      currentTime: 10,
      timeOut: null,
      isEnlarge: false,
      dialogVisible: false,
      dataForm: {},
      queryForm: {},
      echartForm: {},
      echartData: [],
      srcData: [],
      value: "",
      textarea: "",
      alarmLevel: "",
      visible: false,
      visibleSettingOption: false,
      popData: {},
      columns: [
        {
          title: "拍摄时间",
          key: "alarmTime",
          minWidth: 100,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            return h("div", [
              h(
                "Tooltip",
                {
                  props: {
                    placement: "top",
                    content: params.row.alarmTime,
                    transfer: true
                  },
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }
                },
                params.row.alarmTime
              )
            ]);
          }
        },
        {
          title: "告警类型",
          key: "alarmType",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        // {
        //   title: "拍摄来源",
        //   key: "monitorDeviceName",
        //   minWidth: 120,
        //   align: "center",
        //   tooltip: true,
        //   render: (h, params) => {
        //     let newArr = [];
        //     newArr.push([
        //       h(
        //         "a",
        //         {
        //           class: "table_link",
        //           props: { type: "text" },
        //           on: {
        //             click: () => {
        //               this.getJump(params.row);
        //             }
        //           }
        //         },
        //         params.row.monitorDeviceName
        //       )
        //     ]);
        //     return h("div", { class: { member_operate_div: true } }, newArr);
        //   }
        // },
        {
          title: "处理记录",
          key: "dealType",
          minWidth: 90,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            return h("div", params.row.dealList[0].dealType);
          }
        },
        {
          title: "处理时间",
          key: "dealTime",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let timeDay = params.row.dealList[0].dealTime.slice(5);
            return h("div", timeDay);
          }
        },
        {
          title: "视频/图片",
          key: "id",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            if (params.row.fileType == "1") {
              newArr.push([
                h("img", {
                  class: "imgOrMv",
                  attrs: { src: params.row.alarmFileAddress },
                  draggable: false,
                  on: {
                    click: () => {
                      that.isEnlarge = true;
                      that.srcData = params.row;
                    }
                  }
                })
              ]);
            } else if (params.row.fileType == "2") {
              newArr.push([
                h("video", {
                  class: "imgOrMv",
                  attrs: { src: params.row.alarmFileAddress },
                  draggable: false,
                  on: {
                    click: () => {
                      that.isEnlarge = true;
                      that.srcData = params.row;
                    }
                  }
                })
              ]);
            }
            return h("div", newArr);
          }
        },
        {
          title: " ",
          width: 200,
          align: "center",
          render: (h, params) => {
            let newArr = [];
            if (params.row.isReturn == "0") {
              newArr.push(
                h(
                  "el-button",
                  {
                    class: "btn_pre",
                    style: { background: "#305e83!important" },
                    props: { type: "text" },
                    on: {
                      click: () => {
                        that.addReturn(params.row);
                      }
                    }
                  },
                  "复归"
                )
              );
            }
            if (params.row.isReturn == "1") {
              newArr.push(
                h(
                  "el-button",
                  {
                    class: "btn_pre",
                    style: {
                      background: "#979797",
                      color: "#767676",
                      pointerEvents: "none"
                    },
                    props: { type: "text" }
                  },
                  "已复归"
                )
              );
            }
            newArr.push(
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1!important" },
                  props: { type: "text" },
                  on: {
                    click: () => {
                      this.alarmId = params.row.alarmId;
                      this.dialogVisible = true;
                    }
                  }
                },
                "备注"
              )
            );
            return h("div", newArr);
          }
        },
        {
          title: " ",
          key: "id",
          width: 220,
          align: "center",
          render: (h, params) => {
            const that = this;
            let newArr = [];
            newArr.push([
              h(
                "el-button",
                {
                  class: "table_link",
                  style: { marginRight: "20px" },
                  props: { type: "text" },
                  on: {
                    click: () => {
                      that.popData = params.row;
                      that.alarmLevel = params.row.alarmLevel;
                      that.visible = true;
                    }
                  }
                },
                "详情"
              )
            ]);
            return h(
              "div",
              {
                class: "flexPos"
              },
              newArr
            );
          }
        }
      ],
      playerOptions: {
        streamAddr: "",
        autoplay: true
      },
      playerOptionsd: {
        streamAddr: "",
        autoplay: true
      },
      backUPAddr: '',
      presetName: "",
      dataTime: "",
      dataBread: [{ name: "摄像头详情" }],
      cancelList: [],
      isRequest: false
    };
  },
  computed:{
      isEqual(){
          return (this.backUPAddr == this.playerOptions.streamAddr)
      }
  },
  props: {
    deviceId: {
      type: [String, Number],
      default: "54"
    }
  },
  methods: {
    toReal(){
        this.playerOptions.streamAddr = this.backUPAddr
        let data = this.videoList
        data.map(item=>{
            item['isPlay'] = false
        })
        this.videoList = data
    },
    onPlay(index){
        let data = JSON.parse(JSON.stringify(this.videoList))
        data.map((item, i)=>{
            if(index == i){
              item['isPlay'] = true
            }else
              item['isPlay'] = false
        })
        this.videoList = data
        this.playerOptions.streamAddr = this.videoList[index]['streamAddr']
        console.log(this.videoList[index]['streamAddr'])
        this.$forceUpdate()
    },
    clearRequest(){
        const that = this
        for (let p in that.cancelList) {
            that.cancelList[p].cancel('demo111')
        }
        that.cancelList = []
    },
    getVideo(date){
        const that = this
        that.loading = true
        if(!this.isRequest) {
            this.isRequest = true
            getAxiosData('/lenovo-device/device/video/record/videos', {
                pageIndex: this.pageIndexD,
                pageRows: 7,
                date: date,
                monitorDeviceId: this.dataForm.monitorDeviceId
            }).then(res => {
                let data = res.data.tableData
                let indexX = 0
                indexX = this.videoList.length
                data.map(item => {
                    item['isPlay'] = false
                })
                if (that.pageIndexD != 1) {
                    that.videoList = that.videoList.concat(data)
                } else {
                    that.videoList = data
                }
                that.$forceUpdate()
                that.isRequest = false
                that.loading = false
                debugger
                for (let i = indexX; i < that.videoList.length; i++) {
                    that.cancelList.push(axios.CancelToken.source())
                     postAxiosData("/lenovo-device/device/video/record/video/pic", {
                        cancelToken: that.cancelList[that.cancelList.length-1].token,
                        positionIndex: i,
                        videoPath: that.videoList[i]['streamAddr']
                    }).then(res => {
                        let data = res.data
                        that.$set(that.videoList[data['positionIndex']], 'pic', data['pic'])
                        that.$forceUpdate()
                    })
                }
            })
        }
    },
    initTime(){
        getAxiosData('/lenovo-device/device/video/record/date/select-list',{ monitorDeviceId: this.dataForm.monitorDeviceId }).then(res=>{
            const resData = res.data;
            const map = resData.map(item => {
                const obj = {
                    describeName: item.label,
                    monitorDeviceType: item.value,
                    title: "timeValue"
                };
                return obj;
            });
            map.unshift({
                describeName: "全部日期",
                monitorDeviceType: "",
                title: "timeValue"
            });
            this.timeList = map;
        })
    },
    beforeClose() {
      this.dialogVisible = false;
    },
    closeEnlarge() {
      this.isEnlarge = false;
    },
    handleClose() {
      this.popData = {};
      this.visible = false;
    },
    onEdit(name) {
      this.presetName = name;
      this.addOrEdit = "编辑";
    },
    addReturn(row) {
      const that = this;
      const query = {
        alarmId: row.alarmId,
        type: "1"
      };
      dealRemarks(query).then(res => {
        if (res.data.isSuccess) that.$message.success(res.msg);
        else that.$message.error(res.msg);
        this.getDataList();
      });
    },
    addPoint() {
      this.$refs.inspectionRef.addPosInput = this.presetName;
      this.$refs.inspectionRef.addPosition();
      this.addOrEdit = "添加";
      this.presetName = "";
    },
    initCamera() {
      const that = this;
      that.disabled = true;
      const url =
        "/lenovo-visible/api/visible-equipment/sdk/rtmp/" +
        this.dataForm.monitorDeviceId;
      getAxiosData(url, {}).then(res => {
        that.playerOptions.streamAddr = res.data;
        that.backUPAddr = res.data
      });
    },
    cutOut(data) {
      if (data) {
        const index = data.indexOf("缺陷");
        if (index > -1) {
          data = data.substring(0, index);
        }
        return data;
      } else {
        return "更多";
      }
    },
    onClickDropdown(row, type, No) {
      const index = row._index;
      this.dataList[index].alarmLevelName = type;
      this.dataList[index].alarmLevel = No;
      let oldLevel;
      if (row.alarmLevel == "1") {
        oldLevel = "一般";
      } else if (row.alarmLevel == "2") {
        oldLevel = "严重";
      } else {
        oldLevel = "危急";
      }
      const query = {
        id: row.id,
        alarmLevel: No,
        oldLevel: oldLevel,
        newLevel: type,
        userName: this.$store.state.user.userName
      };
      getVLIght(query).then(
        res => {
          if (res.code !== 200) {
            this.dataList[index].alarmLevel = row.alarmLevel;
            this.dataList[index].alarmLevelName = row.alarmLevelName;
            return that.$message.error(res.msg);
          }
          that.$message.success(res.msg);
        },
        error => {
          this.dataList[index].alarmLevel = row.alarmLevel;
          this.dataList[index].alarmLevelName = row.alarmLevelName;
        }
      );
    },
    onSelect(item, index) {
      this[item.title] = item["describeName"];
      if (item.title == "titleTypeL") {
        this.dataForm.deviceType = item.monitorDeviceType;
        this.getDataList();
      } else if (item.title == "titleTypeR") {
        this.dataForm.alarmLevel = item.monitorDeviceType;
        this.getDataList();
      } else if (item.title == "titleType") {
        this.echartForm.source = item.monitorDeviceType;
        this.getEchasrts();
      } else if(item.title == 'timeValue'){
        this.clearRequest()
        this.pageIndexD = 1
        this.videoList = []
        this.getVideo(item['monitorDeviceType'])
      }
    },
    onChangeHis(data) {
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD");
        endTime = moment(data[1]).format("YYYY-MM-DD");
      }
      this.dataForm.startTime = startTime;
      this.dataForm.endTime = endTime;
      this.getDataList();
    },
    onChangeTime(data) {
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD");
        endTime = moment(data[1]).format("YYYY-MM-DD");
      }
      this.echartForm.startTime = startTime;
      this.echartForm.endTime = endTime;
      this.getEchasrts();
    },
    clickExcel() {
      const that = this;
      this.queryForm.monitorDeviceId = this.$route.query.monitorDeviceId;
      that.exportHandle();
    },
    getEchasrts() {
      getPosition().then(res => {
        let presetId = res.data[0].value;
        this.echartForm = {
          startTime: this.echartForm.startTime,
          endTime: this.echartForm.endTime,
          deviceType: "2",
          monitorDeviceId: this.$route.params.monitorDeviceId,
          presetIds: presetId
        };
        getVEcharts(this.echartForm).then(res => {
          this.echartData = res.data.itemDataList;
        });
      });
    },
    handleClose() {
      this.popData = {};
      this.visible = false;
    },
    onClose() {
      this.visibleSettingOption = false;
    },
    getInit() {
      let time = moment()
        .add(-1, "days")
        .format("YYYY-MM-DD");
      this.echartForm.startTime = `${time} 00:00:00`;
      this.echartForm.endTime = `${time} 23:59:59`;
    },
    getControl() {
      if (this.isControl == "1") {
        this.isControl = "2";
        this.endControl();
      } else if (this.isControl == "2" || this.isControl == "3") {
        this.isControl = "1";
      }
    },
    endControl() {
      if (this.isControl == "2") {
        let that = this;
        let num = 10;
        clearInterval(that.timeOut);
        that.timeOut = setInterval(function() {
          that.isControl = "3";
          let countDown = setInterval(function() {
            that.currentTime--;
            num--;
            if (num == 0) {
              clearInterval(countDown);
              that.isControl = "1";
            }
          }, 1000);
        }, 1000 * 60 * 5);
      }
    },
    getMonitorDeviceName() {
      let url = "/lenovo-device/api/device-monitor/device";
      let query = {
        monitorDeviceId: this.$route.query.monitorDeviceId
      };
      getAxiosData(url, query).then(res => {
        this.dataForm.monitorDeviceName = res.data.deviceName;
      });
    }
  },
  created() {
    this.dataForm.monitorDeviceId = this.$route.query.monitorDeviceId;
    this.getMonitorDeviceName();
    this.getDataList();
    this.initCamera();
    this.getEchasrts();
    this.initTime()
    this.getVideo()
  },
  mounted() {
    const that = this
    this.getInit();
    window.addEventListener("onmousemove", this.endControl());
    document.querySelector(".mainAside").style.height = "inherit";
    document.querySelector(".mainAside").style.minHeight = "100%";
    $(".contain_add").scroll(function () {
        let $this = $(this),
            viewH = $(this).height(),//可见高度
            contentH = $(this).get(0).scrollHeight,//内容高度
            scrollTop = $(this).scrollTop();//滚动高度
        console.log('viewH', viewH);
        console.log('contentH', contentH);
        console.log('scrollTop', scrollTop);
        $('.loading').css({'top': scrollTop+'px'})
        //if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
        console.log(scrollTop / (contentH - viewH))
        if (scrollTop / (contentH - viewH) >= 0.9) { //到达底部100px时,加载新内容
           if(!that.isRequest){
               that.pageIndexD++
               that.getVideo()
           }
        }
    })
  },
  beforeDestroy() {
    document.querySelector(".mainAside").style.height = "calc(100% - 80px)";
    document.querySelector(".mainAside").style.minHeight = "inherit";
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.mainAside {
  /*min-height: 100%;*/
}
.el-loading-text {
  color: #969696 !important;
}
.hidden{
  visibility: hidden;
}
.el-picker-panel {
  background-color: rgba(27, 59, 71, 0.7) !important;
  color: #fff !important;
  border: none !important;
  .el-picker-panel__body-wrapper {
    .el-picker-panel__body {
      .in-range {
        div {
          background-color: rgba(81, 89, 112, 0.7) !important;
        }
      }
    }
  }
}
  .timeSelect.dunoBtnTop .btnList{
    right: 0;
    top: 0;
    & .btn_main .btnItem{
      text-align: left;
    }
  }
.detailEnv {
  width: 100%;
  min-height: 100%;
  padding-bottom: 100px;
  .loading{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    &.zIndex{
      z-index: 100;
    }
  }
  ::-webkit-input-placeholder {
    /* WebKit browsers */
    color: white;
  }

  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: white;
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: white;
  }

  .el-input--small .el-input__inner {
    // background: #1a2f42;
    border: none;
    color: #333;
    height: 40px;
    border-radius: 0;
    font-size: 15px;
    width: 154px;
    float: right;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
  }
  .Main_contain {
    .contain.color {
      background: #132838 !important;
    }
    .content {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .main_add {
      position: absolute;
      width: 100%;
      height: 100%;
      .title_add {
        position: relative;
        top: -45px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .contain_add {
        padding: 13px;
        position: absolute;
        overflow-y: auto;
        text-align: left;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #112432;
        .videoList {
          margin-bottom: 10px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
  .monitor.child {
    .vjs-fluid {
      padding-top: 56%;
    }
  }
  .icon-xiala {
    /* width: 12px;
    height: 14px;*/
  }
  /*overflow-y: hidden;*/
  .el-input--small .el-input__inner {
    border-radius: 0;
    width: 100%;
  }
  .control_slider {
    width: 94%;
    position: absolute;
    height: 8%;
    top: calc(100% + 9%);
    left: 3%;
    .iconfont {
      color: white;
    }
  }
  .breadcrumb {
    margin-bottom: 20px;
  }
  .exportExcel {
    font-size: 16px;
  }
  .imgOrMv {
    width: 50%;
    height: 35px;
    position: relative;
    top: 2px;
  }
  .flexPos {
    .el-button {
      background: rgba(0, 0, 0, 0);
      border: none;
    }
  }
  .table_link {
    font-size: 16px;
    color: #5fafff !important;
    text-decoration: underline;
  }
  .table_select {
    cursor: pointer;
    // color: #1d1f26;
    color: #fff;
    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 30px;
      border-radius: 20px;
    }
    &.serious {
      span {
        background: #f4a723;
        color: #1d1f26;
      }
    }
    &.commonly {
      span {
        background: #5eb0fc;
        color: #1d1f26;
      }
    }
    &.danger {
      span {
        background: #d0011b;
        color: #1d1f26;
      }
    }
  }
  .btn_pre {
    padding: 10px 20px;
    cursor: pointer;
    border: none;
    border-radius: 20px;
    @media screen and (min-width: 3500px) {
      padding: 6px 12px;
    }
  }
  .content {
    display: flex;
    .left {
      width: 50%;
      &:first-child {
        margin-right: 10px;
      }
      &:last-child {
        margin-left: 10px;
      }
      &.nr {
        display: flex;
        flex-direction: column;
        padding-bottom: 3px;
        .item {
          background: #132838;
          display: flex;
          &:first-child {
            /*margin-bottom: 15px;*/
          }
          .camera_surveillanceDetail {
            width: 100%;
            text-align: center;
            .contain {
              position: relative;
              width: 100%;
              padding-bottom: 56%;
              background: black;
              .contain_img {
                position: absolute;
                width: 100%;
                height: 100%;
              }
              .monitor {
                position: absolute;
                width: 100% !important;
                top: 0;
                left: 0;
              }
            }
          }
          .control {
            position: relative;
            display: flex;
            margin-left: 3.4%;
            flex-direction: column;
            justify-content: center;
            /*margin-right: 15px;*/
            width: 25%;
            .controBtnContain {
              margin-bottom: 26%;
            }
            .inputGroup {
              display: flex;
              text-align: right;
              padding-left: 12px;
              .el-input el-input--small {
                margin-left: 10px;
              }
              .addPoint {
                margin-left: 9px;
                border-radius: 20px;
              }
            }
          }
        }
      }
    }
  }
  .middle_table {
    margin-top: 20px;
    width: 100%;
    min-height: 300px;
    .top {
      color: #ffffff;
      height: 40px;
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-end;
      .name {
        align-items: center;
        display: flex;
        flex: 1;
      }
      & > .select {
        display: flex;
        & > div {
          margin-right: 10px;
          .dunoBtnTop {
            width: 170px;
            position: relative;
            left: 10px;
            display: inline-flex;
            padding-bottom: 0;
            .btnList {
              top: inherit !important;
              // line-height: 30px;
              width: 160px;
              .title {
                // font-size: 16px;
                padding: 8px 20px;
              }
            }
          }
        }
      }
      .btn {
        display: flex;
        & > div {
          margin-left: 10px;
        }
        & > div:nth-child(2) {
          & > div {
            width: 140px;
            line-height: 40px;
            text-align: center;
            background-color: #192f41;
            cursor: pointer;
          }
        }
        .clickBtn {
          line-height: 40px;
          width: 139px;
          background-image: url(../../../assets/images/btn/moreBtn.png);
          text-align: center;
          font-size: 18px;
          color: #ffffff;
        }
        .dateChose {
          .el-date-editor {
            background-color: #192f41;
            border: none;
            .el-range-input {
              background-color: rgba(81, 89, 112, 0);
            }
            .el-range-separator {
              font-size: 20px;
              color: #fff;
            }
            .el-range-input {
              color: #fff;
            }
          }
          .el-range-editor--small.el-input__inner {
            height: 40px !important;
          }
          .el-range-editor--small .el-range__icon,
          .el-range-editor--small .el-range__close-icon {
            line-height: 35px;
          }
          .el-range-editor--small .el-range-input {
            font-size: 16px;
          }
        }
      }
    }
  }
  .historicalData {
    .top {
      color: #ffffff;
      height: 40px;
      margin-top: 20px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      & > div:first-child {
        font-size: 20px;
        line-height: 40px;
      }
      .btn {
        display: flex;
        justify-content: space-between;
        position: relative;
        & > div {
          margin-left: 10px;
          .dunoBtnTop {
            width: 145px;
            display: inline-flex;
            padding-bottom: 0;
            .btnList {
              top: inherit !important;
              width: 145px;
              .title {
                padding: 8px 20px;
              }
            }
          }
        }
        & > div:nth-child(5) {
          & > div {
            width: 140px;
            line-height: 40px;
            text-align: center;
            background-color: #192f41;
            cursor: pointer;
          }
        }
        .dateChose {
          .el-date-editor {
            background-color: #192f41;
            border: none;
            .el-range-input {
              background-color: rgba(81, 89, 112, 0);
            }
            .el-range-separator {
              font-size: 20px;
              color: #fff;
            }
            .el-range-input {
              color: #fff;
            }
          }
          .el-range-editor--small.el-input__inner {
            height: 40px !important;
          }
          .el-range-editor--small .el-range__icon,
          .el-range-editor--small .el-range__close-icon {
            line-height: 35px;
          }
          .el-range-editor--small .el-range-input {
            font-size: 16px;
          }
        }
      }
    }
    .con-chart {
      width: 100%;
      height: 340px;
      .chartBox {
        height: 340px;
        .charts {
          height: 340px;
        }
      }
    }
  }
  //-------------------表格样式
  .dunoMain {
    height: inherit;
  }
  .ivu-table {
    font-size: 16px;
  }
  .ivu-table th {
    color: #fff;
    border: none;
    height: 60px;
    background-color: #2d5980 !important;
    font-size: 18px;
    font-weight: normal;
  }
  .ivu-page {
    text-align: center;
    .ivu-page-total {
      display: none;
    }
    .ivu-page-item-jump-next:after,
    .ivu-page-item-jump-prev:after {
      color: white;
    }
    .ivu-page-next,
    .ivu-page-prev {
      background: transparent;
      display: none;
      border: none;
    }
    .ivu-page-item {
      background: transparent !important;
      border: none !important;
      min-width: 16px;
      height: 28px;
      a {
        color: white;
      }
    }
    .ivu-page-options {
      display: none;
    }
    .ivu-page-item-active {
      border-bottom: 1px solid #2d8cf0 !important;
      border-radius: 0;
      a {
        color: #2d8cf0;
      }
    }
  }
  .ivu-table-wrapper {
    tr {
      td {
        height: 48px;
      }
    }
    tr:nth-child(odd) {
      td {
        background: rgba(0, 0, 0, 0) !important;
      }
    }
    tr:nth-child(even) {
      td {
        background-color: #2a526c;
      }
    }
  }
  .ivu-select-dropdown {
    background: white !important;
  }
  .ivu-table-small td {
    background: black;
  }
  //------------------
  .controlTitle {
    overflow: hidden;
    color: #fff;
    margin-bottom: 10px;
    & > div {
      float: left;
    }
    & > div:first-child {
      font-size: 20px;
      width: 49.3%;
    }
    .isEqual{
      cursor: pointer;
      font-size: 14px;
      float: right;
      position: relative;
      top: 0px;
      border: 1px solid white;
      padding: 6px;
      border-radius: 4px;
    }
    .control {
      font-size: 18px;
      span {
        font-size: 14px;
        text-align: center;
        cursor: pointer;
        display: inline-block;
        width: 90px;
        line-height: 32px;
        background: #305e83;
        border-radius: 16px;
        margin-left: 10px;
      }
      i {
        color: #ffcc30;
        font-style: normal;
      }
    }
  }
}
.el-popup-parent--hidden {
  .el-select-dropdown {
    background: #fff !important;
    color: #333;
  }
  .el-select-dropdown__empty,
  .el-select-dropdown__item,
  .el-select-dropdown__item.selected {
    color: #333;
  }
}
</style>
