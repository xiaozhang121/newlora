<template>
  <div class="analysis-detail-record">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top not-print">
      <div>24小时监测记录</div>
      <div class="btn"  style="width: 740px">
        <div>
          <!--<el-date-picker v-model="chosenDate" type="date" placeholder="全部日期"></el-date-picker>-->
          <duno-btn-top
            ref="btnTopRef"
            :showBtnList="false"
            :dataList="regionList"
            :title="titleTypeL"
            :keyChange="true"
            @on-active="timeHandle"
          ></duno-btn-top>
        </div>
        <div style="width: 540px">
          <duno-btn-top
            ref="btnTopRefD"
            class="btnTopRefD"
            :showBtnList="false"
            :dataList="typeList"
            :title="titleTypeR"
            style="width: 540px"
            @on-active="deviceHandle"
          ></duno-btn-top>
        </div>
        <!--     <div class="dateChose">
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
        </div>-->
      </div>
    </div>
    <duno-main class="dunoMain">
      <div v-for="(item, index) in sevenValue" :key="index" class="record_item">
        <div class="title">{{ item['date'] }}&nbsp;&nbsp;{{diffTime(item['date'])}}</div>
        <div class="monitorContain">
          <div
            class="monitorItem"
            :class="{marginRight: (i+1)%4 != 0}"
            v-for="(nr, i) in item['data']"
            :key="i"
          >
            <key-monitor
              class="monitorRecord"
              :showBtmOption="true"
              :noButton="false"
              configType="2"
              :imgAdress="nr['pic']"
              :monitorInfo="nr"
              :pushCamera="false"
              :isRecord="false"
              :streamAddr="nr['streamAddr']"
              :kilovolt="nr['monitorDeviceName']"
              :patrol="nr['monitorDeviceId']"
            />
          </div>
          <div style="clear: both"></div>
        </div>
      </div>
    </duno-main>
    <warning-setting @handleClose="onClose" :visibleOption="visibleSettingOption" />
    <wraning :popData="popData" :visible="visible" @handleClose="handleClose" />
    <Remarks :isShow="dialogVisible" :alarmId="alarmId" @beforeClose="beforeClose" />
    <!-- <div class="remarks">
      <el-dialog
        title="备注"
        :center="true"
        top="20vh"
        :visible.sync="dialogVisible"
        :modal="false"
        width="500px"
        :before-close="beforeClose"
      >
        <el-input
          type="textarea"
          placeholder="请输入备注内容"
          :autosize="{ minRows: 3}"
          v-model="textarea"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <button-custom class="button" @click.native="closeRemarks" title="取消" />
          <button-custom class="button" @click="clickRemarks" title="确定" />
        </span>
      </el-dialog>
    </div>-->
  </div>
</template>

