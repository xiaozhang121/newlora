<template>
  <div class="toConfigure">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top not-print">
      <div>网络设备</div>
      <div class="btn">
        <div>
          <duno-btn-top
            :style="{visibility:hidden}"
            ref="btnTopRef"
            @on-select="onSelectDevice"
            class="dunoBtnTop"
            :dataList="DeviceData"
            :title="titleTypeL"
            :isCheck="false"
            :showBtnList="false"
          />
        </div>
        <div>
          <duno-btn-top
            @on-select="onSelectState"
            class="dunoBtnTopSm"
            :isCheck="false"
            :dataList="stateSelect"
            :title="titleTypeR"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
      </div>
    </div>
    <duno-main class="dunoMain">
      <duno-tables-tep
        class="table_abnormalInfo"
        :columns="infoColumns"
        :data="dataList"
        :totalNum="totalNum"
        :pageSize="pageRows"
        :current="pageIndex"
        :border="true"
        :showSizer="true"
        :isShowPage="mixinViewModuleOptions.isShowPage"
        @clickPage="pageCurrentChangeHandle"
      />
    </duno-main>
  </div>
</template>

<script>
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import { DunoTablesTep } from "_c/duno-tables-tep";
import dunoMain from "_c/duno-m/duno-main";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import mixinViewModule from "@/mixins/view-module";
import { putAxiosData, getAxiosData } from "@/api/axiosType";
import {
  getVoltage,
  getStatus,
  getDevice
} from "@/api/configuration/configuration.js";
import moment from "moment";
export default {
  name: "toConfigure",
  mixins: [mixinViewModule],
  components: {
    dunoBtnTop,
    DunoTablesTep,
    Breadcrumb,
    dunoMain
  },
  data() {
    const that = this;
    return {
      dataForm: {
        type: "",
        status: ""
      },
      totalNum: 10,
      pageIndex: 1,
      pageRows: 10,
      dataList: [],
      titleTypeL: "所有网络设备",
      titleTypeR: "所有状态",
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "/abnormalInfoPath/platformMonitor", name: "平台监控" },
        { path: "", name: "网络设备" }
      ],
      stateSelect: [
        {
          describeName: "上线",
          value: "ApOnline"
        },
        {
          describeName: "连接中",
          value: "ApConnecting"
        },
        {
          describeName: "离线",
          value: "ApOffline"
        },
        {
          describeName: "未上线",
          value: "ApDown"
        }
      ],
      DeviceData: [
        {
          describeName: "无线ap",
          value: "0"
        },
        {
          describeName: "交换机",
          value: "1"
        }
      ],
      infoColumns: [
        {
          key: "monitorDeviceId",
          title: "网络设备名称",
          minWidth: 210,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            return h("div", "802.11ac Wave2天线一一体化室外无无线AP");
          }
        },
        {
          key: "model",
          title: "型号",
          tooltip: true,
          align: "center"
        },
        {
          key: "areaName",
          title: "品牌",
          tooltip: true,
          align: "center",
          render: (h, params) => {
            return h("div", "苏州汉明");
          }
        },
        {
          key: "ip",
          title: "IP地址",
          tooltip: true,
          align: "center"
        },
        {
          key: "status",
          title: "当前状态",
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h("span", {
                class: {
                  circleStatus: true,
                  green: params.row.status === "上线",
                  fault: params.row.status === "连接中",
                  close: params.row.status === "离线"
                },
                draggable: false
              })
            ]);
            newArr.push([h("span", { draggable: true }, params.row.status)]);
            return h("div", newArr);
          }
        },
        {
          key: "statusName",
          title: "端口流量",
          minWidth: 150,
          tooltip: true,
          align: "center",
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h(
                "div",
                {
                  class: {
                    green: params.row.status === "上线",
                    close: params.row.status === "离线"
                  }
                },
                [
                  h("i", {
                    class: "iconfont icon-shangchuansudu",
                    style: {
                      paddingRight: "5px"
                    }
                  }),
                  h(
                    "span",
                    {
                      style: {
                        paddingRight: "20px"
                      }
                    },
                    `${params.row.outPortFlow}m/s`
                  ),
                  h("i", {
                    class: "iconfont icon-xiazaisudu",
                    style: {
                      paddingRight: "5px"
                    }
                  }),
                  h("span", `${params.row.inPortFlow}m/s`)
                ]
              )
            ]);
            return h("div", newArr);
          }
        }
      ]
    };
  },
  methods: {
    // getWidth() {
    //   let screenWidth = window.screen.availWidth;
    //   let screenHeight = window.screen.availHeight;
    //   console.log(screenWidth, screenHeight);
    //   if (screenWidth == 3840 && screenHeight == 2160) {
    //     this.pageRows = 15;
    //   }
    // },
    init() {
      let url = "/lenovo-mon/api/monitoring/ap/zabbix/getNetDevicePage";
      let query = {
        pageIndex: this.pageIndex,
        pageRows: this.pageRows,
        type: this.dataForm.type,
        status: this.dataForm.status
      };
      getAxiosData(url, query).then(res => {
        this.dataList = res.data.records;
        this.totalNum = res.data.total;
      });
    },
    pageCurrentChangeHandle(index) {
      this.pageIndex = index;
      this.init();
    },
    onSelectDevice(item) {
      this.titleTypeL = item["describeName"];
      this.dataForm.type = item["value"];
      this.mixinViewModuleOptions.isShowPage = true;
      this.init();
    },
    onSelectState(item) {
      this.titleTypeR = item["describeName"];
      this.dataForm.status = item["value"];
      this.mixinViewModuleOptions.isShowPage = true;
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  // created() {
  //   this.getWidth();
  // }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.toConfigure {
  width: 100%;
  .dunoMain {
    height: inherit;
  }
  .circleStatus {
    width: 13px;
    height: 13px;
    display: inline-block;
    border-radius: 20px;
    margin-right: 15px;
    position: relative;
    top: 1px;
    &.green {
      background: #53fec0;
    }
    &.fault {
      background: #ff9000;
    }
    &.close {
      background: #ee183b;
    }
  }
  .table_select {
    cursor: pointer;
    span {
      position: relative;
      top: -2px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 22px;
      border-radius: 20px;
    }
  }
  .green {
    color: #53fec0;
  }
  .close {
    color: #ee183b;
  }
  .el-button--text {
    border-color: transparent !important;
    background: transparent !important;
  }
  .flexPos {
    display: flex;
    align-items: center;
  }
  .imgOrMv {
    width: 100%;
    height: 39px;
    position: relative;
    top: 2px;
  }
  .table_link {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    width: 140px;
    font-size: 16px;
    color: #5fafff !important;
    text-decoration: underline;
  }
  .table_abnormalInfo {
    padding: 28px 17px;
  }
  .table_select {
    cursor: pointer;
    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 22px;
      border-radius: 20px;
    }
  }
  .top {
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      padding-top: 20px;
      padding-bottom: 20px;
      font-size: 20px;
    }
    .btn {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      & > div {
        margin-left: 10px;
      }
      .dunoBtnTop,
      .ddunoBtnTopSm {
        display: inline-flex;
        padding-bottom: 0;
        .btnList {
          top: inherit !important;
          // line-height: 40px;
          .title {
            font-size: 16px;
            padding: 8px 20px;
          }
        }
      }
      .dunoBtnTop {
        width: 150px;
        .btnList {
          width: 150px;
        }
      }
      .dunoBtnTopSm {
        width: 140px;
        .btnList {
          width: 140px;
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
            font-size: 18px;
            color: #fff;
          }
          .el-range-input {
            color: #fff;
          }
        }
      }
    }
  }
  .table_abnormalInfo {
    padding: 28px 17px;
  }
}
.toConfigure {
  //-------------------表格样式
  .ivu-table th {
    color: #fff;
    border: none;
    height: 60px;
    font-size: 18px;
    font-weight: normal;
    background-color: #2d5980 !important;
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
        height: 52px;
        font-size: 16px;
      }
    }
    tr:nth-child(odd) {
      td {
        background-color: #0a1c2a;
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
