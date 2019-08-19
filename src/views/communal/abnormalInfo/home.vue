<template>
  <div class="abnormalInfoHome">
    <div class="topNav">
      <scroller :listOption="messageList"></scroller>
    </div>
    <div class="middle not-print">
      <div class="abnormalInfo">
        <div class="contain borderTX">
          <duno-main :controlOver="true" class="main_contain">
            <div class="iconTop pointer" @click="getIn">
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
      </div>
      <div class="reportForm">
        <div class="contain borderTX">
          <duno-main :controlOver="true" class="main_contain">
            <div class="iconTop">
              <img src="../../../assets/iconFunction/icon_statement.png" alt />
              报表
            </div>
            <div
              class="re-middle"
              v-loading="loadingOption"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              element-loading-text="加载中"
            >
              <ReportTable
                v-for="(item,index) in mockData"
                :key="index"
                :url="url"
                :reportData="item"
              />
            </div>
            <div class="re-table">
              <duno-tables-tep
                class="table_analysis"
                :columns="RecodeColumns"
                :data="RecodeList"
                :isShowPage="false"
                @on-select="dataListSelectionChangeHandle"
                @clickPage="pageCurrentChangeHandle"
                @on-page-size-change="pageSizeChangeHandle"
              />
            </div>
          </duno-main>
        </div>
      </div>
      <!-- <div class="ARRange">
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
            AR辅助操作
          </div>
          <div class="icondev">
            <img src="../../../assets/iconFunction/img_developing.png" alt />
            <p>功能开发中</p>
          </div>
        </div>
      </div>-->
    </div>
    <!-- <div class="bottom">
      <div class="left">
        <div class="iconcen">
          <div class="iconTop">
            <img src="../../../assets/iconFunction/icon_weather.png" alt />
            微气象环境
          </div>
          <div class="weater">
            <div>
              <p>7月20日 周六</p>
              <p>多云 32℃/21℃</p>
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
            :value="[
                {value:25, name:'25%', itemStyle: {
                normal: {
                    color: '#53cbc3'
                }
            }},
                {value:75, name:'75%', itemStyle: {
                normal: {
                    color: '#1b6697'
                }
            }},
            ]"
            radiusOption="80%"
            paddingBottom="45%"
            :centerOption="['30%', '50%']"
            :isChange="isChange"
            :isItemEchart="isItemEchart"
            :legendOption="legendOption"
          />
        </div>
      </div>
    </div>-->
    <warning-setting @handleClose="onClose" :visibleOption="visibleSettingOption" />
    <wraning :popData="popData" detailsType="alarm" :visible="visible" @handleClose="handleClose" />
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
  computed: {
    isAlarm() {
      return this.$store.state.user.isAlarm;
    }
  },
  watch: {
    isAlarm: {
      handler(now) {
        this.getData();
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    const that = this;
    return {
      loadingOption: true,
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: "/lenovo-alarm/api/alarm/history",
        exportURL: "/lenovo-alarm/api/alarm/history/export"
      },
      url: {
        downloadUrl: "/lenovo-plan/api/statistics/plan/download",
        viewUrl: "/lenovo-plan/api/statistics/plan/view"
      },
      RecodeList: [],
      popData: {},
      visibleSettingOption: false,
      visible: false,
      isItemEchart: true,
      isChange: true,
      alarmLevel: "",
      messageList: [],
      handleNotes: [],
      alarmType: "",
      mockData: [],
      columns: [
        {
          title: "时间",
          key: "alarmTime",
          minWidth: 150,
          align: "center",
          tooltip: true
        },
        {
          title: "报警对象",
          key: "mainDevice",
          minWidth: 150,
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
          key: "monitorDeviceName",
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
        orient: "vertical",
        top: "40%",
        right: "7%",
        itemGap: 40,
        textStyle: {
          color: "white",
          fontSize: 15,
          padding: [0, 0, 0, 4]
        },
        formatter: function(name) {
          if (name == "25%") {
            return "未占用：" + name;
          } else {
            return "已占用：" + name;
          }
        },
        data: ["25%", "75%"]
      }
    };
  },
  created() {
    this.getRecodeList();
    this.getData();
    this.getMockData();
  },
  methods: {
    getMockData() {
      let url = "/lenovo-plan/api/statistics/plan/list";
      let query = {
        pageIndex: 1,
        pageRows: 2
      };
      getAxiosData(url, query).then(res => {
        this.mockData = res.data.tableData;
        this.loadingOption = false;
      });
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
      this.psotAlarmData(row, type, No);
    },
    psotAlarmData(row, type, No) {
      const that = this;
      const url = "/lenovo-alarm/api/alarm/level-edit";
      let oldLevel;
      if (row.alarmLevel == "1") {
        oldLevel = "一般";
      } else if (row.alarmLevel == "2") {
        oldLevel = "严重";
      } else {
        oldLevel = "危急";
      }
      const query = {
        id: row.id,
        alarmLevel: No,
        oldLevel: oldLevel,
        newLevel: type,
        userName: this.$store.state.user.userName
      };
      debugger;
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
        pageRows: 10,
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
        this.RecodeList = res.data.tableData.slice(0, 3);
      });
    },
    getIn() {
      this.$router.push({
        path: "/abnormalInfoPath/list"
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.abnormalInfoHome {
  height: 80%;
  .el-loading-text {
    color: #969696 !important;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .borderTX {
  }
  .main_contain {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 10px;
    background: rgba(20, 40, 56, 0.8);
  }
  .topNav {
    background-color: rgba(20, 40, 56, 0.8);
    height: 80px;
  }
  .middle {
    margin-top: 20px;
    overflow: hidden;
    height: 100%;
    & > div {
      float: left;
    }
    .abnormalInfo {
      width: calc(60% - 10px);
      margin-right: 20px;
      position: relative;
      // height: 557px;
      padding: 2px;
      height: 100%;
      .ivu-table-cell {
        padding-left: 0;
        padding-right: 0;
      }
      .contain {
        padding: 20px;
        width: 100%;
        height: 100%;
        background-color: rgba(20, 40, 56, 0.8);
        border: 2px solid transparent;
        transition: border 0.5s;
        &:hover {
          border: 2px solid white;
          transition-duration: 0.5s;
        }
        .pointer {
          cursor: pointer;
        }
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
      position: relative;
      width: calc(40% - 10px);
      // margin-right: 20px;
      padding: 2px;
      height: 100%;
      background-color: rgba(20, 40, 56, 0.8);
      .contain {
        padding: 20px;
        width: 100%;
        height: 100%;
        border: 2px solid transparent;
        transition: border 0.5s;
        &:hover {
          border: 2px solid white;
          transition-duration: 0.5s;
        }
      }
      .re-middle {
        overflow: hidden;
        margin-top: 20px;
        height: 380px;
        & > div:last-child {
          margin-right: 0;
        }
        .reportTable {
          float: left;
          // height: 270px;
          height: 100%;
          margin-right: 20px;
          width: calc(50% - 10px);
          .content {
            padding: 10px;
            h3 {
              margin-bottom: 5px;
              font-size: 14px;
            }
            p {
              font-size: 12px;
            }
          }
          .btn {
            div {
              font-size: 12px;
            }
          }
        }
      }
      .re-table {
        margin-top: 20px;
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
        background-size: 100% 100%;
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
        height: 88%;
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
