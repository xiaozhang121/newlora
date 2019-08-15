<template>
  <div class="detailVRed">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="controlTitle">
      <div>{{ dataForm.monitorDeviceId }}</div>
      <!--<div v-if="isControl =='1'" class="control">
        云台控制中
        <span @click="getControl">获取控制权</span>
      </div>
      <div v-if="isControl =='2'" class="control">
        已获取云台控制
        <span @click="getControl">结束控制</span>
      </div>
      <div v-if="isControl =='3'" class="control">
        结束控制倒计时
        <i>{{ currentTime }} s</i>
        <span @click="getControl">结束控制</span>
      </div>-->
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
                  class="monitor"
                  :autoplay="playerOptions.autoplay"
                  :streamAddr="playerOptions.streamAddr"
                  :showBtmOption="false"
                  :Initialization="true"
                ></key-monitor>
              </div>
            </div>
            <div class="control">
              <div class="controBtnContain">
                <contro-btn
                  :disabledOption="disabled"
                  ref="controBtnRef"
                  :deviceId="dataForm.monitorDeviceId"
                />
              </div>
              <div class="inputGroup">
                <el-input v-model="presetName" placeholder="添加预置位名称"></el-input>
                <el-button class="addPoint" @click.native="addPoint" type="success">{{ addOrEdit }}</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="right nr contain">
          <inspection @on-edit="onEdit" ref="inspectionRef" :deviceId="dataForm.monitorDeviceId"></inspection>
        </div>
      </div>
      <div class="content" style="margin-top: 15px; position: relative">
        <div class="left nr" style="position: absolute;">
          <div
            class="item"
            style="background: linear-gradient(to right, transparent 100%, #132838 0%);"
          >
            <div class="camera_surveillanceDetail">
              <div class="contain">
                <key-monitor
                  :monitorInfo="{ monitorDeviceId: dataForm.monitorDeviceId }"
                  paddingBottom="56%"
                  class="monitor"
                  :autoplay="playerOptionsd.autoplay"
                  :streamAddr="playerOptionsd.streamAddr"
                  :showBtmOption="false"
                ></key-monitor>
              </div>
            </div>
          </div>
        </div>
        <div class="right nr contain contain_nr_out">
          <div class="main">
            <div class="top not-print">
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
              </div>
            </div>
            <div class="contain_nr">
              <echarts :dataAllList="echartData" />
            </div>
          </div>
        </div>
      </div>
      <div class="middle_table">
        <div class="top not-print">
          <div class="name">历史信息记录</div>
          <div class="select">
            <div>
              <duno-btn-top
                @on-select="onSelect"
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
                class="dunoBtnTop"
                :isCheck="false"
                :dataList="allDataLevel"
                :title="titleTypeR"
                :showBtnList="false"
              ></duno-btn-top>
            </div>
          </div>
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
            <div style="visibility: hidden">
              <div class="exportExcel">
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
          :isShowPage="false"
          :showSizer="true"
          @on-select="dataListSelectionChangeHandle"
          @clickPage="pageCurrentChangeHandle"
          @on-page-size-change="pageSizeChangeHandle"
        />
      </div>
    </div>
    <warning-setting @handleClose="onClose" :visibleOption="visibleSettingOption" />
    <wraning :popData="popData" :visible="visible" @handleClose="handleClose" />
    <enlarge :isShow="isEnlarge" :srcData="srcData" @closeEnlarge="closeEnlarge" />
  </div>
</template>

