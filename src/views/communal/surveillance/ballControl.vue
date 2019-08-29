<template>
  <div class="ballControl">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="topTitle">
      <!-- <div>{{ dataForm.monitorDeviceName }}</div> -->
      <div>布控球</div>
      <div class="Battery">
        <pattery />
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
              <div class="controlTitle">
                <div v-if="isControl =='1'" class="controlT">
                  <span>云台控制中</span>
                  <span @click="getControl">获取控制权</span>
                </div>
                <div v-if="isControl =='2'" class="controlT">
                  <span>已获取云台控制</span>
                  <span @click="getControl">结束控制</span>
                </div>
                <div v-if="isControl =='3'" class="controlT">
                  <span>结束控制倒计时</span>
                  <i>{{ currentTime }} s</i>
                  <span @click="getControl">结束控制</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right nr contain">
          <div class="areaTitle">
            <span>区域设定</span>
          </div>
          <div class="iconControl" v-if="!isCamera">
            <i class="iconfont icon-shanchu"></i>
            <span>清空</span>
            <i class="iconfont icon-weibiaoti-"></i>
            <span @click="handleDraw">设定区域</span>
          </div>
          <div
            class="calibration"
            @mousedown="getFirstCode"
            @mouseup="getEndCode"
            @mousemove="getCircle"
          >
            <p v-if="isCamera">未设定区域</p>
            <p v-if="isCamera">请先调整左边视频再点击下方按钮拍照取图</p>
            <img v-if="!isCamera" :src="this.imgsrc" ref="image" alt />
            <div v-if="!isCamera" ref="box" id="boxImg"></div>
          </div>
          <div v-if="isCamera" class="buttonC">
            <span @click="handleCamare">拍照</span>
          </div>
          <div v-else class="buttonC">
            <span @click="changeCamare">重新拍摄</span>
            <span v-if="isMonitor" @click="handleStart">开始监控</span>
            <span v-else @click="handleEnd">停止监控</span>
          </div>
        </div>
      </div>
      <div class="middle_table">
        <div class="top not-print">
          <div class="name">历史监测记录</div>
          <div class="btn">
            <div class="dateChose">
              <el-date-picker
                v-model="dataTime"
                @change="changeDate"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
          </div>
        </div>
        <div class="video">
          <div>
            <div class="videoItem" v-for="(item,index) in videoList" :key="index">
              <key-monitor
                :monitorInfo="{ monitorDeviceId: dataForm.monitorDeviceId }"
                paddingBottom="56%"
                class="monitor"
                width="100%"
                :autoplay="playerOptions.autoplay"
                :streamAddr="playerOptions.streamAddr"
                :showBtmOption="false"
                :Initialization="true"
              ></key-monitor>
              <p>2019.8.29-2019.9.1数据</p>
            </div>
          </div>
          <el-pagination layout="prev, pager, next" :page-size="pageSizeVideo" :total="50"></el-pagination>
        </div>
      </div>
      <div class="middle_table">
        <div class="top not-print">
          <div class="name">异常记录</div>
          <div class="select">
            <div>
              <duno-btn-top
                style="visibility: hidden"
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
                style="visibility: hidden"
                @on-select="onSelect"
                :zIndex="1"
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
    </div>
    <wraning :popData="popData" :visible="visible" @handleClose="handleClose" />
    <Remarks :isShow="dialogVisible" :alarmId="alarmId" @beforeClose="beforeClose" />
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
import pattery from "_c/duno-m/pattery";
import mixinViewModule from "@/mixins/view-module";
import { DunoTablesTep } from "_c/duno-tables-tep";
import wraning from "_c/duno-j/warning";
import Remarks from "_c/duno-c/Remarks";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import moment from "moment";
import {
  getVLIght,
  getVType,
  getVGrade,
  getVPreset,
  getVEcharts,
  getPosition
} from "@/api/configuration/configuration.js";
export default {
  name: "ballControl",
  mixins: [mixinViewModule],
  components: {
    dunoBtnTop,
    KeyMonitor,
    Breadcrumb,
    controBtn,
    DunoTablesTep,
    echarts,
    wraning,
    enlarge,
    Remarks,
    pattery
  },
  data() {
    const that = this;
    return {
      addOrEdit: "添加",
      disabled: false,
      mixinViewModuleOptions: {
        getDataListURL: "/lenovo-plan/api/task/result/list",
        exportURL: "/lenovo-plan/api/task/result/list/export"
      },
      videoList: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      titleTypeL: "全部数据类型",
      titleTypeR: "全部异常类型",
      isControl: "1",
      currentTime: 10,
      isCamera: true,
      isMonitor: true,
      isDraw: false,
      isCanvas: true,
      clickFlage: 0,
      startPointX: null,
      endPointX: null,
      startPointY: null,
      endPointY: null,
      x0: null,
      y0: null,
      x1: null,
      y1: null,
      imgsrc: "",
      timeOut: null,
      srcData: [],
      pageSizeVideo: "8",
      echartTitle: "",
      alarmId: "",
      isEnlarge: false,
      dialogVisible: false,
      queryForm: {},
      dataForm: {},
      echartForm: {},
      echartData: [],
      typeList: [],
      alarmLevel: "",
      visible: false,
      popData: {},
      columns: [
        {
          title: "拍摄时间",
          key: "executeTime",
          minWidth: 100,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let timeDay = params.row.executeTime.slice(5);
            return h("div", timeDay);
          }
        },
        {
          title: "告警类型",
          key: "monitorDeviceName",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "处理记录",
          key: "part",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "处理时间",
          key: "content",
          minWidth: 90,
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
                  attrs: { src: params.row.pic },
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
                  attrs: { src: params.row.pic },
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
      playerOptions: {
        streamAddr: "",
        autoplay: true
      },
      presetName: "",
      allDataKind: [],
      allDataLevel: [],
      dataTime: "",
      dataBread: [{ name: "摄像头详情" }]
    };
  },
  props: {
    deviceId: {
      type: [String, Number],
      default: "54"
    }
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
    initCamera() {
      const that = this;
      that.disabled = true;
      const url =
        "/lenovo-visible/api/visible-equipment/sdk/rtmp/" +
        this.dataForm.monitorDeviceId;
      getAxiosData(url, {}).then(res => {
        that.playerOptions.streamAddr = res.data;
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
    },
    beforeClose() {
      this.dialogVisible = false;
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
        this.dataForm.dataType = item.monitorDeviceType;
        this.getDataList();
      } else if (item.title == "titleTypeR") {
        this.dataForm.alarmLevel = item.monitorDeviceType;
        this.getDataList();
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
    getSelectType() {
      getVType().then(res => {
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
      getVGrade().then(res => {
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
      getPosition().then(res => {
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
    clickExcel() {
      const that = this;
      that.queryForm.monitorDeviceId = this.$route.query.monitorDeviceId;
      that.exportHandle();
    },
    handleClose() {
      this.popData = {};
      this.visible = false;
    },
    getInit() {
      let time = moment()
        .add(-1, "days")
        .format("YYYY-MM-DD");
      this.echartForm.startTime = `${time} 00:00:00`;
      this.echartForm.endTime = `${time} 23:59:59`;
      this.echartTitle = moment()
        .add(-1, "days")
        .format("YYYY/MM/DD");
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
    },
    changeDate() {},
    handleCamare() {
      let url = "/lenovo-device/api/stream/snapshoot";
      let query = {
        rtmpUrl: this.streamAddr
      };
      postAxiosData(url, query).then(res => {
        this.shotData = res.data;
      });
      this.isCamera = false;
    },
    changeCamare() {
      this.isCamera = true;
    },
    handleDraw() {
      this.isDraw = true;
    },
    handleStart() {
      this.isDraw = false;
      this.isMonitor = false;
    },
    handleEnd() {
      this.isDraw = true;
      this.isMonitor = true;
    },
    clearCan() {
      this.imgsrc = "";
      this.$refs.box.style.width = null;
      this.$refs.box.style.height = null;
      this.isCalibrat = true;
      this.selectValue = "";
      this.textarea = "";
      this.props.lazyLoad = null;
    },
    getFirstCode(e) {
      if (this.clickFlage == 0 && this.isDraw) {
        this.$refs.box.style.width = null;
        this.$refs.box.style.height = null;
        this.startPointX = e.offsetX;
        this.startPointY = e.offsetY;
        this.$refs.box.style.left = this.startPointX + "px";
        this.$refs.box.style.top = this.startPointY + "px";
        this.clickFlage = 1;
      }
    },
    getEndCode(e) {
      if (this.clickFlage == 1) {
        this.endPointY = e.offsetY;
        this.endPointX = e.offsetX;
        this.clickFlage = 0;
      }
    },
    getCircle(e) {
      if (this.clickFlage == 1) {
        let width = Math.abs(e.offsetX - this.startPointX);
        let height = Math.abs(e.offsetY - this.startPointY);
        if (e.offsetY - this.startPointY <= 0) {
          this.$refs.box.style.top = e.offsetY + "px";
        } else {
          this.$refs.box.style.top = this.startPointY + "px";
        }
        if (e.offsetX - this.startPointX <= 0) {
          this.$refs.box.style.left = e.offsetX + "px";
        } else {
          this.$refs.box.style.left = this.startPointX + "px";
        }
        this.$refs.box.style.width = width + "px";
        this.$refs.box.style.height = height + "px";
      }
    }
  },
  created() {
    this.dataForm.monitorDeviceId = this.$route.query.monitorDeviceId;
    this.getMonitorDeviceName();
    this.getDataList();
    this.initCamera();
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
.ballControl {
  width: 100%;
  min-height: 100%;
  padding-bottom: 100px;
  .el-input--small .el-input__inner {
    border-radius: 5px;
    width: 100%;
    line-height: 40px;
    color: #fff;
    height: 40px;
    border: none;
    background-color: #192f41;
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
  .topTitle {
    overflow: hidden;
    line-height: 40px;
    & > div {
      color: #fff;
      float: left;
    }
    .Battery {
      margin-left: 44%;
    }
  }
  .content {
    display: flex;
    .left {
      width: 75%;
      &.nr {
        display: flex;
        flex-direction: column;
        padding-bottom: 3px;
        .item {
          background: #132838;
          display: flex;
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
            width: 25%;
            .controBtnContain {
              margin-bottom: 26%;
            }
            .controlTitle {
              overflow: hidden;
              color: #fff;
              margin-bottom: 10px;
              & > div {
                float: left;
              }
              & > div:first-child {
                font-size: 14px;
                width: 100%;
              }
              .controlT {
                font-size: 14px;
                color: #fff;
                text-align: center;
                & > span:last-child {
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
        }
      }
    }
    .right {
      width: 25%;
      padding: 20px;
      margin-left: 20px;
      background: #132838;
    }
    .areaTitle {
      color: #fff;
      display: flex;
      justify-content: space-between;
      i {
        cursor: pointer;
      }
      i:hover {
        color: #5fafff;
      }
    }
    .iconControl {
      float: right;
      color: #fff;
      font-size: 14px;
      i {
        padding-left: 20px;
      }
      span {
        cursor: pointer;
        padding-left: 5px;
      }
    }
    .calibration {
      margin-top: 10%;
      width: 100%;
      background-color: #000;
      padding-bottom: 56.25%;
      height: 0;
      position: relative;
      p {
        padding-top: 20%;
        color: #fff;
        font-size: 14px;
        text-align: center;
      }
      & > p:nth-child(2) {
        padding-top: 0;
      }
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        display: block;
      }
      //   .shotImg {
      //     width: 100%;
      //     height: 100%;
      //     img {
      //       width: 100%;
      //       height: 100%;
      //       display: block;
      //     }
      //   }
    }
    .buttonC {
      display: flex;
      justify-content: center;
      span {
        margin: 20px 10px 0;
        cursor: pointer;
        display: block;
        line-height: 40px;
        width: 139px;
        color: #fff;
        text-align: center;
        background-image: url(../../../assets/images/btn/moreBtn.png);
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
    .video {
      background: #132838;
      min-height: 400px;
      padding: 20px 0 20px 20px;
      & > div:first-child {
        overflow: hidden;
      }
      .videoItem {
        float: left;
        width: calc(20% - 20px);
        margin-right: 20px;
        margin-bottom: 20px;
        p {
          margin-top: 5px;
          color: #fff;
          text-align: center;
        }
      }
      .el-pagination {
        text-align: center;
      }
      .el-pager li {
        background: rgba(0, 0, 0, 0);
        color: #fff;
      }
      .el-pager li.active {
        color: #5fafff;
        border-bottom: 1px solid #2d8cf0;
      }
      .el-pagination .btn-prev,
      .el-pagination .btn-next {
        background-color: rgba(0, 0, 0, 0);
        color: #ffffff;
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
}
.el-popper[x-placement^="bottom"] {
  background: #192f41;
  border: none;
}
.el-popper[x-placement^="top"] {
  background: #192f41;
  border: none;
}
#boxImg {
  position: absolute;
  background: none;
  border: 1px solid red;
}
</style>
