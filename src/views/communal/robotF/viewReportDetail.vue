<template>
  <div class="analysis-detail">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top not-print">
      <div>{{dataForm.planName}}&nbsp;{{dataForm.executeTime}}</div>
      <div class="btn">
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
        :isShowPage='mixinViewModuleOptions.isShowPage'
        @on-select="dataListSelectionChangeHandle"
        @clickPage="pageCurrentChangeHandle"
        @on-page-size-change="pageSizeChangeHandle"
      />
    </duno-main>
    <warning-setting @handleClose="onClose" :visibleOption="visibleSettingOption" />
    <wraning
      v-if="visible"
      @on-fresh="initDataD"
      :warnData="warnData"
      :dataBread="dataBread"
      :originTitle="originTitle"
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
    <enlarge :isShow="isEnlarge" :srcData="srcData" fileType="1" @closeEnlarge="closeEnlarge" />
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import dunoMain from "_c/duno-m/duno-main";
import enlarge from "_c/duno-c/enlarge";
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
    wraning,
    enlarge
  },
  computed: {
    originTitle(){
        let str = '室外巡检机器人'
        if(this.$route.query.robotId == '9'){
          return str + '二'
        }else{
          return str + '一'
        }
    }
  },
  data() {
    const that = this;
    return {
      warnData: [],
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        // getDataListURL: "/lenovo-plan/api/statistics/meter-data/list"
        getDataListURL: "/lenovo-robot/rest/reportDetail",
        exportURL:"/lenovo-robot/rest/reportDownload"
      },
      visibleSettingOption: false,
      visible: false,
      selectInfo: "更多",
      popData: {},
      dataForm: {},
      srcData: [],
      isEnlarge: false,
      serious: false,
      commonly: false,
      danger: false,
      planType: "",
      value: "",
      alarmLevel: "",
      titleType: "按设备筛选",
      dataBread: [
        {
          path: "/realEnv/list",
          name: "操作中台"
        },
        {
          path: "/robot-one/list",
          name: "机器人巡视"
        },
        {
          path: "/robot-one/list",
          name: "室外巡检机器人"
        },
        {
          path: that.$route.query.path,
          name: that.$route.query.name
        },
        {
          path: "",
          name: `${that.$route.query.planName} ${that.$route.query.executeTime.substring(0,10)}`
        }
      ],
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
          title: "序号",
          type: "index",
          width: 100,
          align: "center"
        },

        {
          title: "对象",
          key: "powerDeviceName",
          minWidth: 180,
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
            let data = (params.row.linkName2?params.row.linkName2:'') + (params.row.linkName3?params.row.linkName3:'')
            return h("div", data?data:'/');
          }
        },
         {
          title: "描述",
          key: "desc",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
          // {
          //     title: "机器人识别",
          //     key: "valueShow",
          //     minWidth: 90,
          //     align: "center",
          //     tooltip: true,
          //     render: (h, params) => {
          //         let newArr = [];
          //         newArr.push([
          //             h(
          //                 "div",
          //                 {
          //                     class: { redFont: !params.row.warnLevel},
          //                 },
          //                 params.row.valueShow
          //             )
          //         ]);
          //         return h(
          //             "div",
          //             {

          //             },
          //             newArr
          //         );
          //     }
          // // },
          // {
          //     title: "音视识别",
          //     key: "yinShiResult",
          //     minWidth: 90,
          //     align: "center",
          //     tooltip: true,
          //     render: (h, params) => {
          //         let newArr = [];
          //         newArr.push([
          //             h(
          //                 "div",
          //                 {
          //                     class: { redFont: !params.row.warnLevel},
          //                 },
          //                 params.row.yinShiResult
          //             )
          //         ]);
          //         return h(
          //             "div",
          //             {

          //             },
          //             newArr
          //         );
          //     }
          // },
         {
          title: "结果",
          key: "realResult",
          minWidth: 90,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h(
                  "div",
                  {
                  },
                  params.row.realResult
              )
            ]);
            return h(
                "div",
                {

                },
                newArr
            );
          }
        },
          {
          title: "缺陷等级",
          key: "warnContent",
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
                          serious: params.row.warnLevel === "2",
                          commonly: params.row.warnLevel === "1",
                          danger: params.row.warnLevel === "3"
                        }
                      },
                      [
                        h("span", this.cutOut(params.row.warnContent), {
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
            if(params.row.warnContent){
                return h("div", newArr);
            }else{
                return h("div", '/');
            }
          }
        },
        /*   {
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
        },*/
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
                class: "imgShow",
                on: {
                  click: () => {
                    that.isEnlarge = true;
                    params.row.fileType = "1";
                    that.srcData = params.row;
                  }
                }
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
                      that.initDD(params.row.id);
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
      taskDeviceId: "",
      clcikQueryData: {},
      routeName: ""
    };
  },
  watch: {
    $route(to) {
      this.routeName = to.name;
    },
    routeName(now) {
    /*  if (now == "robot-twoList") {
        this.$set(this.dataBread, 2, { name: "机器人", path: "" });
      } else {
        this.$set(this.dataBread, 2, { name: "机器人", path: "" });
      }*/
    }
  },
  created() {
    let that = this
    this.getWidth();
    this.dataForm.taskRunHisId = this.$route.query.taskRunHisId?this.$route.query.taskRunHisId:'';
    that.dataForm.planName = that.$route.query.planName
    try {
        that.dataForm.executeTime = that.$route.query.executeTime.substring(
          0,
          10
        );
      } catch (e) {}
    // this.planType = this.$route.query.planType;
    // if (this.planType == "1501") this.planType = "全面巡视";
    // else if (this.planType == "1502") this.planType = "例行巡视";
    // else if (this.planType == "1503") this.planType = "专项巡视";
    // else if (this.planType == "1504") this.planType = "特殊巡视";
    this.getRegion();
    // this.initDataD()
    this.routeName = this.$route.name;
    // this.getStart();
    // this.getType();
  },
  methods: {
    selectDownloadType(item) {
      const that = this;
      that.queryForm.taskRunHisId = that.$route.query.taskRunHisId
      that.queryForm.planId = that.$route.query.planId;
      that.queryForm.startTime = that.$route.query.startTime;
      that.queryForm.endTime = that.$route.query.endTime;
      that.queryForm.type = item.monitorDeviceType;
      that.exportHandle();
    },
    getWidth() {
      let screen = window.screen.availWidth;
      if (screen > 3500) {
        this.columns.splice(7, 1);
      }
    },
    initDD(taskDeviceId) {
      this.taskDeviceId = taskDeviceId;
      this.initDataD();
    },
    initDataD() {
      postAxiosData("/lenovo-robot/rest/taskCurLink", {
        taskDeviceId: this.taskDeviceId
      }).then(res => {
        this.warnData = res.data;
      });
      this.getDataList()
    },
    closeEnlarge() {
      this.isEnlarge = false;
    },
    cutOut(data) {
      if (data) {
        const index = data.indexOf("缺陷");
        if (index > -1) {
          data = data.substring(0, index);
        }
        return data;
      } else {
        return "/";
      }
    },
    onClickDropdown(row, type, No) {
      const index = row._index;
      this.dataList[index].warnContent = type;
      this.dataList[index].warnLevel = No;
      this.psotAlarmData(row, type, No);
    },
    psotAlarmData(row, type, No) {
      const that = this;
      const url = "/lenovo-robot/rest/manualJudge";
      let oldLevel;
      if (row.warnLevel == "1") {
        oldLevel = "一般";
      } else if (row.warnLevel == "2") {
        oldLevel = "严重";
      } else {
        oldLevel = "危急";
      }
      const query = {
        manualAlarmLevel: No,
        taskDeviceId: row.id
      };
        postAxiosData(url, query).then(
        res => {
          if (res.code != 200) {
            this.dataList[index].warnLevel = row.warnLevel;
            this.dataList[index].warnContent = row.warnContent;
            return that.$message.error(res.msg);
          }
          that.$message.success(res.msg);
        },
        error => {
            this.dataList[index].warnLevel = row.warnLevel;
            this.dataList[index].warnContent = row.warnContent;
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
   /*   const that = this;
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
      });*/
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
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.analysis-detail {
  width: 100%;
  .icon-xiala {
    /* width: 13px;
    height: 16px;*/
    right: 20px;
  }
  .imgShow {
    /*width: 189px;*/
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
    padding: 36px 18px;
  }
  .table_select {
    cursor: pointer;
    color: white;
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
          width: 166px;
          display: inline-flex;
          padding-bottom: 0;
          .btnList {
            top: inherit !important;
            width: 166px;
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
.redFont{
  color: red;
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
