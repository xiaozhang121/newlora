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
        @on-select="dataListSelectionChangeHandle"
        @clickPage="pageCurrentChangeHandle"
        @on-page-size-change="pageSizeChangeHandle"
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
      mixinViewModuleOptions: {
        getDataListURL: "/lenovo-device/api/monitor/device-list"
      },
      dataForm: {},
      radio: "1",
      value: "",
      totalNum: 10,
      titleTypeL: "所有网络设备",
      titleTypeR: "所有状态",
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "/abnormalInfoPath/platformMonitor", name: "平台监控" },
        { path: "", name: "网络设备" }
      ],
      stateSelect: [],
      DeviceData: [],
      infoColumns: [
        {
          key: "monitorDeviceId",
          title: "网络设备名称",
          align: "center"
        },
        {
          key: "monitorDeviceType",
          title: "型号",
          align: "center"
        },
        {
          key: "areaName",
          title: "品牌",
          align: "center"
        },
        {
          key: "areaName",
          title: "IP地址",
          align: "center"
        },
        {
          key: "statusName",
          title: "当前状态",
          align: "center",
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h("span", {
                class: {
                  circleStatus: true,
                  green: params.row.status === "1",
                  fault: params.row.status === "2",
                  close: params.row.status === "0"
                },
                draggable: false
              })
            ]);
            newArr.push([
              h("span", { draggable: true }, params.row.statusName)
            ]);
            return h("div", newArr);
          }
        },
        {
          key: "statusName",
          title: "端口流量",
          align: "center",
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h(
                "div",
                {
                  class: {
                    green: params.row.status === "1",
                    close: params.row.status === "0"
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
                        paddingRight: "10px"
                      }
                    },
                    "105m/s"
                  ),
                  h("i", {
                    class: "iconfont icon-xiazaisudu",
                    style: {
                      paddingRight: "5px"
                    }
                  }),
                  h("span", "105m/s")
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
    onSelectDevice(item) {
      this.titleTypeL = item["describeName"];
      this.getDataList();
    },
    onSelectState(item) {
      this.dataForm.status = item["value"];
      this.getDataList();
      this.titleTypeR = item["describeName"];
    },
    onChangeTime(data) {
      const startTime = moment(data[0]).format("YYYY-MM-DD");
      const endTime = moment(data[1]).format("YYYY-MM-DD");
      this.startTime = JSON.parse(JSON.stringify(startTime));
      this.endTime = JSON.parse(JSON.stringify(endTime));
      this.$emit("onChange", data);
    },
    changeCycle() {
      let query = {};
      query.id = row.params.id;
      putAxiosData("/lenovo-plan/api/plan/cycle-edit").then(res => {
        if (res.code !== 200) {
          return that.$message.error(res.msg);
        }
      });
    },
    onClickDropdown(row, type, value) {
      const index = row._index;
      this.dataList[index].inspectCycle = type;
      this.psotAlarmData(row, value);
    },
    psotAlarmData(row, value) {
      const that = this;
      const url = "/lenovo-device/api/monitor/edit";
      const query = {
        id: row.id,
        cycleType: value
      };
      putAxiosData(url, query).then(
        res => {
          if (res.code !== 200) {
            this.dataList[index].cycleType = row.inspectCycle;
            return that.$message.error(res.msg);
          }
          that.$message.success(res.msg);
          this.getDataList();
        },
        error => {
          this.dataList[index].cycleType = row.inspectCycle;
        }
      );
    },
    getSelectStatus() {
      getStatus().then(res => {
        const resData = res.data;
        let map = resData.map(item => {
          const obj = {
            describeName: item.label,
            value: item.value,
            title: "titleTypeR"
          };
          return obj;
        });
        map.unshift({
          describeName: "所有状态",
          value: "",
          title: "titleTypeR"
        });
        this.stateSelect = map;
      });
    },
    getSelectDevice() {
      let url = "";
      getAxiosData().then(res => {
        const resData = res.data;
        let map = resData.map(item => {
          const obj = {
            describeName: item.label,
            value: item.value,
            title: "titleTypeL"
          };
          return obj;
        });
        this.DeviceData = map;
      });
    },
    getJump(row) {
      getAxiosData("/lenovo-device/api/preset/type", {
        monitorDeviceId: row.monitorDeviceId
      }).then(res => {
        let supportPreset = res.data["supportPreset"];
        let monitorDeviceType = res.data["monitorDeviceType"];
        if (monitorDeviceType == 1) {
          if (supportPreset) {
            this.$router.push({
              path: "/surveillancePath/detailLight",
              query: {
                monitorDeviceId: row.monitorDeviceId
              }
            });
          } else {
            this.$router.push({
              path: "/surveillancePath/detailLightN",
              query: {
                monitorDeviceId: row.monitorDeviceId
              }
            });
          }
        } else if (monitorDeviceType == 2) {
          if (supportPreset) {
            this.$router.push({
              path: "/surveillancePath/detailRed",
              query: {
                monitorDeviceId: row.monitorDeviceId,
                typeId: res.data["typeId"]
              }
            });
          } else {
            this.$router.push({
              path: "/surveillancePath/detailRedN",
              query: {
                monitorDeviceId: row.monitorDeviceId,
                typeId: res.data["typeId"]
              }
            });
          }
        } else if (monitorDeviceType == 3) {
          this.$router.push({
            path: "/surveillancePath/detailEnv",
            query: {
              monitorDeviceId: row.monitorDeviceId
            }
          });
        }
      });
    }
  },
  mounted() {
    this.getSelectDevice();
    this.getSelectStatus();
  }
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
    margin-right: 5px;
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
