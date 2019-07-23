<template>
  <div class="abnormalInfoHome">
    <div class="topNav">
      <scroller :listOption="messageList"></scroller>
    </div>
    <div class="middle">
      <div class="abnormalInfo">
        <duno-main class="contain">
          <div class="iconTop">
            <img src="../../../assets/iconFunction/icon_abnormal.png" alt />
            异常信息
          </div>
          <div>
            <duno-tables-tep
              class="table_abnormalInfo"
              :columns="columns"
              :data="dataList"
              :totalNum="totalNum"
              :pageSize="pageRows"
              :current="pageIndex"
              :isShowPage="false"
              @on-select="dataListSelectionChangeHandle"
              @clickPage="pageCurrentChangeHandle"
              @on-page-size-change="pageSizeChangeHandle"
            />
          </div>
        </duno-main>
      </div>
      <div class="reportForm">
        <div class="iconTop">
          <img src="../../../assets/iconFunction/icon_statement.png" alt />
          报表
        </div>
        <div class="re-middle">
          <ReportTable />
          <ReportTable />
        </div>
        <div class="re-table">
          <duno-tables-tep
            class="table_analysis"
            :columns="RecodeColumns"
            :data="RecodeList"
            :isShowpage="false"
            @on-select="dataListSelectionChangeHandle"
            @clickPage="pageCurrentChangeHandle"
            @on-page-size-change="pageSizeChangeHandle"
          />
        </div>
      </div>
      <div class="ARRange">
        <div class="iconcen">
          <div class="iconTop">
            <img src="../../../assets/iconFunction/icon_remote.png" alt />
            AR远程协作
          </div>
          <div class="icondev">
            <img src="../../../assets/iconFunction/img_developing.png" alt />
            <p>功能开发中</p>
          </div>
        </div>
        <div class="iconcen">
          <div class="iconTop">
            <img src="../../../assets/iconFunction/icon_ar.png" alt />
            辅助操作
          </div>
          <div class="icondev">
            <img src="../../../assets/iconFunction/img_developing.png" alt />
            <p>功能开发中</p>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <div class="iconcen">
          <div class="iconTop">
            <img src="../../../assets/iconFunction/icon_weather.png" alt />
            微气象环境
          </div>
          <div class="weater">
            <div>
              <p>7月20日 周六</p>
              <p>多月 32℃/21℃</p>
            </div>
            <div>
              <span>32℃</span>
              <img src="../../../assets/iconFunction/img_cloudy.png" alt />
            </div>
          </div>
          <div class="btmWeater">
            <div>
              <img src="../../../assets/iconFunction/icon_humidity.png" alt />
              <span>相对湿度 70%</span>
            </div>
            <div>
              <img src="../../../assets/iconFunction/icon_wind.png" alt />
              <span>西北风 二级</span>
            </div>
          </div>
        </div>
        <div class="iconcen">
          <div class="iconTop">
            <img src="../../../assets/iconFunction/icon_space.png" alt />
            泛在盒子
          </div>
          <div class="icondev">
            <img src="../../../assets/iconFunction/img_developing.png" alt />
            <p>功能开发中</p>
          </div>
        </div>
      </div>
      <div class="conter iconcen">
        <div class="iconTop">
          <img src="../../../assets/iconFunction/icon_lock.png" alt />
          智能锁具
        </div>
        <div class="icondev">
          <img src="../../../assets/iconFunction/img_developing.png" alt />
          <p>功能开发中</p>
        </div>
      </div>
      <div class="right iconcen">
        <div class="iconTop">
          <img src="../../../assets/iconFunction/icon_system.png" alt />
          平台状态
        </div>
        <div>
          <duno-chart-pie-loop
            :value="[{ value: 335, name: '直接访问' }]"
            :isChange="isChange"
            :isItemEchart="isItemEchart"
            :legendOption="legendOption"
          />
        </div>
      </div>
    </div>
    <warning-setting @handleClose="onClose" :visibleOption="visibleSettingOption" />
    <wraning
      :discriminate="false"
      :hasSelect="true"
      :alarmLevel="alarmLevel"
      :visible="visible"
      warningID="20190711002"
      :monitorUrl="popData.alarmFileAddress || ''"
      :judgeResult="popData.alarmContent || ''"
      :origin="popData.monitorDeviceId"
      :handleResult="popData.dealRecord || ''"
      @handleClose="handleClose"
    />
  </div>
