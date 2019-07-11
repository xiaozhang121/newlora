<template>
  <div class="pageHisRecords">
    <div class="top">
      <div>{{titleCode}}</div>
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
          <div>
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
import mixinViewModule from "@/mixins/view-module";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import { DunoTablesTep } from "_c/duno-tables-tep";
import moment from "moment";
export default {
  name: "PageHisRecords",
  mixins: [mixinViewModule],
  components: {
    dunoBtnTop,
    DunoTablesTep
  },
  props:{
    titleCode:{
      type:String,
      default:'1000千伏安防记录'
    },
    infoColumns:{
      type:Array,
      default:()=>{
        return[
           {
          key: "time",
          title: "拍摄时间",
          align: "center"
        },
        {
          key: "alarmObject",
          title: "告警类型",
          align: "center"
        },
        {
          key: "warnLocation",
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
                  on: {
                    click: () => {
                      alert("");
                    }
                  }
                },
                "可见光摄像头ID"
              )
            ]);
            return h(
              "div",
              {
                class: {
                  member_operate_div: true
                }
              },
              newArr
            );
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
          key: "imgVideo",
          title: "图片/视频",
          align: "center",
          render: (h, params) => {
            return h("i", {
              class: "iconfont icon-bofang"
            });
          }
        },
        {
          title: " ",
          key: "Presentation",
          minWidth: 150,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "复归" },
                  on: {
                    click: () => {
                      console.log(111);
                    }
                  }
                },
                "复归"
              )
            ]);
            newArr.push([
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "备注" },
                  on: {
                    click: () => {
                      console.log(111);
                    }
                  }
                },
                "备注"
              )
            ]);
            return h("div", newArr);
          }
        }
        ]
      }
    }
  },
  data() {
    return {
      value: "",
      titleType: "全部数据类型",
      pageRows: 20,
      typeSelect: [
        {
          describeName: "分合状态"
        },
        {
          describeName: "仪表读数"
        }
      ],
      clcikQueryData: {},
      dataList: [
        {
          time: "2019-07-09 15:16:00",
          alarmObject: "断路器GDEF",
          warnLocation: "设备左上角",
          dataType: "仪表读数",
          content: "45",
          autoManual: "自动"
        },
        {
          time: "2019-07-09 15:16:00",
          alarmObject: "断路器GDEF",
          warnLocation: "设备左上角",
          dataType: "仪表读数",
          content: "45",
          autoManual: "自动"
        },
        {
          time: "2019-07-09 15:16:00",
          alarmObject: "断路器GDEF",
          warnLocation: "设备左上角",
          dataType: "仪表读数",
          content: "45",
          autoManual: "自动"
        },
        {
          time: "2019-07-09 15:16:00",
          alarmObject: "断路器GDEF",
          warnLocation: "设备左上角",
          dataType: "仪表读数",
          content: "45",
          autoManual: "自动"
        },
        {
          time: "2019-07-09 15:16:00",
          alarmObject: "断路器GDEF",
          warnLocation: "设备左上角",
          dataType: "仪表读数",
          content: "45",
          autoManual: "自动"
        }
      ]
    };
  },
  methods: {
    onSelect(item) {
      this.titleType = item["describeName"];
      // this[item.title] = item["describeName"]
      // if (item.title == 'titleTypeL') {
      //   this.clcikQueryData.areaId = item.monitorDeviceType
      // } else if (item.title == 'titleTypeC') {
      //   this.clcikQueryData.status = item.monitorDeviceType
      // } else if (item.title == 'titleTypeR') {
      //   this.clcikQueryData.source = item.monitorDeviceType
      // }
      // this.clickQuery(this.clcikQueryData)
    },
    onChangeTime(data) {
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD");
        endTime = moment(data[1]).format("YYYY-MM-DD");
      }
      this.clcikQueryData.startTime = startTime
      this.clcikQueryData.endTime = endTime
      // this.clickQuery(this.clcikQueryData)
    },
    dataListSelectionChangeHandle() {}
  },
  mounted () {
    this.totalNum = this.dataList.length
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
    &>div:first-child{
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
        width: 150px;
        display: inline-flex;
        padding-bottom: 0;
        .btnList {
          top: inherit !important;
          width: 150px;
          // line-height: 30px;
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
        .el-range-editor--small.el-input__inner{
            height: 40px;
          }
          .el-range-editor--small .el-range-input{
            font-size: 16px;
          }
      }
    }
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
