<template>
  <div class="configDetail">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top not-print">
      <dir>任务配置</dir>
      <div @click="addTask()">+创建新的任务配置</div>
    </div>
    <duno-main class="dunoMain">
      <Patrol :dataList="allInspectList" planType="全面巡视" @to-edit="toEdit" />
      <Patrol
        @to-edit="toEdit"
        :dataList="nightInspectList"
        planType="熄灯巡视"
        :titleCon="titleNight"
        :title="titleTwo"
      />
      <Patrol
        :columns="columnsData"
        :dataList="specialInspectList"
        :title="title"
        :isShowBtn="false"
        :titleCon="titleCon"
        planType="特殊巡视 "
      />
      <Patrol
        :columns="columnsData1"
        :dataList="environmentInspectList"
        :title="title1"
        :isShowBtn="false"
        :titleCon="titleCon"
        planType="动态环境巡视"
      />
      <Patrol
        :columns="columnsData"
        :dataList="handHeldInfraredPlanList"
        :title="title2"
        :isShowBtn="false"
        :titleCon="titleCon"
        planType="手持红外巡视"
      />
      <alert :visible="visible" @handleClose="closeDia" @handleSubmit="submitChange" />
    </duno-main>
    <create-task
      :rowData="rowData"
      :visible="taskVisible"
      @on-close="onClose"
      @on-fresh="onFresh"
      @gettype="getType"
    />
    <create-task2
      :visible="taskVisible2"
      @on-close="onClose"
      @on-fresh="onFresh"
      @gettype="getType"
    />
    <create-taskhw
      :visible="taskVisible3"
      @on-close="onClose"
      @on-fresh="onFresh"
      @gettype="getType"
    />
  </div>
</template>

