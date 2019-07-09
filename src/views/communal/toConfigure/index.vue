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
            @on-select="onSelect"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="typeSelection"
            :title="titleTypeL"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="typeSelection"
            :title="titleTypeC"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTopSm"
            :isCheck="false"
            :dataList="typeSelection"
            :title="titleTypeR"
            :showBtnList="false"
          ></duno-btn-top>
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
import Breadcrumb from "_c/duno-c/Breadcrumb";
import moment from "moment";
export default {
  name: "toConfigure",
  components: {
    dunoBtnTop,
    DunoTablesTep,
    Breadcrumb
  },
  data() {
    return {
      value: "",
      titleTypeL: "所有监测设备",
      titleTypeC: "所有电压等级",
      titleTypeR: "所有状态",
      dataBread: {
        "/": "操作中台",
        "/environmental": "配置管理",
        "/environmental/list": "监测设备管理"
      },
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
      typeSelection: [
        {
          describeName: "分合状态"
        },
        {
          describeName: "仪表读数"
        }
      ],
      infoColumns: [
        {
          key: "id",
          title: "设备ID",
          align: "center"
        },
        {
          key: "area",
          title: "所在区域",
          align: "center"
        },
        {
          key: "state",
          title: "当前状态",
          align: "center"
        },
        {
          key: "cycle",
          title: "巡视周期",
          align: "center"
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
.toConfigure {
  width: 100%;
  .top {
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      padding-top: 15px;
    }
    .btn {
      display: flex;
      justify-content: space-between;
      & > div {
        margin-left: 10px;
      }
      .dunoBtnTop,
      .ddunoBtnTopSm {
        display: inline-flex;
        padding-bottom: 0;
        .btnList {
          top: inherit !important;
          .title {
            font-size: 15px;
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
    padding: 20px;
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