<script>
import { getMonitorSelect } from "@/api/currency/currency.js";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import dunoMain from "_c/duno-m/duno-main";
import moment from "moment";
import buttonCustom from "_c/duno-m/buttonCustom";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import warningSetting from "_c/duno-j/warningSetting";
import wraning from "_c/duno-j/warning";
import mixinViewModule from "@/mixins/view-module";
import { DunoTablesTep } from "_c/duno-tables-tep";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import {
  getTypeData,
  getRegionData,
  dealRemarks
} from "@/api/configuration/configuration.js";
export default {
  name: "abnormalInfo",
  mixins: [mixinViewModule],
  components: {
    Breadcrumb,
    dunoBtnTop,
    KeyMonitor,
    dunoMain,
    DunoTablesTep,
    warningSetting,
    wraning,
    buttonCustom
  },
  data() {
    const that = this;
    return {
      chosenDate: "",
      demoList: [{}, {}, {}, {}, {}, {}],
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: "/lenovo-alarm/api/security/list",
        exportURL: "/lenovo-alarm/api/security/history/export"
      },
      handleNotes: [],
      alarmType: "",
      visibleSettingOption: false,
      visible: false,
      selectInfo: "更多",
      serious: false,
      commonly: false,
      danger: false,
      dialogVisible: false,
      value: "",
      alarmId: "",
      titleTypeL: "全部日期",
      titleTypeR: "全部摄像头",
      dataBread: [
        { path: "/realEnv/list", name: "操作中台" },
        { path: "/environmental/list", name: "现场安全管控" },
        { path: "", name: "24小时监测记录" }
      ],
      columns: [
        {
          title: "拍摄时间",
          key: "alarmTime",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let timeDay = params.row.alarmTime.slice(5);
            return h("div", timeDay);
          }
        },
        {
          title: "告警类型",
          key: "alarmDetailType",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "拍摄来源",
          key: "monitorDeviceName",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h(
                "a",
                {
                  class: "table_link",
                  props: { type: "text" },
                  on: {
                    click: () => {
                      this.getJump(params.row);
                      //   console.log("摄像头ID：", params.row.monitorDeviceId);
                    }
                  }
                },
                params.row.monitorDeviceName
              )
            ]);
            return h("div", { class: { member_operate_div: true } }, newArr);
          }
        },
        {
          title: "处理记录",
          key: "dealType",
          minWidth: 120,
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
          key: "fileType",
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
                  draggable: false
                })
              ]);
            } else if (params.row.fileType == "2") {
              newArr.push([
                h("video", {
                  class: "imgOrMv",
                  attrs: { src: params.row.alarmFileAddress },
                  draggable: false
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
                      background: "#305e83!important",
                      background: "#979797",
                      color: "#767676"
                    },
                    props: { type: "text" },
                    on: {
                      click: () => {
                        console.log(111);
                      }
                    }
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
          width: 90,
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
      typeList: [],
      regionList: [],
      statusList: [],
      popData: {},
      clcikQueryData: {},
      sevenDates: "",
      sevenIds: "",
      isBack: true,
      dataList: [],
      sevenValue: [],
      count: 1
    };
  },
  watch: {},
  created() {
    this.sevenData();
    this.getRegion();
    this.getType();
  },
  methods: {
    sevenRIds() {
      let now = this.sevenIds;
      let data = now.split(",");
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < this.typeList.length; j++) {
          if (data[i] == this.typeList[j]["describeName"]) {
            arr.push(this.typeList[j]["monitorDeviceId"]);
            break;
          }
        }
      }
      return arr.join(",");
    },
    timeHandle(arr) {
      let data = this.deviceShowHandle(arr);
      this.sevenDates = data.join(",");
      this.count++;
      if (this.count > 3) this.sevenData();
    },
    deviceHandle(arr) {
      let data = this.deviceShowHandle(arr, true);
      this.sevenIds = data.join(",");
      this.count++;
      if (this.count > 3) this.getRegion(true);
    },
    sevenData() {
      const that = this;
      if (this.isBack) {
        this.isBack = false;
        getAxiosData("/lenovo-device/device/video/record/videos/seven-days", {
          date: this.sevenDates,
          monitorDeviceId: this.sevenRIds()
        }).then(res => {
          this.sevenValue = res.data;
          let data = res.data;
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i]["data"].length; j++) {
              postAxiosData("/lenovo-device/device/video/record/video/pic", {
                positionIndex: i + "," + j,
                videoPath: data[i]["data"][j]["streamAddr"]
              }).then(res => {
                let info = res.data;
                that.$set(
                  that.sevenValue[info["positionIndex"].split(",")[0]]["data"][
                    info["positionIndex"].split(",")[1]
                  ],
                  "pic",
                  info["pic"]
                );
                that.$forceUpdate();
              });
            }
          }
          this.isBack = true;
          this.count++;
        });
      }
    },
    deviceShowHandle(arr, flag) {
      const that = this;
      let target = arr.filter(item => {
        return item["isActive"] == true;
      });
      let data = [];
      if (!flag) {
        target.forEach(item => {
          data.push(item["monitorDeviceId"]);
        });
      } else {
        target.forEach(item => {
          data.push(item["describeName"]);
        });
      }

      return data;
    },
    diffTime(time) {
      let date = "";
      if (time.indexOf("年") > -1) {
        date = time.replace(/年|月/g, "-");
        date = date.replace(/日/g, "");
      } else {
        date = time;
      }
      let diff = moment().diff(date, "days");
      if (diff == 0) {
        return "(今天)";
      } else if (diff == 1) {
        return "(昨天)";
      } else if (diff == 2) {
        return "(前天)";
      } else {
        return "(" + diff + "天前)";
      }
    },
    onClose() {
      this.visibleSettingOption = false;
    },
    showSetting() {
      this.visibleSettingOption = true;
    },
    onSelect(item, index) {
      this[item.title] = item["describeName"];
      if (item.title == "titleTypeL") {
        this.clcikQueryData.areaId = item.monitorDeviceType;
      } else if (item.title == "titleTypeR") {
        this.clcikQueryData.source = item.monitorDeviceType;
      }
      this.clickQuery(this.clcikQueryData);
    },
    onChangeTime(data) {
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD");
        endTime = moment(data[1]).format("YYYY-MM-DD");
      }
      this.clcikQueryData.startTime = startTime;
      this.clcikQueryData.endTime = endTime;
      this.clickQuery(this.clcikQueryData);
    },
    handleClose() {
      this.popData = {};
      this.visible = false;
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
    clickExcel() {
      const that = this;
      that.exportHandle();
    },
    getRegion(flag) {
      const that = this;
      getAxiosData("/lenovo-device/device/video/record/date/select-list", {
        monitorDeviceId: this.sevenRIds()
      }).then(res => {
        const resData = res.data;
        let arr = [];
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            monitorDeviceId: item.value,
            isActive: true,
            title: "titleTypeL"
          };
          arr.push(obj["monitorDeviceId"]);
          return obj;
        });
        this.$refs.btnTopRef.checkedCities = arr;
        this.$refs.btnTopRef.checkAll = true;
        this.sevenDates = arr.join(",");
        this.regionList = map;
        if (flag) this.sevenData();
      });
    },
    getType() {
      const that = this;
      getMonitorSelect({
        flag: 1,
        configType: "3",
        userId: this.$store.state.user.userId
      }).then(res => {
        if (res.data) {
          // let data = res.data;
          /*   data = data.filter(item => {
                    return item["isSelected"] == true || item["isSelected"] == 1;
                });*/
          /* if (data.length) {
                    let arr = [];
                    data.forEach(item => {
                        if (item["monitorDeviceId"] != null)
                            arr.push(item["monitorDeviceId"]);
                    });
                    that.$nextTick(()=> {
                        that.$refs.btnTopRef.checkedCities = arr
                    })
                    // that.valueSelect = arr;
                    // that.getCameraInfo(data)
                } else {
                    that.$nextTick(()=>{
                        that.$refs.btnTopRef.checkedCities = []
                    })
                    // that.valueSelect = [];
                }*/
          let dataB = res.data;
          let arr = [];
          dataB.map(item => {
            /* if(item['isSelected'] == true || item["isSelected"] == 1)
                        item['isActive'] = true*/
            item["describeName"] = item["monitorDeviceName"];
            item["isActive"] = true;
            item["title"] = "titleTypeR";
            arr.push(item["describeName"]);
          });
          that.$refs.btnTopRefD.checkedCities = arr;
          that.$refs.btnTopRefD.checkAll = true;
          that.sevenIds = arr.join(",");
          that.typeList = dataB;
        }
      });
    },
    getJump(row) {
      let monitorDeviceId =
        "monitorDeviceId" in row && row.monitorDeviceId
          ? row.monitorDeviceId
          : row.monitorDevice[0]["monitorDeviceId"];
      getAxiosData("/lenovo-device/api/preset/type", {
        monitorDeviceId: monitorDeviceId
      }).then(res => {
        let supportPreset = res.data["supportPreset"];
        let monitorDeviceType = res.data["monitorDeviceType"];
        if (monitorDeviceType == 1) {
          if (supportPreset) {
            this.$router.push({
              path: "/surveillancePath/detailLight",
              query: {
                monitorDeviceId: monitorDeviceId
              }
            });
          } else {
            this.$router.push({
              path: "/surveillancePath/detailLightN",
              query: {
                monitorDeviceId: monitorDeviceId
              }
            });
          }
        } else if (monitorDeviceType == 2) {
          this.$router.push({
            path: "/surveillancePath/detailRedN",
            query: {
              monitorDeviceId: monitorDeviceId,
              typeId: res.data["typeId"]
            }
          });
        } else if (monitorDeviceType == 3) {
          this.$router.push({
            path: "/surveillancePath/detailEnv",
            query: {
              monitorDeviceId: monitorDeviceId
            }
          });
        }
      });
      /* if (row.monitorDeviceType == "1") {
        this.$router.push({
          path: "/surveillancePath/detailLight",
          query: {
            monitorDeviceId: row.monitorDeviceId
          }
        });
      } else if (row.monitorDeviceType == "2") {
        this.$router.push({
          path: "/surveillancePath/detailRed",
          query: {
            monitorDeviceId: row.monitorDeviceId
          }
        });
      }*/
    },
    beforeClose() {
      this.dialogVisible = false;
    }
    // clickRemarks() {
    //   const that = this;
    //   that.isShowRemarks = false;
    //   let query = {
    //     alarmId: that.remarkData.alarmId,
    //     type: "2",
    //     content: that.textarea
    //   };
    //   dealRemarks(query).then(res => {
    //     that.textarea = "";
    //     if (res.data.isSuccess) that.$message.success(res.msg);
    //     else that.$message.error(res.msg);
    //     this.$emit("handleListData");
    //   });
    // }
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.analysis-detail-record {
  width: 100%;
  .btnTopRefD{
    .btnList{
      width: 540px !important;
    }
  }
  .keyMonitor .camera .explain .text {
    display: flex;
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
    background: #1a2f42;
    border: none;
    color: white;
    height: 40px;
    border-radius: 0;
    font-size: 15px;
    width: 154px;
    float: right;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 156px;
  }
  .dunoMain_nr {
    border: 2px solid #464d51;
  }
  .record_item {
    &:first-child {
      margin-top: 13px;
    }
    .title {
      color: white;
      padding: 0 20px;
      position: relative;
      top: 10px;
    }
    .monitorContain {
      /*background: rgba(20, 40, 56, 0.8);*/
      padding: 20px;
      padding-bottom: 0;
      display: flex;
      /*justify-content: space-between;*/
    }
    .monitorItem {
      width: 24%;
      float: left;
      &.marginRight {
        margin-right: 1%;
      }
      .monitorRecord {
        width: 100% !important;
        height: 100%;
        margin: 0 0px 55px 0;
      }
    }
  }
  .icon-xiala {
    /*width: 13px;
    height: 16px;*/
    right: 20px;
    top: 10px;
  }
  //-------------------表格样式
  .dunoMain {
    height: inherit;
    margin-bottom: 28px;
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
    @media screen and (min-width: 3500px) {
      font-size: 15px;
      height: 50px;
    }
  }
  .ivu-table-cell {
    @media screen and (min-width: 3500px) {
      padding-left: 10px;
      padding-right: 10px;
    }
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
        height: 60px;
        @media screen and (min-width: 3500px) {
          height: 50px;
          font-size: 13px;
        }
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
  .el-button--text {
    border-color: transparent !important;
    background: transparent !important;
  }
  .flexPos {
    display: flex;
    align-items: center;
  }
  .imgOrMv {
    width: 60%;
    height: 45px;
    position: relative;
    top: 2px;
  }
  .table_link {
    font-size: 16px;
    text-align: center;
    color: #5fafff !important;
    text-decoration: underline;
    @media screen and (min-width: 3500px) {
      font-size: 13px;
    }
  }
  .table_abnormalInfo {
    padding: 36px 18px;
  }
  .table_select {
    cursor: pointer;
    color: #1d1f26;
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
  .btn_pre {
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 20px;
    @media screen and (min-width: 3500px) {
      padding: 6px 12px;
    }
  }
  .top {
    color: #ffffff;
    height: 40px;
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    @media screen and (min-width: 3500px) {
      height: 35px;
    }
    & > div:first-child {
      font-size: 20px;
      line-height: 40px;
      @media screen and (min-width: 3500px) {
        font-size: 16px;
        line-height: 35px;
      }
    }
    .btn {
      display: flex;
      justify-content: space-between;
      & > div {
        margin-left: 10px;
        .dunoBtnTop {
          width: 180px;
          display: inline-flex;
          padding-bottom: 0;
          .btnList {
            top: inherit !important;
            width: 180px;
            .title {
              padding: 8px 20px;
            }
          }
          @media screen and (min-width: 3500px) {
            width: 170px;
            .btnList {
              width: 170px;
              .title {
                font-size: 14px;
                height: 35px;
              }
            }
          }
        }
      }
      & > div:nth-child(2) {
        .dunoBtnTop {
          @media screen and (min-width: 3500px) {
            width: 290px;
            .btnList {
              width: 290px;
              .title {
                font-size: 14px;
                height: 35px;
              }
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
        cursor: pointer;
        color: #ffffff;
        @media screen and (min-width: 3500px) {
          background-size: 100% 100%;
          font-size: 14px;
          line-height: 34px;
          width: 120px;
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
            @media screen and (min-width: 3500px) {
              font-size: 14px;
            }
          }
          .el-range-input {
            color: #fff;
          }
        }
        .el-range-editor--small.el-input__inner {
          height: 40px !important;
          @media screen and (min-width: 3500px) {
            height: 35px !important;
            width: 250px;
          }
        }
        .el-range-editor--small .el-range__icon,
        .el-range-editor--small .el-range__close-icon {
          line-height: 35px;
        }
        .el-range-editor--small .el-range-input {
          font-size: 16px;
          @media screen and (min-width: 3500px) {
            font-size: 14px;
          }
        }
      }
    }
  }
  .icon-xiala {
    color: white;
    font-size: 13px;
  }
}
.setting {
  cursor: pointer;
  i {
    font-size: 30px;
    padding-right: 5px;
  }
}
.el-picker-panel {
  background-color: rgba(27, 59, 71, 0.7);
  color: #fff;
  border: none;
  .el-picker-panel__body-wrapper {
    .el-picker-panel__body {
      .in-range {
        div {
          background-color: rgba(81, 89, 112, 0.7);
        }
      }
    }
  }
  .remarks {
    .dialog-footer {
      color: #ffffff;
      display: flex;
      justify-content: center;
      .button {
        height: 37px;
        line-height: 31px;
        font-size: 14px;
        &:first-child {
          margin-right: 30px;
        }
      }
    }
  }
}
</style>
