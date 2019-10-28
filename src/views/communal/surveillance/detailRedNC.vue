<template>
  <div class="detailRedN">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="controlTitle">
      <div>{{ dataForm.monitorDeviceName }}</div>
      <!--   <div v-if="isControl =='1'" class="control">
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
                  :isPic="isPic"
                  @mousemove.native="pointerPos($event)"
                  @mouseout.native="clearTimer()"
                  :monitorInfo="{ monitorDeviceId: dataForm.monitorDeviceId }"
                  paddingBottom="56%"
                  class="monitor child"
                  :autoplay="playerOptionsd.autoplay"
                  :streamAddr="playerOptionsd.streamAddr"
                  :showBtmOption="false"
                ></key-monitor>
                <span
                  v-show="overFlag"
                  class="aaaaaaaaaaaaa"
                  :style="'pointer-events: none;color:white;font-size:20px;position: absolute;left:'+(offsetX+30)+'px !important;top:'+(offsetY-20)+'px !important'"
                >{{ tepmNum }}</span>
              </div>
            </div>
          </div>
        </div>
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
      </div>
      <div class="middle_table">
        <div class="top not-print">
          <div class="name">历史信息记录</div>
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
              <duno-btn-top
                @on-select="selectDownloadType"
                class="dunoBtnTo"
                :isCheck="false"
                :dataList="downLoadList"
                title="导出表格/PDF"
                :showBtnList="false"
              ></duno-btn-top>
            </div>
            <!-- <div>
              <div @click="clickExcel" class="clickBtn">
                <i class="iconfont icon-daochu1"></i>
                导出表格
              </div>
            </div> -->
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
      <div class="historicalData">
        <div class="top not-print">
          <div>历史数据</div>
          <div class="btn">
            <!-- <div>
              <duno-btn-top
                @on-select="onSelect"
                class="dunoBtnTop"
                :isCheck="false"
                :dataList="typeList"
                :title="titleType"
                :showBtnList="false"
              ></duno-btn-top>
            </div>-->
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
        <div class="con-chart">
          <echarts :dataAllList="echartData" :title="echartTitle" gridOptionTop="120" />
        </div>
      </div>
    </div>
    <warning-setting @handleClose="onClose" :visibleOption="visibleSettingOption" />
    <wraning
      :discriminate="false"
      :hasSelect="true"
      :alarmLevel="alarmLevel"
      :visible="visible"
      warningID="20190711002"
      :popData="popData"
      :monitorUrl="popData.alarmFileAddress || ''"
      :judgeResult="popData.alarmContent || ''"
      :origin="popData.monitorDeviceId"
      :handleResult="popData.dealRecord || ''"
      @handleClose="handleClose"
    />
    <enlarge :isShow="isEnlarge" :srcData="srcData" @closeEnlarge="closeEnlarge" />
  </div>
</template>

