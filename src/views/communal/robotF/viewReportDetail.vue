<template>
  <div class="analysis-detail">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top">
      <div>{{planType=='1504'?'特殊巡视':'例行巡视'}}&nbsp;{{dataForm.taskRunHisId}}</div>
      <div class="btn">
        <div>
         <!-- <duno-btn-top
                  @on-select="onSelect"
                  class="dunoBtnTop"
                  :isCheck="false"
                  :dataList="typeList"
                  :title="titleType"
                  :showBtnList="false"
          ></duno-btn-top>-->
        </div>
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
        @on-select="dataListSelectionChangeHandle"
        @clickPage="pageCurrentChangeHandle"
        @on-page-size-change="pageSizeChangeHandle"
      />
    </duno-main>
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
      :popData="popData"
      @handleClose="handleClose"
    />
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import dunoMain from "_c/duno-m/duno-main";
import moment from "moment";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import warningSetting from "_c/duno-j/warningSetting";
import wraning from "_c/duno-j/warningB";
import mixinViewModule from "@/mixins/view-module";
import { DunoTablesTep } from "_c/duno-tables-tep";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
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
    wraning
  },
  data() {
    const that = this;
    return {
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        // getDataListURL: "/lenovo-plan/api/statistics/meter-data/list"
        getDataListURL: "/lenovo-robot/rest/reportDetail"
      },
      visibleSettingOption: false,
      visible: false,
      selectInfo: "更多",
      popData: {},
      dataForm: {},
      serious: false,
      commonly: false,
      danger: false,
      planType: "",
      value: "",
      alarmLevel: "",
      titleType: "按设备筛选",
      dataBread: ["机器人巡视","报告"],
      columns: [
        {
          title: "序号",
          type: "index",
          width: 100,
          align: "center"
        },
        {
          title: "对象",
          key: "powerDeviceName",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
              return h("div", params.row.linkArea + params.row.linkName1);
          }
        },
        {
          title: "部件/相别",
          key: "part",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
              return h("div", params.row.linkName2 + params.row.linkName3);
          }
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
          title: "拍摄来源",
          key: "monitorDeviceName",
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
          title: "图片",
          key: "fileType",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h("img", {
                attrs: { src: params.row.taskDeviceImg },
                class: "imgShow"
              })
            ]);
            return h("div", newArr);
          }
        },
        {
          title: "记录时间",
          key: "time",
          minWidth: 100,
          align: "center",
          tooltip: true
        },
        {
          title: " ",
          width: 120,
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
      ],
      typeList: [],
      regionList: [],
      statusList: [],
      popData: {},
      clcikQueryData: {},
      routeName: ''
    };
  },
  watch: {
      '$route' (to) {
          this.routeName = to.name
      },
      routeName(now){
          if(now == 'robot-twoList'){
              this.$set(this.dataBread,1,'机器人二')
          }else{
              this.$set(this.dataBread,1,'机器人一')
          }
      }
  },
  created() {
    this.dataForm.taskRunHisId = this.$route.query.taskRunHisId;
    this.planType = this.$route.query.planType;
    this.getRegion();
    this.routeName = this.$route.name
    // this.getStart();
    // this.getType();
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
    onClose() {
      this.visibleSettingOption = false;
    },
    showSetting() {
      this.visibleSettingOption = true;
    },
    onSelect(item, index) {
      this[item.title] = item["describeName"];
      if (item.title == "titleTypeL") {
        this.clcikQueryData.areaId = item.monitorDeviceType;
      } else if (item.title == "titleTypeC") {
        this.clcikQueryData.status = item.monitorDeviceType;
      } else if (item.title == "titleTypeR") {
        this.clcikQueryData.source = item.monitorDeviceType;
      }
      this.clickQuery(this.clcikQueryData);
    },
    onChangeTime(data) {
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD");
        endTime = moment(data[1]).format("YYYY-MM-DD");
      }
      this.clcikQueryData.startTime = startTime;
      this.clcikQueryData.endTime = endTime;
      this.clickQuery(this.clcikQueryData);
    },
    handleClose() {
      this.popData = {};
      this.visible = false;
    },
    restoration(row) {
      const url = "/lenovo-alarm/api/alarm/deal";
      const query = {
        alarmId: row.alarmId,
        type: "1"
      };
      postAxiosData(url, query).then(res => {
        if (res.code !== 200) {
          return this.$message.error(res.msg);
        }
        this.dataList[row._index].isReturn = "1";
        this.$message.success(res.msg);
      });
    },
    clickExcel() {
      const that = this;
      that.exportHandle();
    },
    getRegion() {
      const that = this;
      const url = "lenovo-device/api/device/select-list";
      postAxiosData(url).then(res => {
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
          describeName: "所有设备",
          monitorDeviceType: "",
          title: "titleTypeL"
        });
        this.regionList = map;
      });
    },
    getStart() {
      const that = this;
      const url = "/lenovo-device/api/monitor/status";
      postAxiosData(url).then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleTypeC"
          };
          return obj;
        });
        map.unshift({
          describeName: "所有状态",
          monitorDeviceType: "",
          title: "titleTypeC"
        });
        this.statusList = map;
      });
    },
    getType() {
      const that = this;
      const url = "/lenovo-robot/rest/reportDetailDevices";
     /* getAxiosData(url, {taskRunHisId: this.dataForm.taskRunHisId}).then(res => {
        const resData = res.data;


        this.typeList = map;
      });*/
    },
    getJump(row) {
      if (row.monitorDeviceType == "1") {
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
      }
    }
  },

};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.analysis-detail {
  width: 100%;
  .icon-xiala{
    width: 13px;
    height: 16px;
    right: 20px;
  }
  .imgShow{
    width: 100%;
    padding: 10px 10px;
    height: 62px;
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
    background: transparent !important;
  }
  .flexPos {
    display: flex;
    align-items: center;
  }
  .imgOrMv {
    width: 80%;
    height: 45px;
    position: relative;
    top: 2px;
  }
  .table_link {
    font-size: 16px;
    color: #5fafff !important;
    text-decoration: underline;
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
  .top {
    color: #ffffff;
    height: 40px;
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      font-size: 20px;
      line-height: 40px;
    }
    .btn {
      display: flex;
      justify-content: space-between;
      & > div {
        margin-left: 10px;
        .dunoBtnTop {
          width: 220px;
          display: inline-flex;
          padding-bottom: 0;
          .btnList {
            top: inherit !important;
            width: 220px;
            .title {
              padding: 8px 20px;
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
      .clickBtn {
        line-height: 40px;
        width: 139px;
        background-image: url(../../../assets/images/btn/moreBtn.png);
        text-align: center;
        font-size: 18px;
        color: #ffffff;
      }
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
          }
          .el-range-input {
            color: #fff;
          }
        }
        .el-range-editor--small.el-input__inner {
          height: 40px !important;
        }
        .el-range-editor--small .el-range__icon,
        .el-range-editor--small .el-range__close-icon {
          line-height: 35px;
        }
        .el-range-editor--small .el-range-input {
          font-size: 16px;
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
}
</style>
