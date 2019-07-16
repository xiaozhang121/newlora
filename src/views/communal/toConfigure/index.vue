<template>
  <div class="toConfigure">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top">
      <div>检测设备管理</div>
      <div class="btn">
        <div>
          <duno-btn-top
            @on-select="onSelectDevice"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="TestEquipment"
            :title="titleTypeL"
            :showBtnList="false"
          ></duno-btn-top>
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
        activatedIsNeed: true,
        getDataListURL: "/lenovo-device/api/monitor/device-list"
      },
      dataForm: {},
      radio: "1",
      value: "",
      totalNum: 500,
      titleTypeL: "所有监测设备",
      titleTypeC: "所有电压等级",
      titleTypeR: "所有状态",
      dataBread: ["操作中台", "配置管理", "检测设备管理"],
      dataList: [
        {
          id: "可见光54536",
          area: "500千伏"
        },
        {
          id: "可见光54536",
          area: "500千伏"
        },
        {
          id: "可见光54536",
          area: "500千伏"
        },
        {
          id: "可见光54536",
          area: "500千伏"
        },
        {
          id: "可见光54536",
          area: "500千伏"
        },
        {
          id: "可见光54536",
          area: "500千伏"
        },
        {
          id: "可见光54536",
          area: "500千伏"
        },
        {
          id: "可见光54536",
          area: "500千伏"
        },
        {
          id: "可见光54536",
          area: "500千伏"
        }
      ],
      TestEquipment: [],
      voltageLevel: [
        {
          describeName: "1000千伏"
        },
        {
          describeName: "500千伏"
        },
        {
          describeName: "220千伏"
        },
        {
          describeName: "110千伏"
        },
        {
          describeName: "35千伏"
        },
        {
          describeName: "10千伏"
        }
      ],
      stateSelect: [
        {
          describeName: "开启"
        },
        {
          describeName: "关闭"
        }
      ],
      infoColumns: [
        {
          key: "monitorDeviceId",
          title: "设备ID",
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
            newArr.push([h("span", { draggable: true }, params.row.statusName)]);
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
                                that.selectInfo = "每日1次";
                              }
                            }
                          },
                          "每日1次"
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
                                that.selectInfo = "每周1次";
                              }
                            }
                          },
                          "每周1次"
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
                style: {
                  borderRadius: "15px",
                  background: "#3a81a1",
                  width: "90px",
                  lineHeight: "30px",
                  margin: "auto"
                }
              },
              "手动配置"
            );
          }
        }
      ]
    };
  },
  methods: {
    handleDevice() {
      getAxiosData("/lenovo-device/api/area/select-list").then(res => {
        if (res.code !== 200) {
          that.dataList = [];
          that.totalNum = 0;
          return that.$message.error(res.msg);
        }
        this.TestEquipment = res.data;
      });
    },
    // handleVoltage() {
    //   getAxiosData("/lenovo-plan/api/list/monitor-device-type").then(res => {
    //     if (res.code !== 200) {
    //       that.dataList = [];
    //       that.totalNum = 0;
    //       return that.$message.error(res.msg);
    //     }
    //     this.TestEquipment = res.data;
    //   });
    // },
    onSelectDevice(item) {
      this.dataForm.deviceType = item["describeName"];
      this.getDataList();
      this.titleTypeL = item["describeName"];
    },
    onSelectVol(item) {
      this.dataForm.areaId = item["describeName"];
      this.getDataList();
      this.titleTypeC = item["describeName"];
    },
    onSelectState(item) {
      this.dataForm.status = item["describeName"];
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
    }
  },
  mounted() {
    this.handleDevice();
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.toConfigure {
  width: 100%;
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
      font-size: 18px;
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
