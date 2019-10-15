<template>
  <div class="duno-reportDetailR">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="dunoDrap">
      <div>全面巡视任务详情</div>
      <div class="selectBtn">
        <div style="visibility: hidden">
          <duno-btn-top
                  @on-select="onSelect"
                  class="dunoBtnTop"
                  :isCheck="false"
                  :dataList="inspectionData"
                  :title="titleValue"
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
            :popData="popData"
            :visible="visible"
            :detailsType="detailsType"
            @handleClose="handleClose"
    />
    <enlarge :isShow="isEnlarge" :srcData="srcData" @closeEnlarge="closeEnlarge" />
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
    import wraning from "_c/duno-j/warning";
    import mixinViewModule from "@/mixins/view-module";
    import { DunoTablesTep } from "_c/duno-tables-tep";
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
    const that = this;
    export default {
        name: "ReportFrom",
        mixins: [mixinViewModule],
        components: {
            wraning,
            Breadcrumb,
            dunoBtnTop,
            dunoMain,
            enlarge,
            KeyMonitor,
            warningSetting,
            DunoTablesTep
        },
        props: {
            url: {
                type: String,
                default: () => {
                    return "/lenovo-plan/api/statistics/plan/download";
                }
            }
        },
        data() {
            return {
                columns:[
                    {
                        title: "序号",
                        type: "index",
                        minWidth: 80,
                        align: "center"
                    },
                    {
                        title: "类型",
                        key: "planType",
                        minWidth: 180,
                        align: "center",
                        tooltip: true
                    },
                    {
                        title: "名称",
                        key: "planName",
                        minWidth: 180,
                        align: "center",
                        tooltip: true
                    },
                    {
                        title: "时间",
                        key: "date",
                        minWidth: 180,
                        align: "center",
                        tooltip: true
                    },
                    {
                        title: "时长",
                        key: "timeLong",
                        minWidth: 120,
                        align: "center",
                        tooltip: true
                    },
                    {
                        title: "异常数",
                        key: "alarmNum",
                        minWidth: 120,
                        align: "center",
                        tooltip: true
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
                                                this.$router.push({
                                                    name: "configure-view",
                                                    query: {
                                                        planId: params.row.planId,
                                                        planType: params.row.planType,
                                                        batchId: params.row.batchId,
                                                        url: "/lenovo-plan/api/statistics/plan/view"
                                                    }
                                                });
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
                pageRows: 20,
                mixinViewModuleOptions: {
                    getDataListURL: "/lenovo-plan/api/statistics/plan/report/list",
                    exportURL: ""
                },
                dataBread: [
                    { path: "/realEnv/list", name: "操作中台" },
                    { path: "/configuration/list", name: "配置管理" },
                    { path: "/configuration/list", name: "任务配置" },
                    { path: "", name: "查看报表" }
                ],
                loadingOption: false,
                timer: null,
                titleValue: "所有巡检报表",
                value: "",
                title: "",
                pageIndex: 1,
                totalRows: 1,
                dataList: [],
                dataForm: {},
                inspectionData: []
            };
        },
        watch: {
            dataList: {
                handler(now) {
                    if (now.length || now.length == 0) {
                        this.loadingOption = false;
                        clearTimeout(this.timer);
                    }
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            onSelect(item) {
                this.titleValue = item["describeName"];
                this.dataForm.planType = item["monitorType"];
                this.getDataList();
            },
            onChangeTime(data) {
                let startTime = "";
                let endTime = "";
                if (data) {
                    startTime = moment(data[0]).format("YYYY-MM-DD 00:00:00");
                    endTime = moment(data[1]).format("YYYY-MM-DD 23:59:59");
                }
                this.dataForm.startTime = startTime;
                this.dataForm.endTime = endTime;
                this.getDataList();
            },
            getPlayTypeData() {
                /* getPlayType().then(res => {
                     const resData = res.data;
                     const map = resData.map(item => {
                         const obj = {
                             describeName: item.label,
                             monitorType: item.value,
                             title: "titleType"
                         };
                         return obj;
                     });
                     map.unshift({
                         describeName: "所有类型",
                         monitorType: "",
                         title: "titleType"
                     });
                     this.inspectionData = map;
                 });*/
            }
        },
        mounted() {
            console.log(this.$route.name);
            this.getPlayTypeData();
            this.getDataList();
        },
        created() {
            this.loadingOption = true;
            this.timer = setTimeout(() => {
                this.loadingOption = false;
            }, 1000000000);
            this.title = this.$route.query.title;
            this.dataForm = { planId: this.$route.query.planId };
        }
    };
</script>

<style lang="scss">
  .duno-reportDetailR {
    width: 100%;
    //   min-height: 100%;
    height: 100%;
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
          @media screen and (min-width: 3500px) {
            height: 50px;
            font-size: 13px;
          }
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
      background: transparent;
    }
    .el-button:hover {
      background-color: rgba(0, 0, 0, 0);
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

      text-align: center;
      display: inline-block;
      // width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
      @media screen and (min-width: 3500px) {
        height: 35px;
      }
      & > div:first-child {
        font-size: 20px;
        line-height: 40px;
        @media screen and (min-width: 3500px) {
          font-size: 16px;
          line-height: 35px;
        }
      }
      .btn {
        display: flex;
        justify-content: space-between;
        & > div {
          margin-left: 10px;
          // .dunoBtnTop {
          //   width: 250px;
          //   display: inline-flex;
          //   padding-bottom: 0;
          //   .btnList {
          //     top: inherit !important;
          //     width: 250px;
          //     .title {
          //       padding: 8px 20px;
          //       @media screen and (min-width: 3500px) {
          //         height: 35px;
          //       }
          //     }
          //   }
          // }
        }
      }
    }
    .icon-xiala {
      color: white;
      font-size: 13px;
    }
    .el-loading-mask {
      width: 100% !important;
    }
    .el-loading-text {
      color: #969696 !important;
    }
    .dunoDrap {
      display: flex;
      justify-content: space-between;
      & > div:first-child {
        margin-top: 20px;
        margin-bottom: 20px;
        font-size: 20px;
        color: #ffffff;
      }
      .selectBtn {
        display: flex;
        justify-content: space-between;
        width: 545px;
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
            }
            .el-range-input {
              color: #fff;
            }
          }
          .el-range-editor--small.el-input__inner {
            height: 40px;
          }
          .el-range-editor--small .el-range-input {
            font-size: 16px;
          }
        }
      }
    }
    .dunoMain {
      // min-height: 100%;
      height: auto !important;
      margin-bottom: 20px;
      .el-pagination {
        text-align: center;
        margin-bottom: 20px;
      }
      .el-pager li {
        background: rgba(0, 0, 0, 0);
        color: #fff;
      }
      .el-pager li.active {
        color: #5fafff;
        border-bottom: 1px solid #2d8cf0;
      }
      .el-pagination .btn-prev,
      .el-pagination .btn-next {
        background-color: rgba(0, 0, 0, 0);
        color: #ffffff;
      }
    }
    .task {
      padding: 20px 0 0 20px;
      width: 100%;
      overflow: hidden;
      & > div {
        width: calc(20% - 20px);
        float: left;
        height: 405px;
        margin-right: 20px;
        img {
          height: 173px;
        }
      }
    }
    //分页--
    .el-pagination {
      color: #fff;
      display: flex;
      justify-content: center;
    }
    .el-pagination .btn-prev,
    .el-pagination .btn-next {
      background-color: rgba(0, 0, 0, 0);
      color: #142838;
    }
    .el-pager li {
      background-color: rgba(0, 0, 0, 0);
    }
    .el-pager li.active {
      color: #5fafff;
    }
    .el-pager li.btn-quicknext,
    .el-pager li.btn-quickprev {
      color: #fff;
    }
    //--
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

