<template>
  <div class="analysis-detail">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top not-print">
      <div>现场安全管控异常信息</div>
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
        </div>-->
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
        :isShowPage='mixinViewModuleOptions.isShowPage'
        @on-select="dataListSelectionChangeHandle"
        @clickPage="pageCurrentChangeHandle"
        @on-page-size-change="pageSizeChangeHandle"
      />
    </duno-main>
    <warning-setting @handleClose="onClose" :visibleOption="visibleSettingOption" />
    <wraning :popData="popData" detailsType="alarm" :visible="visible" @handleClose="handleClose" />
    <enlarge
      :pushCamera="false"
      :isShow="isEnlarge"
      :srcData="srcData"
      @closeEnlarge="closeEnlarge"
    />
    <Remarks :isShow="dialogVisible" :alarmId="alarmId" @beforeClose="beforeClose" />
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import dunoMain from "_c/duno-m/duno-main";
import moment from "moment";
import Remarks from "_c/duno-c/Remarks";
import enlarge from "_c/duno-c/enlarge";
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
    buttonCustom,
    enlarge,
    Remarks
  },
  data() {
    const that = this;
    return {
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
      textarea: "",
      commonly: false,
      danger: false,
      isEnlarge: false,
      srcData: [],
      queryForm: {},
      dataForm: {},
      dialogVisible: false,
      value: "",
      alarmId: "",
      titleTypeL: "全部电压等级",
      titleTypeR: "全部类型",
      dataBread: [
        { path: "/realEnv/list", name: "操作中台" },
        { path: "/environmental/list", name: "现场安全管控" },
        { path: "/environmental/list", name: "信息总览" },
        { path: "", name: "现场安全管控异常信息" }
      ],
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
          title: "来源",
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
            let dealList = params.row.dealList;
            return h("div", dealList.length > 0 ? dealList[0].dealType : "");
          }
        },
        {
          title: "处理时间",
          key: "dealTime",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let dealList = params.row.dealList;
            let timeDay;
            if (dealList.length > 0) {
              timeDay = dealList[0].dealTime.slice(5);
            } else {
              timeDay = "";
            }
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
                      this.dialogVisible = true;
                      this.alarmId = params.row.alarmId;
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
      popData: {}
    };
  },
  created() {
    this.getRegion();
    this.getType();
  },
  methods: {
    onClose() {
      this.visibleSettingOption = false;
    },
    showSetting() {
      this.visibleSettingOption = true;
    },
    selectDownloadType(item) {
      const that = this;
      this.dataForm.type = item.monitorDeviceType;
      this.queryForm = this.dataForm;
      that.exportHandle();
    },
    onSelect(item, index) {
      this[item.title] = item["describeName"];
      if (item.title == "titleTypeL") {
        this.dataForm.areaId = item.monitorDeviceType;
      } else if (item.title == "titleTypeR") {
        this.dataForm.alarmType = item.monitorDeviceType;
      }
      // this.getDataList();
      this.clickQuery(this.dataForm);
    },
    onChangeTime(data) {
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD 00:00:00");
        endTime = moment(data[1]).format("YYYY-MM-DD 23:59:59");
      }
      this.dataForm.startTime = startTime;
      this.dataForm.endTime = endTime;
      // this.getDataList();
      this.clickQuery(this.dataForm);
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
    // clickExcel() {
    //   const that = this;
    //   that.exportHandle();
    // },
    getRegion() {
      const that = this;
      getRegionData().then(res => {
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
    getType() {
      const that = this;
      getTypeData().then(res => {
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
          describeName: "全部告警类型",
          monitorDeviceType: "",
          title: "titleTypeR"
        });
        this.typeList = map;
      });
    },
    closeEnlarge() {
      this.isEnlarge = false;
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
          if (supportPreset) {
            this.$router.push({
              path: "/surveillancePath/detailRed",
              query: {
                monitorDeviceId: monitorDeviceId,
                typeId: res.data["typeId"]
              }
            });
          } else {
            this.$router.push({
              path: "/surveillancePath/detailRedN",
              query: {
                monitorDeviceId: monitorDeviceId,
                typeId: res.data["typeId"]
              }
            });
          }
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
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.analysis-detail {
  width: 100%;
  .icon-xiala {
    /*width: 13px;
    height: 16px;*/
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
    background: transparent;
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
            width: 140px;
            .btnList {
              width: 140px;
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
      // .clickBtn {
      //   line-height: 40px;
      //   width: 139px;
      //   background-image: url(../../../assets/images/btn/moreBtn.png);
      //   text-align: center;
      //   font-size: 18px;
      //   cursor: pointer;
      //   color: #ffffff;
      //   @media screen and (min-width: 3500px) {
      //     background-size: 100% 100%;
      //     font-size: 14px;
      //     line-height: 34px;
      //     width: 120px;
      //   }
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
          color: #fff;
        }
        .el-range-editor--small .el-range-input {
          font-size: 16px;
          @media screen and (min-width: 3500px) {
            font-size: 14px;
          }
        }
        ::placeholder {
          color: #fff;
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
  //   .remarks {
  //     .dialog-footer {
  //       color: #ffffff;
  //       display: flex;
  //       justify-content: center;
  //       .button {
  //         height: 37px;
  //         line-height: 31px;
  //         font-size: 14px;
  //         &:first-child {
  //           margin-right: 30px;
  //         }
  //       }
  //     }
  //   }
}
</style>
