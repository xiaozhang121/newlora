<template>
  <div class="hisRecords">
    <div class="top">
      <div>历史信息记录</div>
      <div class="btn">
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTo"
            :isCheck="false"
            :dataList="typeSelect"
            :title="titleType"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
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
        <div style="visibility: hidden">
          <div>
            <i class="iconfont icon-daochu1"></i>
            导出表格
          </div>
        </div>
      </div>
    </div>
    <div class="tables">
      <duno-tables-tep
        :columns="infoColumns"
        :data="dataList"
        :border="true"
        :stripe="true"
        :isShowPage="false"
        :height="360"
      />
    </div>
  </div>
</template>

<script>
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import { DunoTablesTep } from "_c/duno-tables-tep";
import moment from "moment";
export default {
  name: "HisRecords",
  components: {
    dunoBtnTop,
    DunoTablesTep
  },
  data() {
    return {
      value: "",
      titleType: "全部数据类型",
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
      ],
      typeSelect: [
        {
          describeName: "分合状态"
        },
        {
          describeName: "仪表读数"
        }
      ],
      infoColumns: [
        {
          key: "time",
          title: "日期",
          align: "center"
        },
        {
          key: "alarmObject",
          title: "告警对象",
          align: "center"
        },
        {
          key: "warnLocation",
          title: "告警部位",
          align: "center"
        },
        {
          key: "dataType",
          title: "数据类型",
          align: "center"
        },
        {
          key: "content",
          title: "内容",
          align: "center"
        },
        {
          key: "defectGrade",
          title: "缺陷等级",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  borderRadius: "15px",
                  background: "#ff8400",
                  width: "60px",
                  lineHeight: "30px",
                  margin: "auto"
                }
              },
              "严重"
            );
          }
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
        // {
        //   key: "autoManual",
        //   title: "自动/手动",
        //   align: "center"
        // }
      ]
    };
  },
  methods: {
    onSelect(item) {
      this.titleType = item["describeName"];
    },
    onChangeTime(data) {
      const startTime = moment(data[0]).format("YYYY-MM-DD");
      const endTime = moment(data[1]).format("YYYY-MM-DD");
      this.startTime = JSON.parse(JSON.stringify(startTime));
      this.endTime = JSON.parse(JSON.stringify(endTime));
      this.$emit("onChange", data);
    },
    dataListSelectionChangeHandle() {}
  }
};
</script>

<style lang="scss">
.hisRecords {
  width: 100%;
  .top {
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    .btn {
      display: flex;
      justify-content: space-between;
      & > div {
        margin-left: 10px;
      }
      & > div:last-child {
        & > div {
          width: 140px;
          line-height: 32px;
          text-align: center;
          background-image: url(../../../assets/images/btn/moreBtn.png);
          cursor: pointer;
          // border-radius:
        }
      }
      .dunoBtnTop {
        width: 150px;
        display: inline-flex;
        padding-bottom: 0;
        .btnList {
          top: inherit !important;
          width: 150px;
          .title {
            font-size: 15px;
          }
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
            font-size: 20px;
            color: #fff;
          }
          .el-range-input {
            color: #fff;
          }
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
      // .ivu-select-dropdown {
      //   background-color: #1b3b47;
      // }
    }
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
