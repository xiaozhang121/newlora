<template>
  <div class="pageHisRecords">
    <div class="top not-print">
      <div>{{titleCode.securityRecord}}</div>
      <div class="btn">
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="typeSelect"
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
          <duno-btn-top
            @on-select="selectDownloadType"
            class="dunoBtnTo"
            :isCheck="false"
            :dataList="downLoadList"
            :output="true"
            title="导出表格"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <!-- <div>
          <div @click="clickExcel">
            <i class="iconfont icon-daochu1"></i>
            导出表格
          </div>
        </div>-->
      </div>
    </div>
    <div class="tables">
      <duno-tables-tep
        class="table_abnormalInfo"
        :columns="columns"
        :data="dataList"
        :totalNum="totalNum"
        :pageSize="pageRows"
        :current="pageIndex"
        :border="true"
        :showSizer="true"
        :isShowPage="mixinViewModuleOptions.isShowPage"
        @on-select="dataListSelectionChangeHandle"
        @clickPage="pageCurrentChangeHandle"
        @on-page-size-change="pageSizeChangeHandle"
      />
    </div>
    <wraning :popData="popData" detailsType="alarm" :visible="visible" @handleClose="handleClose" />
    <enlarge
      :isShow="isEnlarge"
      :pushCamera="false"
      :srcData="srcData"
      @closeEnlarge="closeEnlarge"
    />
    <Remarks :isShow="dialogVisible" :alarmId="alarmId" @beforeClose="beforeClose" />
  </div>
</template>