<script>
import enlarge from "_c/duno-c/enlarge";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import echarts from "_c/duno-c/echarts";
import controBtn from "_c/duno-m/controBtn";
import mixinViewModule from "@/mixins/view-module";
import inspection from "_c/duno-m/inspection";
import { DunoTablesTep } from "_c/duno-tables-tep";
import warningSetting from "_c/duno-j/warningSetting";
import wraning from "_c/duno-j/warning";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import moment from "moment";
import {
  getRedLIght,
  getRedType,
  getRedGrade,
  getRedPreset,
  getRedEcharts,
  getPosition
} from "@/api/configuration/configuration.js";
import { setInterval } from "timers";
export default {
  name: "detailVRed",
  mixins: [mixinViewModule],
  components: {
    dunoBtnTop,
    KeyMonitor,
    Breadcrumb,
    controBtn,
    inspection,
    DunoTablesTep,
    echarts,
    warningSetting,
    wraning,
    enlarge
  },
  data() {
    return {
      addOrEdit: "添加",
      disabled: false,
      isControl: "1",
      currentTime: 10,
      timeOut: null,
      srcData: [],
      playerOptions: {
        streamAddr: "",
        autoplay: true
      },
      playerOptionsd: {
        streamAddr: "",
        autoplay: true
      },
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: "/lenovo-alarm/api/alarm/history",
        exportURL: "/lenovo-alarm/api/alarm/history/export"
      },
      titleType: "选择预置位",
      titleTypeL: "全部数据类型",
      titleTypeR: "全部异常类型",
      dataForm: {},
      echartForm: {},
      echartData: [],
      typeList: [],
      value: "",
      alarmLevel: "",
      isEnlarge: false,
      visible: false,
      visibleSettingOption: false,
      popData: {},
      columns: [
        {
          title: "时间",
          key: "alarmTime",
          minWidth: 100,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let timeDay = params.row.alarmTime.slice(5);
            return h("div", timeDay);
          }
        },
        {
          title: "对象",
          key: "mainDevice",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "部件/相别",
          key: "powerDeviceName",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "描述",
          key: "areaName",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "缺陷等级",
          key: "alarmLevelName",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            const that = this;
            let newArr = [];
            newArr.push(
              h(
                "i-dropdown",
                {
                  props: { trigger: "click", placement: "bottom-start" },
                  style: { marginLeft: "5px" },
                  on: {
                    "on-click": value => {
                      console.log(value);
                    }
                  }
                },
                [
                  h("div", { class: { member_operate_div: true } }, [
                    h(
                      "div",
                      {
                        class: {
                          table_select: true,
                          serious: params.row.alarmLevel === "2",
                          commonly: params.row.alarmLevel === "1",
                          danger: params.row.alarmLevel === "3"
                        }
                      },
                      [
                        h("span", this.cutOut(params.row.alarmLevelName), {
                          class: { member_operate_div: true }
                        }),
                        h("i", {
                          style: { marginLeft: "5px" },
                          class: { "iconfont icon-xiala": true }
                        })
                      ]
                    )
                  ]),
                  h("i-dropdownMenu", { slot: "list" }, [
                    h("i-dropdownItem", {}, [
                      h(
                        "div",
                        {
                          class: { alarmLevel: true },
                          on: {
                            click: () => {
                              that.onClickDropdown(params.row, "一般", "1");
                            }
                          }
                        },
                        "一般"
                      )
                    ]),
                    h("i-dropdownItem", {}, [
                      h(
                        "div",
                        {
                          class: { alarmLevel: true },
                          on: {
                            click: () => {
                              that.onClickDropdown(params.row, "严重", "2");
                            }
                          }
                        },
                        "严重"
                      )
                    ]),
                    h("i-dropdownItem", {}, [
                      h(
                        "div",
                        {
                          class: { alarmLevel: true },
                          on: {
                            click: () => {
                              that.onClickDropdown(params.row, "危急", "3");
                            }
                          }
                        },
                        "危急"
                      )
                    ])
                  ])
                ]
              )
            );
            return h("div", newArr);
          }
        },
        {
          title: "数据",
          key: "alarmValue",
          minWidth: 120,
          align: "center",
          tooltip: true
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
        // {
        //   title: "自动/手动",
        //   key: "sourceType",
        //   width: 120,
        //   align: "center",
        //   tooltip: true
        // },
        {
          title: " ",
          key: "id",
          width: 90,
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
                      that.handleNotes = [];
                      that.handleNotes.push({
                        dealTime: params.row.dealTime,
                        dealType: params.row.dealRecord
                      });
                      that.alarmType = params.row.alarmType;
                      that.popData = params.row;
                      that.alarmLevel = params.row.alarmLevel;
                      that.visible = true;
                      that.$forceUpdate();
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
      presetName: "",
      allDataKind: [],
      allDataLevel: [],
      dataTime: "",
      dataBread: [{ name: "摄像头详情" }]
    };
  },
  methods: {
    closeEnlarge() {
      this.isEnlarge = false;
    },
    onEdit(name) {
      this.presetName = name;
      this.addOrEdit = "编辑";
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
        "/lenovo-iir/device/visible/url/rtmp/" + this.dataForm.monitorDeviceId;
      getAxiosData(url, {}).then(res => {
        that.playerOptions.streamAddr = res.data.data;
        that.$nextTick(() => {
          setTimeout(() => {
            this.$refs.controBtnRef.viewCamera(5, false).then(res => {
              setTimeout(() => {
                this.$refs.controBtnRef.viewCamera(5, true).then(res => {
                  that.disabled = false;
                });
              }, 5000);
            });
          }, 500);
        });
      });
      const urld =
        "/lenovo-iir/device/video/url/rtmp/" + this.dataForm.monitorDeviceId;
      getAxiosData(urld, {}).then(res => {
        that.playerOptionsd.sources[0].src = res.data.data;
        that.$forceUpdate();
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
      const query = {
        id: row.id,
        alarmLevel: No
      };
      getRedLIght(query).then(
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
        startTime = moment(data[0]).format("YYYY-MM-DD HH:mm:ss");
        endTime = moment(data[1]).format("YYYY-MM-DD HH:mm:ss");
      }
      this.echartForm.startTime = startTime;
      this.echartForm.endTime = endTime;
      this.getEchasrts();
    },
    clickExcel() {
      const that = this;
      that.exportHandle();
    },
    getSelectType() {
      getRedType().then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleTypeL"
          };
          return obj;
        });
        map.unshift({
          describeName: "所有数据类型",
          monitorDeviceType: "",
          title: "titleTypeL"
        });
        this.allDataKind = map;
      });
    },
    getSelcetGrade() {
      getRedGrade().then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleTypeR"
          };
          return obj;
        });
        map.unshift({
          describeName: "所有异常等级",
          monitorDeviceType: "",
          title: "titleTypeR"
        });
        this.allDataLevel = map;
      });
    },
    getSelectPreset() {
      getRedPreset().then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleTypeR"
          };
          return obj;
        });
        this.typeList = map;
      });
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
        getRedEcharts(this.echartForm).then(res => {
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
    }
  },
  created() {
    this.dataForm.monitorDeviceId = this.$route.query.monitorDeviceId;
    this.initCamera();
    this.getEchasrts();
  },
  mounted() {
    this.getInit();
    this.getSelectType();
    this.getSelcetGrade();
    this.getSelectPreset();
    window.addEventListener("onmousemove", this.endControl());
    document.querySelector(".mainAside").style.height = "inherit";
    document.querySelector(".mainAside").style.minHeight = "100%";
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
.detailVRed {
  width: 100%;
  min-height: 100%;
  overflow-y: hidden;
  .icon-xiala {
    /* width: 12px;
    height: 15px;*/
  }
  .echartsData {
    background: transparent;
  }
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
  .content {
    display: flex;
    .left {
      width: 75%;
      &.nr {
        display: flex;
        flex-direction: column;
        .item {
          background: linear-gradient(to right, transparent 69.5%, #132838 0%);
          display: flex;
          &:first-child {
            /*margin-bottom: 15px;*/
          }
          .camera_surveillanceDetail {
            width: 68%;
            .contain {
              position: relative;
              width: 100%;
              padding-bottom: 56%;
              background: black;
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
    .right {
      width: 25%;
      background: #132838;
      .top {
        color: #ffffff;
        height: 40px;
        margin-bottom: 10px;
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
  }
  .middle_table {
    margin-top: 20px;
    margin-bottom: 96px;
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
              width: 160px;
              .title {
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
        & > div:last-child {
          font-size: 22px;
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
  .contain_nr_out {
    margin-left: 52.1%;
    padding-bottom: 28.6%;
    width: 48% !important;
    position: relative;
    background: linear-gradient(transparent 10%, #132838 0%) !important;
    .main {
      position: absolute;
      width: 100%;
      height: 100%;
      .contain_nr {
        // background: #132838;
        position: absolute;
        left: 0;
        top: 50px;
        width: 100%;
        height: 400px;
        .chartBox {
          height: 400px;
          .charts {
            height: 400px;
          }
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
  .el-popper[x-placement^="bottom"] .popper__arrow {
    display: none;
  }
  .controlTitle {
    overflow: hidden;
    color: #fff;
    margin-bottom: 10px;
    & > div {
      float: left;
    }
    & > div:first-child {
      font-size: 20px;
      width: 52%;
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
</style>
