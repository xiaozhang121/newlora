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
          <div @click="clickExcel">
            <i class="iconfont icon-daochu1"></i>
            导出表格
          </div>
        </div>
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
        @on-select="dataListSelectionChangeHandle"
        @clickPage="pageCurrentChangeHandle"
        @on-page-size-change="pageSizeChangeHandle"
      />
    </div>
    <wraning :popData="popData" detailsType="alarm" :visible="visible" @handleClose="handleClose" />
    <enlarge :isShow="isEnlarge" :srcData="srcData" @closeEnlarge="closeEnlarge" />
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
      columns: [
        {
          key: "alarmTime",
          title: "拍摄时间",
          minWidth: 120,
          align: "center",
          render: (h, params) => {
            let timeDay = params.row.alarmTime.slice(5);
            return h("div", timeDay);
          }
        },
        {
          key: "alarmDetailType",
          title: "告警类型",
          align: "center"
        },
        {
          key: "monitorDeviceName",
          title: "拍摄来源",
          align: "center",
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
          key: "dataType",
          title: "处理记录",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.dealList[0].dealType);
          }
        },
        {
          key: "content",
          title: "处理时间",
          align: "center",
          render: (h, params) => {
            let timeDay = params.row.dealList[0].dealTime.slice(5);
            return h("div", timeDay);
          }
        },
        {
          title: "视频/图片",
          key: "id",
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
          width: 180,
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
      ]
    };
  },
  watch: {
    areaId(now) {
      this.dataForm.areaId = now;
      this.queryForm.areaId = now;
      this.getDataList();
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
      this.getDataList();
    },
    onChangeTime(data) {
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
    clickExcel() {
      const that = this;
      that.queryForm.areaId = that.dataForm.areaId;
      that.exportHandle();
    },
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
    },
    beforeClose() {
      this.dialogVisible = false;
      this.getDataList();
    },
    dataListSelectionChangeHandle() {}
  },
  mounted() {
    this.getAlarmType();
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
      & > div:last-child {
        & > div {
          width: 140px;
          line-height: 40px;
          text-align: center;
          // background-color: #192f41;
          background-image: url(../../../assets/images/btn/moreBtn.png);
          cursor: pointer;
          @media screen and (min-width: 3500px) {
            background-size: 100% 100%;
            font-size: 14px;
            line-height: 34px;
            width: 120px;
          }
        }
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
      }
    }
  }
  .imgOrMv {
    width: 43%;
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
  .table_link {
    font-size: 16px;
    text-align: center;
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
    @media screen and (min-width: 3500px) {
      padding-left: 10px;
      padding-right: 10px;
    }
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
