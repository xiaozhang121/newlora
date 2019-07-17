<template>
  <div class="analysis">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="dunoDrap">
      <div>表计分析</div>
      <div class="selectBtn">
        <div>
          <duno-btn-top
            @on-select="onSelectAmmeter"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="ammeterData"
            :title="titleAmmeter"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <duno-btn-top
            @on-select="onSelectParts"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="partsData"
            :title="titleParts"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <duno-btn-top
            @on-select="onSelectPhase"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="phaseData"
            :title="titlePhase"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
      </div>
    </div>
    <div class="echarts">
      <div class="title">
        <div>泄露电流表24小时温度分析</div>
        <div>
          <div>
            <duno-btn-top
              @on-select="onSelectByDay"
              class="dunoBtnTop"
              :isCheck="false"
              :dataList="ByDayData"
              :title="titleByDay"
              :showBtnList="false"
            ></duno-btn-top>
          </div>
          <div>
            <duno-btn-top
              @on-select="onSelectDate"
              class="dunoBtnTop"
              :isCheck="false"
              :dataList="dateData"
              :title="titleDate"
              :showBtnList="false"
            ></duno-btn-top>
          </div>
        </div>
      </div>
      <duno-charts
        :isChange="isChangeFlag"
        :isItemEchart="isItemEchart"
        :legendOption="legendOption"
        :xAxisOption="xAxisOption"
        :yAxisOption="yAxisOption"
        :gridOption="gridOption"
        :seriesOption="seriesOption"
      />
    </div>
    <div class="btn">
      <div>最新记录</div>
      <div>查看更多 ></div>
    </div>
    <div class="table">
      <duno-tables-tep
        class="table_analysis"
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
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import { DunoCharts } from "_c/duno-charts";
import { DunoTablesTep } from "_c/duno-tables-tep";
import mixinViewModule from "@/mixins/view-module";
import { getEchartsData } from "@/api/configuration/configuration.js";
export default {
  name: "analysis",
  mixins: [mixinViewModule],
  components: {
    Breadcrumb,
    dunoBtnTop,
    DunoCharts,
    DunoTablesTep
  },
  data() {
    return {
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: "/lenovo-plan/api/statistics/meter-data/list"
      },
      titleAmmeter: "泄露电流表",
      titleParts: "主设备名-部件名",
      titlePhase: "选择相别",
      titleByDay: "按日",
      titleDate: "今日",
      ammeterData: [],
      partsData: [],
      phaseData: [],
      ByDayData: [],
      dateData: [],
      echartsData: [],
      dataBread: ["视频监控", "所有报表", "表计分析"],
      isChangeFlag: true,
      isItemEchart: true,
      //   titleOption: {
      //     text: "泄露电流表24小时温度分析",
      //     x: "center",
      //     y: "20",
      //     textStyle: {
      //       color: "#fff",
      //       fontWeight: "normal"
      //     }
      //   },
      legendOption: {
        icon: "circle",
        y: "20",
        textStyle: {
          color: "#fff"
        },
        data: ["4号主变1000千伏侧压变B相", "4号主变1000千伏侧压变C相"]
      },
      gridOption: {
        top: "80"
      },
      xAxisOption: {
        type: "category",
        name: "(时)",
        axisLine: {
          show: true, //x轴的线
          lineStyle: {
            color: ["#999"]
          }
        },
        // 控制网格线是否显示
        splitLine: {
          show: false,
          lineStyle: {
            color: ["#999"]
          }
        },
        //除去x轴刻度
        axisTick: {
          show: false
        },
        data: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24"
        ]
      },
      yAxisOption: {
        type: "value",
        name: "(温度℃)",
        max: 100,
        min: 0,
        splitNumber: 5,
        // boundaryGap: ["0", "2"],
        axisLine: {
          show: true, //Y轴的线
          lineStyle: {
            color: ["#999"]
          }
        },
        // 控制网格线是否显示
        splitLine: {
          show: true,
          lineStyle: {
            //网格颜色
            color: ["#999"]
          }
        },
        axisTick: {
          show: false
        }
      },
      seriesOption: [
        {
          name: "4号主变1000千伏侧压变B相",
          type: "line",
          data: [
            30,
            42,
            75,
            25,
            45,
            86,
            35,
            56,
            56,
            23,
            48,
            12,
            45,
            89,
            25,
            35,
            46,
            48,
            56,
            45,
            78,
            12
          ]
        },
        {
          name: "4号主变1000千伏侧压变C相",
          type: "line",
          data: [
            56,
            35,
            35,
            42,
            36,
            56,
            76,
            45,
            25,
            86,
            48,
            68,
            45,
            75,
            25,
            55,
            44,
            33,
            56,
            45,
            25,
            12
          ]
        }
      ],
      columns: [
        {
          title: "时间",
          key: "date",
          minWidth: 100,
          align: "center",
          tooltip: true
        },
        {
          title: "对象",
          key: "powerDeviceName",
          minWidth: 120,
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
          key: "description",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "缺陷等级",
          key: "alarmLevel",
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
          key: "monitorDeviceId",
          minWidth: 150,
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
                      console.log("摄像头ID：", params.row.monitorDeviceId);
                    }
                  }
                },
                params.row.monitorDeviceId
              )
            ]);
            return h("div", { class: { member_operate_div: true } }, newArr);
          }
        },
        {
          title: "数据",
          key: "resultValue",
          minWidth: 90,
          align: "center",
          tooltip: true
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
                h("i", {
                  class: "iconfont icon-tupian"
                })
              ]);
            } else if (params.row.fileType == "2") {
              newArr.push([
                h("i", {
                  class: "iconfont icon-bofang"
                })
              ]);
            }
            return h("div", newArr);
          }
        },
        {
          title: " ",
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
      ]
    };
  },
  watch:{

  },
  methods: {
    cutOut(data) {
      if (data) {
        const index = data.indexOf("缺陷");
        if (index > -1) {
          data = data.substring(0, index);
        }
        return data;
      } else {
        return "无";
      }
    },
    onSelectAmmeter(item) {
      this.titleAmmeter = item["describeName"];
    },
    onSelectParts(item) {
      this.titleParts = item["describeName"];
    },
    onSelectPhase(item) {
      this.titlePhase = item["describeName"];
    },
    onSelectByDay(item) {
      this.titlePhase = item["describeName"];
    },
    onSelectDate(item) {
      this.titlePhase = item["describeName"];
    },
    getEcharts() {
      let that = this;
      getEchartsData().then(res => {
        that.echartsData = res.data.deviceList;
      });
    },
    dataListSelectionChangeHandle() {},
    pageCurrentChangeHandle() {},
    pageSizeChangeHandle() {}
  },
  mounted() {
    this.getEcharts();
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.analysis {
  .dunoDrap {
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      margin-top: 20px;
      margin-bottom: 20px;
      font-size: 18px;
      color: #ffffff;
    }
    .selectBtn {
      display: flex;
      justify-content: space-between;
      width: 575px;
      margin-top: 14px;
      height: 50px;
      .dunoBtnTop {
        width: 185px;
        display: inline-flex;
        padding-bottom: 0;
        height: 40px;
        .btnList {
          top: inherit !important;
          width: 185px;
          .title {
            padding: 8px 20px;
          }
          .btnNr {
            color: white;
          }
        }
      }
    }
  }
  .echarts {
    overflow: hidden;
    height: 340px;
    background-color: #142838;
    .chartBox {
      height: 300px;
      .charts {
        height: 300px;
      }
    }
    .title {
      overflow: hidden;
      margin-top: 20px;
      & > div {
        float: left;
      }
      & > div:first-child {
        width: 85%;
        // text-align: center;
        padding-left: 43%;
        font-size: 18px;
        color: #fff;
      }
      & > div:nth-child(2) {
        width: 15%;
        overflow: hidden;
        & > div {
          float: left;
          width: calc(50% - 5px);
          .dunoBtnTop {
            padding-bottom: 0;
            .btnList {
              background: rgba(0, 0, 0, 0);
              width: 115px;
              top: 133px;
              .title {
                margin-top: 0;
                background: rgba(0, 0, 0, 0);
                & > div {
                  font-size: 16px;
                }
              }
            }
            .icon-xiala {
              height: 22px;
              right: 3px;
              top: 8px;
            }
          }
        }
      }
    }
  }
  .btn {
    margin-top: 25px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      line-height: 40px;
      color: #ffffff;
      font-size: 20px;
    }
    & > div:nth-child(2) {
      line-height: 40px;
      width: 139px;
      background-image: url(../../../assets/images/btn/moreBtn.png);
      text-align: center;
      font-size: 18px;
      color: #ffffff;
    }
  }
  //
  .el-button--text {
    border-color: transparent !important;
    background: transparent !important;
  }
  .table_link {
    font-size: 16px;
    color: #5fafff !important;
    text-decoration: underline;
  }
  .table_select {
    cursor: pointer;
    // color: #1d1f26;
    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 30px;
      color: #fff;
      border-radius: 20px;
    }
    &.serious {
      span {
        color: #1d1f26;
        background: #f4a723;
      }
    }
    &.commonly {
      span {
        color: #1d1f26;
        background: #5eb0fc;
      }
    }
    &.danger {
      span {
        color: #1d1f26;
        background: #d0011b;
      }
    }
  }
  //-------------------表格样式
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
}
</style>
