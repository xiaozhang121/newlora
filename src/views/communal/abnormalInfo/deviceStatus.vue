<template>
  <div class="toConfigure">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top not-print">
      <div>监测设备管理</div>
      <div class="btn">
        <div>
          <duno-btn-top
            ref="btnTopRef"
            @on-active="onSelectDevice"
            class="dunoBtnTop"
            :dataList="TestEquipment"
            :title="titleTypeL"
            :chexked="chexked"
            :showBtnList="false"
          />
        </div>
        <div>
          <duno-btn-top
            @on-select="onSelectVol"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="voltageLevel"
            :title="titleTypeC"
            :showBtnList="false"
          ></duno-btn-top>
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
      titleTypeL: "所有监测设备",
      titleTypeC: "所有电压等级",
      titleTypeR: "所有状态",
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "/abnormalInfoPath/platformMonitor", name: "平台监控" },
        { path: "", name: "监测设备管理" }
      ],
      TestEquipment: [],
      voltageLevel: [],
      stateSelect: [],
      chexked: [],
      infoColumns: [
        {
          key: "monitorDeviceId",
          title: "设备ID",
          align: "center"
        },
        {
          key: "ip",
          title: "IP地址",
          align: "center"
        },
        {
          key: "monitorDeviceName",
          title: "设备名称",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Tooltip",
                {
                  props: {
                    placement: "top",
                    content: params.row.monitorDeviceName,
                    transfer: true
                  },
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }
                },
                params.row.monitorDeviceName
              )
            ]);
          }
        },
        {
          key: "monitorDeviceType",
          title: "设备类型",
          align: "center"
        },
        {
          key: "areaName",
          title: "所在区域",
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
          key: "inspectCycle",
          title: "巡视周期",
          align: "center",
          render: (h, params) => {
            let newArr = [];
            newArr.push(
              h(
                "i-dropdown",
                {
                  props: { trigger: "click", placement: "bottom-start" },
                  style: {
                    marginLeft: "5px"
                  },
                  on: {
                    "on-click": value => {
                      console.log(value);
                    }
                  }
                },
                [
                  h(
                    "div",
                    {
                      class: {
                        member_operate_div: true
                      }
                    },
                    [
                      h(
                        "div",
                        {
                          class: {
                            table_select: true
                          }
                        },
                        [
                          h("span", params.row.inspectCycle, {
                            class: {
                              member_operate_div: true
                            }
                          }),
                          h("i", {
                            style: {
                              marginLeft: "5px"
                            },
                            class: {
                              "iconfont icon-xiala": true
                            }
                          })
                        ]
                      )
                    ]
                  ),
                  h(
                    "i-dropdownMenu",
                    {
                      slot: "list"
                    },
                    [
                      h("i-dropdownItem", {}, [
                        h(
                          "div",
                          {
                            class: {
                              alarmLevel: true
                            },
                            on: {
                              click: () => {
                                that.onClickDropdown(params.row, "1次/周", "1");
                              }
                            }
                          },
                          "1次/日"
                        )
                      ]),
                      h("i-dropdownItem", {}, [
                        h(
                          "div",
                          {
                            class: {
                              alarmLevel: true
                            },
                            on: {
                              click: () => {
                                that.onClickDropdown(params.row, "1次/周", "2");
                              }
                            }
                          },
                          "1次/周"
                        )
                      ])
                    ]
                  )
                ]
              )
            );
            return h("div", newArr);
          }
        },
        {
          key: "cycle",
          title: " ",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                class: "table_link",
                style: {
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    this.getJump(params.row);
                  }
                }
              },
              "详情"
            );
          }
        }
      ]
    };
  },
  methods: {
    handleDevice() {
      getDevice().then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            value: item.value,
            title: "titleTypeL",
            isActive: true
          };
          return obj;
        });
        console.log("------->" + map);
        console.log("------->" + map.join(","));
        this.TestEquipment = map;
        this.$forceUpdate();
        this.$refs.btnTopRef.handleCheckAllChange(true);
        this.$refs.btnTopRef.checkAll = true;
        this.$refs.btnTopRef.checkedCities = this.onSelectDevice(map);
        console.log(this.TestEquipment);
        this.getDataList();
      });
    },
    handleVoltage() {
      getVoltage().then(res => {
        const resData = res.data;
        let map = resData.map(item => {
          const obj = {
            describeName: item.label,
            value: item.value,
            title: "titleTypeC",
            isActive: true
          };
          return obj;
        });
        map.unshift({
          describeName: "所有电压等级",
          value: "",
          title: "titleTypeC"
        });
        this.voltageLevel = map;
      });
    },
    onSelectDevice(item) {
      console.log(item);
      let arr = [];
      let value = [];
      item.forEach(nr => {
        if (nr["isActive"]) {
          arr.push(nr["value"]);
          if ("describeName" in nr) value.push(nr["describeName"]);
        }
      });
      this.dataForm.deviceType = arr.join(",");
      if (this.dataForm.deviceType != "") {
        this.getDataList();
      }
      return value;
      // this.titleTypeL = item["describeName"];
    },
    onSelectVol(item) {
      if (item["value"]) this.dataForm.areaId = item["value"];
      else {
        if ("areaId" in this.dataForm) {
          delete this.dataForm["areaId"];
        }
      }
      this.getDataList();
      this.titleTypeC = item["describeName"];
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
          this.$router.push({
            path: "/surveillancePath/detailRedN",
            query: {
              monitorDeviceId: row.monitorDeviceId,
              typeId: res.data["typeId"]
            }
          });
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
    this.handleDevice();
    this.handleVoltage();
    this.getSelectStatus();
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.toConfigure {
  width: 100%;
  .icon-xiala {
    /*width: 9px;
    height: 12px;*/
  }
  .dunoMain {
    height: inherit;
    width: 100%;
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
