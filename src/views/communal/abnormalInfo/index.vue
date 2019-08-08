<template>
  <div class="abnormalInfod">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top">
      <div>异常信息</div>
      <div class="btn">
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTo"
            :isCheck="false"
            :dataList="regionList"
            :title="titleTypeL"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="typeList"
            :title="titleTypeR"
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
        <div style="display: none">
          <div @click="clickExcel">
            <i class="iconfont icon-daochu1"></i>
            导出Excel
          </div>
        </div>
        <div class="setting" @click="showSetting">
          <i class="iconfont icon-shezhi"></i>
        </div>
      </div>
    </div>
    <duno-main class="dunoMain">
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
    </duno-main>
    <warning-setting @handleClose="onClose" :visibleOption="visibleSettingOption" />
    <wraning
      :popData="popData"
      :fileType="isFileType"
      :visible="visible"
      @handleClose="handleClose"
    />
  </div>
</template>

<script>
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import dunoMain from "_c/duno-m/duno-main";
import moment from "moment";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import warningSetting from "_c/duno-j/warningSetting";
import wraning from "_c/duno-j/warning";
import mixinViewModule from "@/mixins/view-module";
import { DunoTablesTep } from "_c/duno-tables-tep";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import screenfull from "screenfull";
export default {
  name: "abnormalInfo",
  mixins: [mixinViewModule],
  components: {
    dunoBtnTop,
    KeyMonitor,
    dunoMain,
    DunoTablesTep,
    warningSetting,
    wraning,
    Breadcrumb
  },
  data() {
    const that = this;
    return {
      handleNotes: [],
      alarmType: "",
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: "/lenovo-alarm/api/alarm/history",
        exportURL: "/lenovo-alarm/api/alarm/history/export"
      },
      //   dataBread: ["卡片功能", "异常信息"],
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "卡片功能" },
        { path: "/abnormalInfoPath/list", name: "异常信息" }
      ],
      isFileType: false,
      visibleSettingOption: false,
      visible: false,
      totalNum: 500,
      pageRows: 20,
      selectInfo: "更多",
      serious: false,
      commonly: false,
      danger: false,
      value: "",
      titleTypeL: "所有区域",
      titleTypeC: "所有状态",
      titleTypeR: "所有来源",
      columns: [
        {
          title: "时间",
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
          title: "报警对象",
          key: "mainDevice",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "报警部位",
          key: "powerDeviceName",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h(
                "div",
                params.row.powerDeviceName == null
                  ? "/"
                  : params.row.powerDeviceName
              )
            ]);
            return h("div", newArr);
          }
        },
        {
          title: "区域",
          key: "areaName",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "报警内容",
          key: "alarmContent",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "警告级别",
          key: "alarmLevelName",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
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
          title: "信息来源",
          key: "monitorDeviceName",
          minWidth: 150,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push(
              h(
                "Tooltip",
                {
                  props: { content: params.row.monitorDeviceName }
                },
                [
                  h(
                    "a",
                    {
                      class: "table_link",
                      props: { type: "text" },
                      on: {
                        click: () => {
                          console.log("摄像头ID：", params.row.monitorDeviceId);
                          this.getJump(params.row);
                        }
                      }
                    },
                    params.row.monitorDeviceName
                  )
                ]
              )
            );
            return h("div", { class: { member_operate_div: true } }, newArr);
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
                  ref: "imgContain",
                  on: {
                    click: () => {
                      that.changeFullScreen(this.$refs.imgContain);
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
                  ref: "videoContain",
                  on: {
                    click: () => {
                      that.changeFullScreen($refs.videoContain);
                    }
                  }
                })
              ]);
            }
            return h("div", newArr);
          }
        },
        {
          title: "处理记录",
          key: "dealRecord",
          width: 120,
          align: "center",
          tooltip: true
        },
        {
          title: " ",
          key: "id",
          width: 200,
          align: "center",
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h(
                "el-button",
                {
                  class: ["btnClass", { grey: params.row.isReturn == "1" }],
                  props: { disabled: params.row.isReturn == "1" },
                  style: { marginRight: "20px" },
                  on: {
                    click: () => {
                      that.restoration(params.row, params.row.isReturn);
                    }
                  }
                },
                params.row.isReturn == "0" ? "复归" : "已复归"
              )
            ]);
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
      alarmLevel: ""
    };
  },
  created() {
    this.getRegion();
    this.getStart();
    this.getType();
  },
  methods: {
    changeFullScreen(target) {
      const that = this;
      screenfull.toggle(target);
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
      this.psotAlarmData(row, No);
    },
    psotAlarmData(row, No) {
      const that = this;
      const url = "/lenovo-alarm/api/alarm/level-edit";
      const query = {
        id: row.id,
        alarmLevel: No
      };
      putAxiosData(url, query).then(
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
      } else if (item.title == "titleTypeC") {
        this.clcikQueryData.status = item.monitorDeviceType;
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
    restoration(row, flag) {
      if (flag == 0) {
        const url = "/lenovo-alarm/api/alarm/deal";
        const query = {
          alarmId: row.alarmId,
          type: "1"
        };
        postAxiosData(url, query).then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.msg);
          }
          this.dataList[row._index].isReturn = "1";
          this.$message.success(res.msg);
        });
      }
    },
    clickExcel() {
      const that = this;
      that.exportHandle();
    },
    getRegion() {
      const that = this;
      const url = "/lenovo-device/api/area/select-list";
      postAxiosData(url).then(res => {
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
          describeName: "所有区域",
          monitorDeviceType: "",
          title: "titleTypeL"
        });
        this.regionList = map;
      });
    },
    getStart() {
      const that = this;
      const url = "/lenovo-device/api/monitor/status";
      postAxiosData(url).then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleTypeC"
          };
          return obj;
        });
        map.unshift({
          describeName: "所有状态",
          monitorDeviceType: "",
          title: "titleTypeC"
        });
        this.statusList = map;
      });
    },
    getType() {
      const that = this;
      const url = "/lenovo-plan/api/list/monitor-device-type";
      postAxiosData(url).then(res => {
        const resData = res.data;
        let mapList = resData.filter(item => item.label != "请选择");
        const map = mapList.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleTypeR"
          };
          return obj;
        });
        map.unshift({
          describeName: "所有来源",
          monitorDeviceType: "",
          title: "titleTypeR"
        });
        this.typeList = map;
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
              monitorDeviceId: monitorDeviceId
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
    }
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.abnormalInfod {
  .el-select-dropdown {
    background: linear-gradient(
      210deg,
      rgba(48, 107, 135, 0.9),
      rgba(28, 50, 64, 0.7) 60%
    ) !important;
    border: none !important;
    margin-top: 1px !important;
    margin-left: 0px;
    border-radius: 0;
    min-width: 153px !important;
  }
  .el-select-dropdown__item,
  .el-select-dropdown__empty,
  .el-select-dropdown__item.selected {
    color: white;
  }
  .el-select-dropdown__list {
    position: relative;
    top: -5px;
  }
  .el-popper[x-placement^="bottom"] .popper__arrow {
    display: none;
  }
  .main .content-wrapper {
    padding-top: 0;
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
  }
}
</style>