<script>
import dunoMain from "_c/duno-m/duno-main";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import createTask from "_c/duno-m/createTask";
import createTask2 from "_c/duno-m/createTaskConfig";
import createTaskhw from "_c/duno-m/createTask2";
import Patrol from "_c/duno-c/Patrol";
import alert from "_c/duno-j/statistics/components/alert";
import {
  infrInformation,
  startPatrol
} from "@/api/configuration/configuration.js";
import { debuglog } from "util";
export default {
  name: "configDetail",
  components: {
    Breadcrumb,
    dunoMain,
    Patrol,
    alert,
    createTask2,
    createTask,
    createTaskhw
  },
  data() {
    const that = this;
    return {
      rowData: {},
      taskVisible: false,
      taskVisible2: false,
      taskVisible3: false,
      title: "",
      title1: "",
      title2: "",
      titleTwo: "熄灯巡视",
      titleCon: "",
      visible: false,
      allInspectList: [],
      nightInspectList: [],
      specialInspectList: [],
      environmentInspectList: [],
      handHeldInfraredPlanList: [],
      dataBread: [
        { path: "/realEnv/list", name: "操作中台" },
        { path: "/configuration/list", name: "配置管理" },
        { path: "", name: "任务配置" }
      ],
      titleNight:
        "（利用红外热像仪查看电力设备本体及部件是否发红，生成巡视报告，异常状态及时告警）",
      dataList: [
        {
          step: "暴风雨巡视",
          device: "16",
          interval: "无",
          frequency: "2"
        }
      ],
      columnsData: [
        {
          title: "巡视名称",
          key: "planName",
          minWidth: 50,
          align: "center",
          tooltip: true
        },
        {
          title: "巡视步骤",
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
          tooltip: true /*,
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
                                    // this.visible = true;
                                }
                            }
                        },
                        params.row.interval
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
            }*/
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
                    interval: params.row.status == "0",
                    patrol: params.row.status == "1"
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
          minWidth: 150,
          align: "right",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push(
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#305e83" },
                  props: { type: "text", content: "编辑" },
                  on: {
                    click: () => {
                      that.rowData = JSON.parse(JSON.stringify(params.row));
                      that.taskVisible = true;
                    }
                  }
                },
                "编辑"
              )
            );
            /*
            newArr.push(
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#305e83" },
                  props: { type: "text", content: "编辑" },
                  on: {
                    click: () => {
                      console.log(111);
                    }
                  }
                },
                "编辑"
              )
            );
            newArr.push(
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#305e83" },
                  props: { type: "text", content: "复制" },
                  on: {
                    click: () => {
                      console.log(111);
                    }
                  }
                },
                "复制"
              )
            );
            */
            /*  newArr.push(
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "开始巡视" },
                  on: {
                    click: () => {
                      //   console.log(111);
                      this.getStart(params.row);
                    }
                  }
                },
                "开始巡视"
              )
            );*/
            newArr.push([
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "查看报告>" },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "configure-report",
                        query: {
                          planId: params.row.planId,
                          planType: params.row.planType
                          //   url: ""
                        }
                      });
                    }
                  }
                },
                "查看报告>"
              )
            ]);
            return h("div", newArr);
          }
        }
      ],
      columnsData1: [
        {
          title: "巡视名称",
          key: "planName",
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
                    interval: params.row.status == "0",
                    patrol: params.row.status == "1"
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
          minWidth: 150,
          align: "right",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push(
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#305e83" },
                  props: { type: "text", content: "编辑" },
                  on: {
                    click: () => {
                      that.rowData = JSON.parse(JSON.stringify(params.row));
                      that.taskVisible = true;
                    }
                  }
                },
                "编辑"
              )
            );
            newArr.push([
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "查看报告>" },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "configure-report",
                        query: {
                          planId: params.row.planId,
                          planType: params.row.planType
                          //   url: ""
                        }
                      });
                    }
                  }
                },
                "查看报告>"
              )
            ]);
            return h("div", newArr);
          }
        }
      ]
    };
  },
  watch: {
    taskVisible(now) {
      if (!now) {
        this.rowData = {};
      }
    }
  },
  methods: {
    getType(value) {
      debugger;
      console.log(value);
      debugger;
      if (value == "4") {
        this.taskVisible = false;
        this.taskVisible3 = false;
        this.taskVisible2 = true;
      } else if (value == "5") {
        this.taskVisible = false;
        this.taskVisible2 = false;
        this.taskVisible3 = true;
      } else {
        this.taskVisible = true;
        this.taskVisible3 = false;
        this.taskVisible2 = false;
      }
    },
    toEdit(row) {
      const that = this;
      that.rowData = row;
      that.taskVisible = true;
    },
    onFresh() {
      this.getDataList();
    },
    addTask() {
      this.taskVisible2 = false;
      this.taskVisible = true;
    },
    onClose() {
      this.taskVisible = false;
      this.taskVisible2 = false;
      this.taskVisible3 = false;
      this.getDataList()
    },
    closeDia() {
      this.visible = false;
    },
    submitChange(info) {
      // 提交更改
      console.log(info);
      this.visible = false;
    },
    getDataList() {
      const that = this;
      infrInformation().then(res => {
        that.allInspectList = res.data.allInspectList;
        that.nightInspectList = res.data.nightInspectList;
        that.specialInspectList = res.data.specialInspectList;
        that.environmentInspectList = res.data.environmentInspectList;
        that.handHeldInfraredPlanList = res.data.handHeldInfraredPlanList;
        that.title = `特殊巡视（${that.specialInspectList.length}）`;
        that.title1 = `动态环境巡视（${that.environmentInspectList.length}）`;
        that.title2 = `手持红外巡视（${that.handHeldInfraredPlanList.length}）`;
      });
    },
    getStart(row) {
      console.log(row);
      let query = {
        planId: row.planId
      };
      startPatrol(query).then(res => {
        this.$message({
          message: "开始巡视",
          type: "success"
        });
        this.getDataList();
      });
    }
  },
  mounted() {
    this.getDataList();
  }
};
</script>

<style lang="scss">
.configDetail {
  width: 100%;
  & > .top {
    color: #ffffff;
    margin: 10px 0;
    line-height: 40px;
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    & > div:nth-child(2) {
      /*visibility: hidden;*/
      font-size: 16px;
      text-align: center;
      cursor: pointer;
      width: 176px;
      background-image: url(../../../assets/images/btn/createTask.png);
    }
  }
  .table_link {
    color: #5fafff !important;
    text-decoration: underline;
  }
  .dunoMain {
    height: inherit;
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