</template>

<script>
import Scroller from "_c/duno-m/Scroller";
import dunoMain from "_c/duno-m/duno-main";
import { DunoTablesTep } from "_c/duno-tables-tep";
import mixinViewModule from "@/mixins/view-module";
import ReportTable from "_c/duno-c/ReportTable";
import warningSetting from "_c/duno-j/warningSetting";
import wraning from "_c/duno-j/warning";
import { DunoChartPieLoop } from "_c/duno-charts/index";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import { getRecode } from "@/api/configuration/configuration.js";
export default {
  mixins: [mixinViewModule],
  name: "abnormalInfo",
  components: {
    Scroller,
    dunoMain,
    DunoTablesTep,
    ReportTable,
    DunoChartPieLoop,
    warningSetting,
    wraning
  },
  data() {
    const that = this;
    return {
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: "/lenovo-alarm/api/alarm/history",
        exportURL: "/lenovo-alarm/api/alarm/history/export"
      },
      RecodeList: [],
      popData: {},
      visibleSettingOption: false,
      visible: false,
      isItemEchart: false,
      isChange: true,
      alarmLevel: "",
      messageList: [
        {
          alarmLevel: "1",
          alarmLevelName: "危机缺陷",
          alarmTime: "2019-09-04 12:14:15",
          mainDevice: "4号主变",
          powerDeviceName: "1000千伏",
          alarmDetailType: "表面污垢",
          alarmValue: "表面污垢"
        }
      ],
      columns: [
        {
          title: "时间",
          key: "alarmTime",
          minWidth: 200,
          align: "center",
          tooltip: true
        },
        {
          title: "报警对象",
          key: "powerDeviceName",
          minWidth: 150,
          align: "center",
          tooltip: true
        },
        {
          title: "报警部位",
          key: "alarmPart",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "描述",
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
          title: " ",
          key: "id",
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
                      that.popData = params.row;
                      that.alarmLevel = params.row.alarmLevel;
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
      ],
      RecodeColumns: [
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
          minWidth: 100,
          align: "center",
          tooltip: true
        },
        {
          title: "部件/相别",
          key: "part",
          minWidth: 100,
          align: "center",
          tooltip: true
        },
        {
          title: "描述",
          key: "description",
          minWidth: 90,
          align: "center",
          tooltip: true
        }
      ],
      legendOption: {
        x: "right",
        y: "middle",
        data: ["为占用: 25%", "已占用: 75%"]
      }
    };
  },
  created() {
    this.getData();
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
    getData() {
      const that = this;
      const url = "/lenovo-alarm/api/alarm/list";
      const query = {
        pageIndex: 1,
        pageRows: 44321,
        isDeal: "0",
        deviceName: ""
      };
      getAxiosData(url, query).then(res => {
        if (res.code !== 200) {
          that.messageList = [];
          return false;
        }
        that.messageList = res.data.tableData;
      });
    },
    onClose() {
      this.visibleSettingOption = false;
    },
    handleClose() {
      this.popData = {};
      this.visible = false;
    },
    getRecodeList() {
      getRecode().then(res => {
        this.RecodeList = res.data;
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.abnormalInfoHome {
  .topNav {
    background-color: rgba(32, 62, 82, 0.8);
    height: 80px;
  }
  .middle {
    margin-top: 20px;
    overflow: hidden;
    & > div {
      float: left;
    }
    .abnormalInfo {
      width: calc(50% - 20px);
      margin-right: 20px;
      position: relative;
      //   padding-bottom: 28%;
      height: 557px;
      .contain {
        width: 100%;
        height: 100%;
        .table_abnormalInfo {
          margin-top: 20px;
        }
        .dunoMain_nr {
          padding: 20px;
          .tablesTep {
            height: 510px;
            .ivu-table {
              height: 432px;
            }
          }
        }
      }
    }
    .reportForm {
      width: calc(25% - 10px);
      margin-right: 20px;
      height: 557px;
      padding: 20px;
      background-color: rgba(32, 62, 82, 0.8);
      .re-middle {
        overflow: hidden;
        & > div:first-child {
          margin-right: 10px;
        }
        .reportTable {
          float: left;
          height: 270px;
          width: calc(50% - 5px);
        }
      }
      .re-table {
        .ivu-table {
          font-size: 12px;
        }
        .ivu-table th {
          font-size: 14px;
          height: 32px;
        }
        .ivu-table-wrapper {
          tr {
            td {
              height: 32px;
            }
          }
        }
      }
    }
    .ARRange {
      width: calc(25% - 10px);
      height: 557px;
      & > div {
        height: calc(50% - 10px);
        background-color: rgba(32, 62, 82, 0.8);
      }
      & > div:first-child {
        margin-bottom: 20px;
      }
    }
  }
  .bottom {
    margin-top: 20px;
    overflow: hidden;
    width: 100%;
    & > div {
      float: left;
    }
    .left {
      width: calc(50% - 20px);
      margin-right: 20px;
      overflow: hidden;
      & > div {
        float: left;
        height: 267px;
      }
      & > div:first-child {
        width: calc(55% - 20px);
        margin-right: 20px;
        background-image: url("../../../assets/iconFunction/img_bg_weather.jpg");
      }
      & > div:nth-child(2) {
        width: 45%;
        background-color: rgba(32, 62, 82, 0.8);
      }
      .weater {
        display: flex;
        justify-content: space-between;
        & > div:first-child {
          opacity: 0.8;
          color: #ffffff;
          margin-left: 30px;
          margin-top: 50px;
        }
        & > div:nth-child(2) {
          color: #fff;
          font-size: 30px;
          img {
            vertical-align: bottom;
          }
        }
      }
      .btmWeater {
        margin-top: 50px;
        display: flex;
        justify-content: space-between;
        & > div {
          color: #fff;
          img {
            vertical-align: bottom;
          }
        }
        & > div:first-child {
          margin-left: 25px;
        }
        & > div:nth-child(2) {
          margin-right: 11%;
        }
      }
    }
    .conter {
      width: calc(25% - 10px);
      margin-right: 20px;
      height: 267px;
      background-color: rgba(32, 62, 82, 0.8);
    }
    .right {
      height: 267px;
      width: calc(25% - 10px);
      background-color: rgba(0, 70, 101, 0.8);
      & > div:nth-child(2) {
        width: 100%;
        height: 100%;
      }
    }
  }
  .iconTop {
    color: #ffffff;
    font-size: 18px;
    line-height: 30px;
    img {
      vertical-align: top;
    }
  }
  .iconcen {
    padding: 20px;
    .icondev {
      text-align: center;
    }
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
  .icon-xiala {
    color: white;
    font-size: 13px;
  }
  .el-button--text {
    border-color: transparent !important;
    background: transparent !important;
  }
  .table_link {
    font-size: 16px;
    color: #5fafff !important;
    text-decoration: underline;
  }
  .flexPos {
    display: flex;
    align-items: center;
  }
  //-------------------表格样式
  .dunoMain {
    height: inherit;
  }
  .ivu-table {
    font-size: 14px;
  }
  .ivu-table th {
    color: #fff;
    border: none;
    height: 48px;
    background-color: #2d5980 !important;
    font-size: 16px;
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
