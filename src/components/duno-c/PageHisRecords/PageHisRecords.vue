<template>
  <div class="pageHisRecords">
    <div class="top">
      <div>{{titleCode.securityRecord}}</div>
      <div class="btn">
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="typeSelect"
            :title="titleType"
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
        <div>
          <div @click="clickExcel">
            <i class="iconfont icon-tuisong"></i>
            导出表格
          </div>
        </div>
      </div>
    </div>
    <div class="tables">
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
    </div>
  </div>
</template>

<script>
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import { DunoTablesTep } from "_c/duno-tables-tep";
import mixinViewModule from "@/mixins/view-module";
import moment from "moment";
import { alarmType, addReturn } from "@/api/configuration/configuration.js";
export default {
  name: "PageHisRecords",
  mixins: [mixinViewModule],
  components: {
    dunoBtnTop,
    DunoTablesTep
  },
  props: {
    areaId: {
      type: Number,
      default: null
    },
    titleCode: {
      type: Object,
      default: {}
    },
    infoColumns: {
      type: Array,
      default: () => {
        return [
          {
            key: "alarmId",
            title: "拍摄时间",
            align: "center"
          },
          {
            key: "alarmType",
            title: "告警类型",
            align: "center"
          },
          {
            key: "monitorDeviceId",
            title: "拍摄来源",
            align: "center",
            render: (h, params) => {
              let newArr = [];
              newArr.push([
                h(
                  "a",
                  {
                    class: "table_link",
                    props: { type: "text" },
                    on: { click: () => {} }
                  },
                  params.row.monitorDeviceId
                )
              ]);
              return h("div", { class: { member_operate_div: true } }, newArr);
            }
          },
          {
            key: "dataType",
            title: "处理记录",
            align: "center"
          },
          {
            key: "content",
            title: "处理时间",
            align: "center"
          },
          {
            title: "视频/图片",
            key: "id",
            minWidth: 120,
            align: "center",
            tooltip: true,
            render: (h, params) => {
              let newArr = [];
              if (params.row.fileType == "1") {
                newArr.push([
                  h("img", {
                    class: "imgOrMv",
                    attrs: { src: params.row.alarmFileAddress },
                    draggable: false
                  })
                ]);
              } else if (params.row.fileType == "2") {
                newArr.push([
                  h("video", {
                    class: "imgOrMv",
                    attrs: { src: params.row.alarmFileAddress },
                    draggable: false
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
              if (params.row.isReturn == "0") {
                newArr.push(
                  h(
                    "el-button",
                    {
                      class: "btn_pre",
                      style: { background: "#305e83!important" },
                      props: { type: "text" },
                      on: {
                        click: () => {
                          that.addReturn(params.row);
                        }
                      }
                    },
                    "复归"
                  )
                );
              }
              if (params.row.isReturn == "1") {
                newArr.push(
                  h(
                    "el-button",
                    {
                      class: "btn_pre",
                      style: { background: "#305e83!important" },
                      props: { type: "text" },
                      on: {
                        click: () => {
                          console.log(111);
                        }
                      }
                    },
                    "已复归"
                  )
                );
              }
              newArr.push(
                h(
                  "el-button",
                  {
                    class: "btn_pre",
                    style: { background: "#3a81a1!important" },
                    props: { type: "text" },
                    on: {
                      click: () => {
                        console.log(111);
                      }
                    }
                  },
                  "备注"
                )
              );
              return h("div", newArr);
            }
          }
        ];
      }
    }
  },
  data() {
    return {
      mixinViewModuleOptions: {
        activatedIsNeed: false,
        getDataListURL: "/lenovo-alarm/api/security/list",
        exportURL: "/lenovo-alarm/api/alarm/history/export"
      },
      value: "",
      titleType: "全部类型",
      dataForm: {},
      typeSelect: []
    };
  },
  watch: {
    areaId(now) {
      this.dataForm.areaId = now;
      this.getDataList();
    },
    titleCode(now) {
      this.value = now.value;
      this.titleType = now.titleType;
    }
  },
  methods: {
    onSelect(item) {
      this.titleType = item["describeName"];
      this.dataForm.alarmType = item["monitorDeviceType"];
      this.getDataList();
    },
    onChangeTime(data) {
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD");
        endTime = moment(data[1]).format("YYYY-MM-DD");
      }
      this.dataForm.startTime = startTime;
      this.dataForm.endTime = endTime;
      this.getDataList();
    },
    clickExcel() {
      const that = this;
      that.exportHandle();
    },
    getAlarmType() {
      alarmType().then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleType"
          };
          return obj;
        });
        map.unshift({
          describeName: "所有类型",
          monitorDeviceType: "",
          title: "titleTypeL"
        });
        this.typeSelect = map;
      });
    },
    addReturn(row) {
      const that = this;
      const query = {
        alarmId: row.alarmId,
        type: "1"
      };
      dealRemarks(query).then(res => {
        if (res.data.isSuccess) that.$message.success(res.msg);
        else that.$message.error(res.msg);
        this.getDataList();
      });
    },
    dataListSelectionChangeHandle() {}
  },
  mounted() {
    this.getAlarmType();
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.pageHisRecords {
  width: 100%;
  .top {
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    & > div:first-child {
      padding-top: 10px;
      font-size: 18px;
    }
    .btn {
      display: flex;
      justify-content: space-between;
      & > div {
        margin-left: 10px;
      }
      & > div:last-child {
        & > div {
          width: 140px;
          line-height: 40px;
          text-align: center;
          background-color: #192f41;
          cursor: pointer;
        }
      }
      .dunoBtnTop {
        width: 190px;
        display: inline-flex;
        padding-bottom: 0;
        .btnList {
          top: inherit !important;
          width: 190px;
          .title {
            font-size: 16px;
            padding: 8px 20px;
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
  .imgOrMv {
    width: 43%;
    height: 45px;
    position: relative;
    top: 2px;
  }
  .tables {
    overflow: hidden;
    background-color: #142838;
    .tablesTep {
      height: 100%;
      background-color: rgba(0, 0, 0, 0);
      .ivu-table-wrapper {
        tr:nth-child(even) {
          td {
            background-color: #213848;
          }
        }
        border: none;
        .ivu-table {
          border: none !important;
          color: #fff;
          background-color: rgba(0, 0, 0, 0);
          .ivu-table-header {
            line-height: 60px;
            background-color: #325e82;
          }
          .ivu-table-body {
            .ivu-table-row {
              .ivu-table-column-center {
                height: 48px;
              }
            }
          }
        }
        .ivu-table:before,
        .ivu-table:after {
          background-color: rgba(0, 0, 0, 0);
        }
        .ivu-table td,
        .ivu-table th {
          color: #fff;
          border: none;
          background-color: rgba(0, 0, 0, 0);
        }
      }
    }
  }
  .table_link {
    color: #5fafff !important;
    text-decoration: underline;
  }
  .btn_pre {
    padding: 10px 15px;
    background-color: #3a81a1;
    border-radius: 16px;
    border: none;
  }
  //-------------------表格样式
  .ivu-table th {
    color: #fff;
    border: none;
    height: 60px;
    font-size: 18px;
    font-weight: normal;
    background-color: #2d5980 !important;
  }
  .ivu-table-border td {
    font-size: 16px;
    color: #fff;
    border: none;
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
      border-bottom: 1px solid #2b5272;
      td {
        height: 52px;
      }
    }
    tr:nth-child(odd) {
      td {
        background-color: #0a1c2a;
      }
    }
    tr:nth-child(even) {
      td {
        background-color: #0a1c2a;
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
