<template>
  <div class="patrol">
    <div class="top not-print">
      <div>
        <span>{{title}}</span>
        <span>{{titleCon}}</span>
      </div>
      <div v-if="isShowBtn" @click="createTask()">+新建特殊巡视</div>
    </div>
    <div class="con">
      <duno-tables-tep
        class="table_abnormalInfo"
        :columns="columnsData"
        :data="dataList"
        :isShowPage="false"
        :border="true"
        :showSizer="true"
        @on-select="dataListSelectionChangeHandle"
      />
    </div>
  </div>
</template>

<script>
import { DunoTablesTep } from "_c/duno-tables-tep";
export default {
  name: "Patrol",
  components: {
    DunoTablesTep
  },
  props: {
    title: {
      type: String,
      default: "全面巡视"
    },
    titleCon: {
      type: String,
      default:
        "(集合多种监测设备，定点定时完成任务，生成巡视报告，异常状态及时告警)"
    },
    isShow: {
      type: Boolean,
      default: false
    },
    isShowBtn: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    planType: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    const that = this;
    return {
      interval: true,
      patrol: false,
      columnsData: [
        {
          title: "总步骤",
          key: "stepNum",
          minWidth: 50,
          align: "center",
          tooltip: true
        },
        {
          title: "监测设备",
          key: "monitorDeviceName",
          minWidth: 50,
          align: "center",
          tooltip: true
        },
        {
          title: "巡视间隔",
          key: "interval",
          minWidth: 50,
          align: "center",
          tooltip: true
        },
        {
          title: "已巡视次数",
          key: "inspectNum",
          minWidth: 50,
          align: "center",
          tooltip: true
        },
        {
          title: "状态",
          key: "statusName",
          minWidth: 50,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push(
              h(
                "div",
                {
                  class: {
                    table_select: true,
                    interval: params.row.status === "0",
                    patrol: params.row.status === "1"
                  }
                },
                params.row.statusName
              )
            );
            return h("div", newArr);
          }
        },
        {
          title: " ",
          // key: "Presentation",
          minWidth: 150,
          align: "right",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "查看报告>" },
                  on: {
                    click: () => {
                      this.getJump(params.row);
                    }
                  }
                },
                "查看报表>"
              )
            ]);
            return h("div", newArr);
          }
        }
      ]
    };
  },
  watch: {
    columns: {
      handler(now) {
        /* if (this.now.length == 0) {
          return;
        }*/
        if (now.length) this.columnsData = now;
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    createTask() {
      this.$emit("add-task");
    },
    getJump(row) {
      if (this.$route.name == "reportList") {
        this.$router.push({
          name: "report-view",
          query: {
            planId: row.planId,
            planType: this.planType,
          }
        });
      } else if (this.$route.name == "configurationList") {
        this.$router.push({
          name: "configure-report",
          query: {
            planId: row.planId,
            planType: this.planType,
          }
        });
      }
    },
    dataListSelectionChangeHandle() {}
  },
  mounted() {
    console.log(this.$route.name);
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.patrol {
  margin: 0 20px;
  padding-top: 30px;
  padding-bottom: 20px;
  .top {
    overflow: hidden;
    color: #ffffff;
    padding-bottom: 20px;
    & > div:first-child {
      float: left;
      & > span:first-child {
        font-size: 18px;
        padding-left: 10px;
        padding-right: 20px;
      }
      & > span:last-child {
        font-size: 16px;
        color: #cccccc;
      }
    }
    & > div:nth-child(2) {
      float: right;
      text-align: center;
      cursor: pointer;
      width: 176px;
      line-height: 40px;
      background-image: url(../../../assets/images/btn/createTask.png);
    }
  }
  .con {
    .tablesTep {
      .ivu-table-wrapper {
        border: none;
      }
    }
    &.interval {
      color: #ff9000 !important;
    }
    &.patrol {
      color: #53fec0 !important;
    }
  }
  //-------------------表格样式
  .ivu-table th {
    color: #fff;
    border: none;
    height: 60px;
    font-size: 18px;
    font-weight: normal;
    background-color: #2d5980 !important;
    @media screen and (min-width: 3500px) {
      height: 50px;
      font-size: 16px;
    }
  }
  .ivu-table-border td {
    font-size: 16px;
    color: #fff;
    border: none;
    @media screen and (min-width: 3500px) {
      font-size: 14px;
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
  .btn_pre {
    padding: 10px 15px;
    background-color: #3a81a1;
    border-radius: 16px;
    border: none;
  }
  .table_select {
    &.interval {
      color: #ff9000;
    }
    &.patrol {
      color: #53fec0;
    }
  }
}
</style>