<script>
import { postAxiosData, getAxiosData } from "@/api/axiosType";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import Remarks from "_c/duno-c/Remarks";
import { DunoTablesTep } from "_c/duno-tables-tep";
import mixinViewModule from "@/mixins/view-module";
import buttonCustom from "_c/duno-m/buttonCustom";
import enlarge from "_c/duno-c/enlarge";
import wraning from "_c/duno-j/warning";
import moment from "moment";
import {
  alarmType,
  addReturn,
  dealRemarks
} from "@/api/configuration/configuration.js";
import { truncate } from "fs";
export default {
  name: "PageHisRecords",
  mixins: [mixinViewModule],
  components: {
    dunoBtnTop,
    DunoTablesTep,
    buttonCustom,
    enlarge,
    Remarks,
    wraning
  },
  props: {
    areaId: {
      type: Number,
      default: null
    },
    titleCode: {
      type: Object,
      default: {}
    },
    infoColumns: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    const that = this;
    return {
      mixinViewModuleOptions: {
        imgAUTO: true,
        activatedIsNeed: false,
        getDataListURL: "/lenovo-alarm/api/security/list",
        exportURL: "/lenovo-alarm/api/security/history/export"
      },
      value: "",
      titleType: "全部类型",
      dataForm: {},
      queryForm: {},
      popData: {},
      typeSelect: [],
      dialogVisible: false,
      visible: false,
      textarea: "",
      alarmId: "",
      isEnlarge: false,
      srcData: [],
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
          key: "alarmTime",
          title: "拍摄时间",
          width: 200,
          align: "center",
          tooltip: true
        },
        {
          key: "alarmDetailType",
          title: "告警类型",
          align: "center",
          width: 200,
          tooltip: true
        },
        {
          title: "来源",
          key: "monitorDeviceName",
          minWidth: 150,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h(
                "Tooltip",
                {
                  props: {
                    placement: "top",
                    maxWidth: "150",
                    content: params.row.monitorDeviceName
                      ? params.row.monitorDeviceName
                      : params.row.source,
                    transfer: true
                  },
                  style: {
                    width: "100%"
                  }
                },
                [
                  h(
                    "a",
                    {
                      class: "table_link",
                      props: { type: "text" },
                      style: {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "inline-block",
                        width: "100%"
                      },
                      on: {
                        click: () => {
                          this.getJump(params.row);
                        }
                      }
                    },
                    params.row.monitorDeviceName
                      ? params.row.monitorDeviceName
                      : params.row.source
                  )
                ]
              )
            ]);
            return h("div", { class: { member_operate_div: true } }, newArr);
          }
        },
        {
          key: "dataType",
          title: "处理记录",
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            let dealType = "/";
            if (
              params.row.dealList &&
              params.row.dealList[0] &&
              params.row.dealList[0].dealType
            )
              dealType = params.row.dealList[0].dealType;
            newArr.push([
              h(
                "Tooltip",
                {
                  class: "tip_type",
                  props: {
                    placement: "top",
                    maxWidth: "150",
                    content: dealType,
                    transfer: true
                  },
                  style: {
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }
                },
                dealType
              )
            ]);
            return h("div", newArr);
          }
        },
        {
          key: "content",
          title: "处理时间",
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let timeDay =
              params.row.dealList &&
              params.row.dealList[0] &&
              params.row.dealList[0].dealTime
                ? params.row.dealList[0].dealTime.slice(5)
                : "/";
            return h("div", [h("div", timeDay)]);
          }
        },
        {
          title: "视频/图片",
          key: "id",
          align: "center",
          width: 120,
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
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
            return h("div", newArr);
          }
        },
        {
          title: " ",
          align: "center",
          width: 200,
          tooltip: true,
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
                    class: "btn_pre_grey",
                    style: { background: "#979797" },
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
          align: "center",
          width: "90",
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
      ]
    };
  },
  watch: {
    areaId(now) {
      this.dataForm.areaId = now;
      this.queryForm.areaId = now;
      // this.getDataList();
      this.clickQuery(this.dataForm);
    },
    titleCode(now) {
      this.value = now.value;
      this.titleType = now.titleType;
    },
    infoColumns(now) {
      this.columns = now;
    }
  },
  methods: {
    getWidth() {
      let screen = window.screen.availWidth;
      if (screen > 3500) {
        this.columns.splice(5, 1);
        this.columns.splice(2, 1);
      }
    },
    handleClose() {
      this.popData = {};
      this.visible = false;
    },
    addReturn(item) {
      const that = this;
      const query = {
        alarmId: item.alarmId,
        type: "1"
      };
      dealRemarks(query).then(res => {
        if (res.data.isSuccess) that.$message.success(res.msg);
        else that.$message.error(res.msg);
        // this.showReturn = false;
        this.getDataList();
      });
      that.getDataList();
    },
    onSelect(item) {
      this.titleType = item["describeName"];
      this.dataForm.alarmType = item["monitorDeviceType"];
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
    selectDownloadType(item) {
      const that = this;
      this.dataForm.type = item.monitorDeviceType;
      this.queryForm = this.dataForm;
      that.exportHandle();
    },
    // clickExcel() {
    //   const that = this;
    //   that.queryForm.areaId = that.dataForm.areaId;
    //   that.exportHandle();
    // },
    getAlarmType() {
      alarmType().then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleType"
          };
          return obj;
        });
        map.unshift({
          describeName: "所有类型",
          monitorDeviceType: "",
          title: "titleTypeL"
        });
        this.typeSelect = map;
      });
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
        if (monitorDeviceType == 1  || monitorDeviceType == 5) {
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
        } else if (monitorDeviceType == 3  || monitorDeviceType == 9) {
          this.$router.push({
            path: "/surveillancePath/detailEnv",
            query: {
              monitorDeviceId: monitorDeviceId
            }
          });
        }else if (monitorDeviceType == 6) {
          this.$router.push({
            path: "/surveillancePath/detailUbiquitou",
            query: {
              monitorDeviceId: monitorDeviceId
            }
          });
        }
      });
    },
    beforeClose() {
      this.dialogVisible = false;
      this.getDataList();
    },
    dataListSelectionChangeHandle() {}
  },
  mounted() {
    this.getAlarmType();
  },
  created() {
    this.getWidth();
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.pageHisRecords {
  width: 100%;
  .top {
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    @media screen and (min-width: 3500px) {
      height: 35px;
    }
    & > div:first-child {
      padding-top: 10px;
      font-size: 18px;
      @media screen and (min-width: 3500px) {
        padding-top: 0;
        font-size: 16px;
        line-height: 35px;
      }
    }
    .btn {
      display: flex;
      justify-content: space-between;
      & > div {
        margin-left: 10px;
      }
      .dunoBtnTop {
        width: 190px;
        display: inline-flex;
        padding-bottom: 0;
        .btnList {
          top: inherit !important;
          width: 190px;
          .title {
            font-size: 16px;
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
      .dateChose {
        height: 40px;
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
          height: 40px;
          @media screen and (min-width: 3500px) {
            height: 35px !important;
            width: 250px;
          }
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
  .imgOrMv {
    width: 80%;
    height: 45px;
    position: relative;
    top: 2px;
  }
  .tables {
    overflow: hidden;
    background-color: #142838;
    .tablesTep {
      height: 100%;
      background-color: rgba(0, 0, 0, 0);
      .ivu-table-wrapper {
        tr:nth-child(even) {
          td {
            background-color: #213848;
          }
        }
        border: none;
        .ivu-table {
          border: none !important;
          color: #fff;
          background-color: rgba(0, 0, 0, 0);
          .ivu-table-header {
            line-height: 60px;
            background-color: #325e82;
          }
          .ivu-table-body {
            .ivu-table-row {
              .ivu-table-column-center {
                height: 48px;
              }
            }
          }
          .ivu-table-tip {
            min-height: 300px;
          }
        }
        .ivu-table:before,
        .ivu-table:after {
          background-color: rgba(0, 0, 0, 0);
        }
        .ivu-table td,
        .ivu-table th {
          color: #fff;
          border: none;
          background-color: rgba(0, 0, 0, 0);
        }
      }
    }
  }
  .tip_type {
    .ivu-tooltip-rel {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .table_link {
    font-size: 16px;
    color: #5fafff !important;
    text-decoration: underline;
    @media screen and (min-width: 3500px) {
      font-size: 13px;
    }
  }
  .btn_pre {
    padding: 10px 15px;
    background-color: #3a81a1;
    border-radius: 16px;
    border: none;
  }
  .btn_pre_grey {
    padding: 10px 15px;
    background-color: #3a81a1;
    border-radius: 16px;
    border: none;
    background: #979797;
    color: #767676;
  }
  //-------------------表格样式
  .ivu-table th {
    color: #fff;
    border: none;
    height: 60px;
    font-size: 18px;
    font-weight: normal;
    background-color: #2d5980 !important;
    @media screen and (min-width: 3500px) {
      font-size: 15px;
      height: 50px;
    }
  }
  .ivu-table-cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .ivu-table-border td {
    font-size: 16px;
    color: #fff;
    border: none;
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
  .el-button {
    background: rgba(0, 0, 0, 0);
    border-color: rgba(0, 0, 0, 0);
  }
  .el-button:hover {
    background: rgba(0, 0, 0, 0);
    border-color: rgba(0, 0, 0, 0);
    color: #767676;
  }
  .ivu-table-wrapper {
    tr {
      border-bottom: 1px solid #2b5272;
      td {
        height: 52px;
        @media screen and (min-width: 3500px) {
          height: 50px;
          font-size: 13px;
        }
      }
    }
    tr:nth-child(odd) {
      td {
        background-color: #0a1c2a;
      }
    }
    tr:nth-child(even) {
      td {
        background-color: #0a1c2a;
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
</style>