<style lang="scss">
.abnormalInfod {
  width: 100%;
  .btnClass {
    border-radius: 15px;
    background: #3a81a1;
    margin: auto;
    border: none;
    &.grey {
      background: #979797;
      color: #767676;
    }
  }
  //-------------------表格样式
  .dunoMain {
    height: inherit;
  }
  .ivu-table th {
    color: #fff;
    border: none;
    height: 60px;
    background-color: #2d5980 !important;
    font-size: 18px;
    font-weight: normal;
    @media screen and (min-width: 3500px) {
      height: 50px;
      font-size: 16px;
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
  .ivu-table {
    font-size: 16px;
    // @media screen and (min-width: 3500px) {
    //   font-size: 14px;
    // }
  }
  .ivu-table-wrapper {
    tr {
      td {
        height: 60px;
        // @media screen and (min-width: 3500px) {
        //   height: 50px;
        //   font-size: 14px;
        // }
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
  .ivu-table-cell {
    @media screen and (min-width: 3500px) {
      padding-left: 10px;
      padding-right: 10px;
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
    width: 80%;
    height: 45px;
    position: relative;
    top: 2px;
  }
  .table_link {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
    font-size: 16px;
    color: #5fafff !important;
    text-decoration: underline;
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
  .top {
    color: #ffffff;
    height: 40px;
    margin-bottom: 10px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      color: #fff;
      font-size: 20px;
      line-height: 40px;
    }
    .btn {
      display: flex;
      justify-content: space-between;
      & > div {
        margin-left: 10px;
        .dunoBtnTop {
          width: 120px;
          display: inline-flex;
          padding-bottom: 0;
          .btnList {
            top: inherit !important;
            // line-height: 30px;
            width: 120px;
            .title {
              // font-size: 16px;
              padding: 8px 20px;
            }
          }
        }
      }
      & > div:nth-child(4) {
        & > div {
          width: 140px;
          line-height: 40px;
          text-align: center;
          background-image: url(../../../assets/images/btn/moreBtn.png);
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
  .icon-xiala {
    color: white;
    font-size: 13px;
  }
  .dropSelf {
    .icon-xiala {
      font-size: 9px;
      position: absolute;
      /*   width: 12px !important;
      height: 15px !important;*/
      /*right: 20px;
      top: 14px;*/
    }
  }
}
.setting {
  cursor: pointer;
  i {
    font-size: 25px;
    position: relative;
    top: 3px;
    padding-right: 5px;
  }
}
</style>
