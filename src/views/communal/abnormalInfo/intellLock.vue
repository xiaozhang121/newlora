<template>
  <div class="intellLock">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top not-print">
      <div>智能锁具</div>
    </div>
    <duno-main class="dunoMain">
      <duno-tables-tep
        class="table_abnormalInfo"
        :columns="infoColumns"
        :data="dataList"
        :totalNum="totalNum"
        :current="offset"
        :border="true"
        :showSizer="true"
        @clickPage="pageCurrentChangeHandle"
      />
    </duno-main>
    <unlock :isShow="isShow" :dataList="webData" @on-close="onClose"></unlock>
  </div>
</template>

<script>
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import { DunoTablesTep } from "_c/duno-tables-tep";
import dunoMain from "_c/duno-m/duno-main";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import unlock from "_c/duno-c/unlock";
import moment from "moment";
import { putAxiosData, getAxiosData, postAxiosData } from "@/api/axiosType";
import { debug } from "util";
export default {
  name: "intellLock",
  components: {
    dunoBtnTop,
    DunoTablesTep,
    Breadcrumb,
    dunoMain,
    unlock
  },
  data() {
    const that = this;
    return {
      offset: 1,
      totalNum: 10,
      websock: null,
      webData: {},
      isShow: false,
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "", name: "智能锁具" }
      ],
      infoColumns: [
        {
          key: "devMac",
          title: "锁具ID",
          align: "center"
        },
        {
          key: "action",
          title: "锁具状态",
          align: "center",
          render: (h, params) => {
            let newArr = [];
            let name;
            if (params.row.action === 1) {
              name = "开锁";
            } else {
              name = "闭锁";
            }
            newArr.push([
              h("span", {
                class: {
                  circleStatus: true,
                  green: params.row.action === 1,
                  close: params.row.action === 0
                },
                draggable: false
              })
            ]);
            newArr.push([h("span", { draggable: true }, name)]);
            return h("div", newArr);
          }
        },
        {
          key: "devName",
          title: "授权人员姓名",
          align: "center"
        },
        {
          key: "userId",
          title: "授权人员ID",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Tooltip",
                {
                  props: {
                    placement: "top",
                    content: params.row.userId,
                    transfer: true
                  },
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }
                },
                params.row.userId
              )
            ]);
          }
        },
        {
          key: "address",
          title: "部门",
          align: "center"
        },
        {
          key: "opTime",
          title: "授权期限",
          align: "center"
        }
      ]
    };
  },
  methods: {
    onClose() {
      this.isShow = false;
    },
    pageCurrentChangeHandle(val) {
      this.offset = val;
      this.init();
    },
    init() {
      let startTime = moment()
        .subtract(3, "days")
        .format("YYYY-MM-DD HH:mm:ss");
      let endTime = moment().format("YYYY-MM-DD HH:mm:ss");
      let query = {
        offset: this.offset,
        limit: this.totalNum,
        startTime: startTime,
        endTime: endTime
      };
      let url = "/lenovo-smartlock/permit/record";
      postAxiosData(url, query).then(res => {
        this.dataList = res.data;
      });
    },
    initWebSocket() {
      //初始化weosocket
      this.websock = new WebSocket(
        `ws://10.0.8.86:8099/lenovo-smartlock/grant/websocket`
      );
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      this.webData = JSON.parse(e.data);
      if (redata.userId) {
        this.isShow = true;
      }
    },
    websocketclose(e) {
      //关闭
      this.websock = null;
      console.log("断开连接", e);
    }
  },
  mounted() {
    // this.init();
    this.initWebSocket();
    window.onbeforeunload = function() {
      // 浏览器关闭
      that.Socket.close();
    };
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.intellLock {
  width: 100%;
  .dunoMain {
    height: inherit;
  }
  .circleStatus {
    width: 13px;
    height: 13px;
    display: inline-block;
    border-radius: 20px;
    margin-right: 5px;
    position: relative;
    top: 1px;
    &.green {
      background: #53fec0;
    }
    &.fault {
      background: #ff9000;
    }
    &.close {
      background: #ee183b;
    }
  }
  .table_select {
    cursor: pointer;
    span {
      position: relative;
      top: -2px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 22px;
      border-radius: 20px;
    }
  }
  .el-button--text {
    border-color: transparent !important;
    background: transparent !important;
  }
  .flexPos {
    display: flex;
    align-items: center;
  }
  .imgOrMv {
    width: 100%;
    height: 39px;
    position: relative;
    top: 2px;
  }
  .table_link {
    color: #5fafff !important;
    text-decoration: underline;
  }
  .table_abnormalInfo {
    padding: 28px 17px;
  }
  .table_select {
    cursor: pointer;
    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 22px;
      border-radius: 20px;
    }
  }
  .top {
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      padding-top: 20px;
      padding-bottom: 20px;
      font-size: 20px;
    }
    .btn {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      & > div {
        margin-left: 10px;
      }
      .dunoBtnTop,
      .ddunoBtnTopSm {
        display: inline-flex;
        padding-bottom: 0;
        .btnList {
          top: inherit !important;
          // line-height: 40px;
          .title {
            font-size: 16px;
            padding: 8px 20px;
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
            font-size: 18px;
            color: #fff;
          }
          .el-range-input {
            color: #fff;
          }
        }
      }
    }
  }
  .table_abnormalInfo {
    padding: 28px 17px;
  }
}
.intellLock {
  //-------------------表格样式
  .ivu-table th {
    color: #fff;
    border: none;
    height: 60px;
    font-size: 18px;
    font-weight: normal;
    background-color: #2d5980 !important;
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
        height: 52px;
        font-size: 16px;
      }
    }
    tr:nth-child(odd) {
      td {
        background-color: #0a1c2a;
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