<script>
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
import enlarge from "_c/duno-c/enlarge";
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
  name: "detailRedN",
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
    const that = this;
    return {
      isPic: false,
      typeId: -1,
      overFlag: false,
      offsetX: 0,
      offsetY: 0,
      tepmNum: 0,
      timer: false,
      addOrEdit: "添加",
      disabled: false,
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: "/lenovo-plan/api/task/result/list",
        exportURL: "/lenovo-plan/api/task/result/list/export"
      },
      titleTypeL: "全部数据类型",
      titleTypeR: "全部异常类型",
      isControl: "1",
      currentTime: 10,
      timeOut: null,
      isEnlarge: false,
      echartTitle: "",
      srcData: [],
      dataForm: {},
      queryForm: {},
      echartForm: {},
      echartData: [],
      value: "",
      alarmLevel: "",
      visible: false,
      visibleSettingOption: false,
      popData: {},
      downLoadList: [
        {
          describeName: "导出表格",
          monitorDeviceType: "1"
        },
        {
          describeName: "导出PDF",
          monitorDeviceType: "2"
        }
      ],
      columns: [
        {
          title: "时间",
          key: "executeTime",
          minWidth: 100,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let timeDay = params.row.executeTime.slice(5);
            return h("div", [
              h(
                "Tooltip",
                {
                  props: { placement: "top", content: timeDay, transfer: true },
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }
                },
                timeDay
              )
            ]);
          }
        },
        {
          title: "对象",
          key: "monitorDeviceName",
          minWidth: 180,
          align: "center",
          tooltip: true
        },
        {
          title: "部件/相别",
          key: "part",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "描述",
          key: "content",
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
            if (params.row.isAlarm == "1") {
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
            } else {
              newArr.push("/");
            }
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
        {
          title: "自动/手动",
          key: "sourceType",
          width: 120,
          align: "center",
          tooltip: true
        },
        {
          title: " ",
          key: "id",
          width: 220,
          align: "center",
          render: (h, params) => {
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
      presetName: "",
      allDataKind: [],
      allDataLevel: [],
      dataTime: "",
      dataBread: [{ name: "摄像头详情" }],
      picTurnTimer: null
    };
  },
  props: {
    deviceId: {
      type: [String, Number],
      default: "54"
    }
  },
  methods: {
    clearTimer() {
      clearInterval(this.timer);
      this.overFlag = false;
      this.timer = null;
      this.tepmNum = 0;
    },
    pointerPos(event) {
      const that = this;
      that.overFlag = true;
      // console.log('x:'+event.offsetX)
      // console.log('y:'+event.offsetY)
      if (that.isPic) {
        if (event.target.className != "cameraImg") {
          that.overFlag = false;
        }
      } else {
        if (event.target.className != "vjs-tech") {
          that.overFlag = false;
        }
      }
      that.offsetX = event.offsetX;
      that.offsetY = event.offsetY;
      if (!this.timer) {
        this.timer = setInterval(() => {
          let pos =
            0.1184210526315789 *
            document.querySelector(".keyMonitor ").offsetWidth;
          let x = that.offsetX - pos < 0 ? 0 : that.offsetX - pos;
          if (
            that.offsetX >
            document.querySelector(".keyMonitor ").offsetWidth - pos
          ) {
            x = document.querySelector(".keyMonitor ").offsetWidth - pos * 2;
          }
          if (this.isPic) {
            x = that.offsetX;
          }
          getAxiosData(
            "/lenovo-iir/device/temperature/get/location/" +
              this.dataForm.monitorDeviceId,
            {
              x: parseInt(x),
              y: that.offsetY,
              r: 1,
              pannelWidth: document.querySelector(".keyMonitor ").offsetWidth,
              pannelHeight: document.querySelector(".keyMonitor ").offsetHeight
            }
          ).then(res => {
            // console.log('data:'+res.data)
            that.tepmNum = res.data.data;
          });
        }, 200);
      }
    },
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
      });
      const urld =
        "/lenovo-iir/device/video/url/rtmp/" + this.dataForm.monitorDeviceId;
      getAxiosData(urld, {}).then(res => {
        that.playerOptionsd.streamAddr = res.data.data;
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
        startTime = moment(data[0]).format("YYYY-MM-DD 00:00:00");
        endTime = moment(data[1]).format("YYYY-MM-DD 23:59:59");
      }
      this.dataForm.startTime = startTime;
      this.dataForm.endTime = endTime;
      this.getDataList();
    },
    onChangeTime(data) {
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD 00:00:00");
        endTime = moment(data[1]).format("YYYY-MM-DD 23:59:59");
      }
      this.echartTitle =
        moment(data[0]).format("YYYY/MM/DD") +
        "-" +
        moment(data[1]).format("YYYY/MM/DD");
      this.echartForm.startTime = startTime;
      this.echartForm.endTime = endTime;
      this.getEchasrts();
    },
    selectDownloadType(item) {
      const that = this;
      that.dataForm.type = item.monitorDeviceType;
      that.dataForm.monitorDeviceId = this.$route.query.monitorDeviceId;
      that.queryForm = this.dataForm
      that.exportHandle();
    },
    // clickExcel() {
    //   const that = this;
    //   that.queryForm.monitorDeviceId = this.$route.query.monitorDeviceId;
    //   that.exportHandle();
    // },
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
    getEchasrts() {
      let query = {
        startTime: this.echartForm.startTime,
        endTime: this.echartForm.endTime,
        deviceType: "2",
        powerDeviceId: this.echartForm.sources,
        monitorDeviceId: this.$route.query.monitorDeviceId
      };
      getAxiosData("/lenovo-plan/api/plan/history", query).then(res => {
        this.echartData = res.data.dataList;
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
    picTurn() {
      const that = this;
      this.picTurnTimer = setInterval(() => {
        getAxiosData(
          `/lenovo-iir/device/video/new-frame/${that.dataForm.monitorDeviceId}`
        ).then(res => {
          that.$store.state.app.picSrc = res.data;
        });
      }, 200);
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
    this.dataForm.typeId = this.$route.query.typeId;
    this.getMonitorDeviceName();
    this.initCamera();
    this.getEchasrts();
    this.getDataList();
    if (this.dataForm.typeId == 3) {
      this.isPic = true;
      // this.picTurn();
    } else {
      this.isPic = false;
    }
  },
  mounted() {
    const that = this;
    this.getInit();
    this.getSelectType();
    this.getSelcetGrade();
    // this.getSelectPreset();
    window.addEventListener("onmousemove", this.endControl());
    document.querySelector(".mainAside").style.height = "inherit";
    document.querySelector(".mainAside").style.minHeight = "100%";
  },
  beforeDestroy() {
    clearInterval(this.picTurnTimer);
    this.$store.state.app.isPic = false;
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
.detailRedN {
  width: 100%;
  min-height: 100%;
  padding-bottom: 100px;
  .monitor.child {
    .vjs-fluid {
      padding-top: 56%;
    }
  }
  .icon-xiala {
    /*  width: 12px;
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
        .dunoBtnTop {
            width: 150px;
            position: relative;
            left: 10px;
            display: inline-flex;
            padding-bottom: 0;
            .btnList {
              top: inherit !important;
              width: 150px;
              .title {
                padding: 8px 20px;
              }
            }
          }
        // & > div:nth-child(2) {
        //   & > div {
        //     width: 140px;
        //     line-height: 40px;
        //     text-align: center;
        //     background-color: #192f41;
        //     cursor: pointer;
        //   }
        // }
        // & > div:last-child {
        //   font-size: 22px;
        // }
        // .clickBtn {
        //   line-height: 40px;
        //   width: 139px;
        //   background-image: url(../../../assets/images/btn/moreBtn.png);
        //   text-align: center;
        //   font-size: 18px;
        //   color: #ffffff;
        // }
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
.el-popper[x-placement^="bottom"],
.el-popper[x-placement^="top"] {
  background: #192f41;
  border: none;
}
</style>
