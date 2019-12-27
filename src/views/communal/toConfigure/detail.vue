<template>
  <div class="configDetail">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top not-print">
      <dir>任务配置</dir>
      <div @click="addTask()" v-if="place">+创建新的任务配置</div>
    </div>
    <duno-main class="dunoMain">
      <div class="allCheck">
        <div class="containLeft">
          <div class="allCheck-title">全面巡视</div>
          <div class="allCheck-explain">(集合多种监测设备，定点定时完成任务，生成巡视报告，异常状态及时告警)</div>
        </div>
        <div class="containRight">
          <el-button class="btn_pre" @click.native="routeTo">查看报告></el-button>
        </div>
      </div>
      <!-- <Patrol
        @to-run="toRunTask"
        @to-del="toDel"
        :patrolData="allInspectList"
        planType="全面巡视"
        @to-edit="toEdit"
      />-->
      <Patrol
        @to-del="toDel"
        @to-edit="toEdit"
        @to-run="toRunTask"
        :patrolData="nightInspectList"
        :columns="columns"
        planType="熄灯巡视"
        :titleCon="titleNight"
        :title="titleTwo"
      />
      <Patrol
        :columns="columnsData"
        :patrolData="specialInspectList"
        :title="title"
        :isShowBtn="false"
        :titleCon="titleCon"
        planType="特殊巡视 "
      />
      <Patrol
        :columns="columnsDataD"
        :patrolData="handHeldInfraredPlanList"
        :title="title2"
        :isShowBtn="false"
        :titleCon="titleCon"
        planType="手持红外巡视"
      />
      <Patrol
        :columns="columnsData1D"
        :patrolData="environmentInspectList"
        :title="title1"
        :isShowBtn="false"
        :titleCon="titleCon"
        planType="现场安全管控巡视"
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
      :rowData="rowData"
      :visible="taskVisible2"
      @on-close="onClose"
      @on-fresh="onFresh"
      @gettype="getType"
    />
    <create-taskhw
      :rowData="rowData"
      :visible="taskVisible3"
      @on-close="onClose"
      @on-fresh="onFresh"
      @gettype="getType"
    />
  </div>
</template>

<script>
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import dunoMain from "_c/duno-m/duno-main";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import createTask from "_c/duno-m/createTask";
import createTask2 from "_c/duno-m/createTaskConfig";
import createTaskhw from "_c/duno-m/createTask2";
import Patrol from "_c/duno-c/Patrol";
import alert from "_c/duno-j/statistics/components/alert";
import mixinViewModule from "@/mixins/view-module";
import {
  infrInformation,
  startPatrol
} from "@/api/configuration/configuration.js";
import { debuglog } from "util";
export default {
  name: "configDetail",
  mixins: [mixinViewModule],
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
      place: false,
      isEdit: false,
      isDel: false,
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
      columns: [
        {
          title: "巡视名称",
          key: "planName",
          width: 180,
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
          title: "执行时间",
          key: "interval",
          minWidth: 50,
          align: "center",
          tooltip: true
        },
        {
          title: "已巡视次数",
          key: "inspectNum",
          minWidth: 90,
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
          minWidth: 180,
          align: "right",
          tooltip: true,
          render: (h, params) => {
            let self = that;
            let newArr = [];
            newArr.push(
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#305e83" },
                  props: {
                    type: "text",
                    content: "立即执行",
                    loading: params.row.loading
                  },
                  on: {
                    click: () => {
                      self.toRunTask(params);
                    }
                  }
                },
                "立即执行"
              )
            );
            if (that.isEdit) {
              newArr.push(
                h(
                  "el-button",
                  {
                    class: "btn_pre",
                    style: { background: "#305e83" },
                    props: { type: "text", content: "编辑" },
                    on: {
                      click: () => {
                        that.$emit(
                          "to-edit",
                          JSON.parse(JSON.stringify(params.row))
                        );
                      }
                    }
                  },
                  "编辑"
                )
              );
            }
            if (that.isDel) {
              newArr.push(
                h(
                  "el-poptip",
                  {
                    props: {
                      confirm: true,
                      title: "确定删除吗？",
                      type: "primary",
                      size: "small"
                    },
                    style: { margin: "0 2px" },
                    on: {
                      "on-ok": () => {
                        self.toDel(params);
                      }
                    }
                  },
                  [
                    h(
                      "el-button",
                      {
                        class: "btn_pre",
                        style: { background: "#305e83" },
                        props: {
                          type: "text",
                          content: "删除"
                        }
                      },
                      "删除"
                    )
                  ]
                )
              );
            }
            newArr.push([
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "查看详情>" },
                  on: {
                    click: () => {
                      this.getJump(params.row);
                    }
                  }
                },
                "查看详情>"
              )
            ]);
            return h("div", newArr);
          }
        },
        {
          title: " ",
          minWidth: 250,
          align: "right",
          tooltip: true,
          render: (h, params) => {
            let self = that;
            let newArr = [];
            newArr.push(
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#305e83" },
                  props: {
                    type: "text",
                    content: "立即执行",
                    loading: params.row.loading
                  },
                  on: {
                    click: () => {
                      self.toRunTask(params);
                    }
                  }
                },
                "立即执行"
              )
            );
            if (that.isEdit) {
              newArr.push(
                h(
                  "el-button",
                  {
                    class: "btn_pre",
                    style: { background: "#305e83" },
                    props: { type: "text", content: "编辑" },
                    on: {
                      click: () => {
                        that.$emit(
                          "to-edit",
                          JSON.parse(JSON.stringify(params.row))
                        );
                      }
                    }
                  },
                  "编辑"
                )
              );
            }
            if (that.isDel) {
              newArr.push(
                h(
                  "el-poptip",
                  {
                    props: {
                      confirm: true,
                      title: "确定删除吗？",
                      type: "primary",
                      size: "small"
                    },
                    style: { margin: "0 2px" },
                    on: {
                      "on-ok": () => {
                        self.toDel(params);
                      }
                    }
                  },
                  [
                    h(
                      "el-button",
                      {
                        class: "btn_pre",
                        style: { background: "#305e83" },
                        props: {
                          type: "text",
                          content: "删除"
                        }
                      },
                      "删除"
                    )
                  ]
                )
              );
            }
            newArr.push([
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "查看详情>" },
                  on: {
                    click: () => {
                      this.getJump(params.row);
                    }
                  }
                },
                "查看详情>"
              )
            ]);
            return h("div", newArr);
          }
        }
      ],
      columnsData: [
        {
          title: "巡视名称",
          key: "planName",
          width: 180,
          align: "center",
          tooltip: true
        },
        {
          title: "巡视步骤",
          key: "stepNum",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "监测设备",
          key: "monitorDeviceName",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "执行时间",
          key: "interval",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "已巡视次数",
          key: "inspectNum",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "状态",
          key: "statusName",
          minWidth: 90,
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
          minWidth: 180,
          align: "right",
          tooltip: true,
          render: (h, params) => {
            let self = that;
            let newArr = [];
            newArr.push(
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#305e83" },
                  props: {
                    type: "text",
                    content: "立即执行",
                    loading: params.row.loading
                  },
                  on: {
                    click: () => {
                      self.toRunTask(params);
                    }
                  }
                },
                "立即执行"
              )
            );
            if (that.isEdit) {
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
            }
            if (that.isDel) {
              newArr.push(
                h(
                  "el-poptip",
                  {
                    props: {
                      confirm: true,
                      title: "确定删除吗？",
                      type: "primary",
                      size: "small"
                    },
                    style: { margin: "0 2px" },
                    on: {
                      "on-ok": () => {
                        self.toDel(params);
                      }
                    }
                  },
                  [
                    h(
                      "el-button",
                      {
                        class: "btn_pre",
                        style: { background: "#305e83" },
                        props: {
                          type: "text",
                          content: "删除"
                        }
                      },
                      "删除"
                    )
                  ]
                )
              );
            }
            newArr.push([
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "查看详情>" },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "configure-report",
                        query: {
                          planId: params.row.planId,
                          planName: params.row.planName,
                          planType: params.row.planType
                          //   url: ""
                        }
                      });
                    }
                  }
                },
                "查看详情>"
              )
            ]);
            return h("div", newArr);
          }
        },
        {
          title: " ",
          minWidth: 300,
          align: "right",
          tooltip: true,
          render: (h, params) => {
            let self = that;
            let newArr = [];
            newArr.push(
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#305e83" },
                  props: {
                    type: "text",
                    content: "立即执行",
                    loading: params.row.loading
                  },
                  on: {
                    click: () => {
                      self.toRunTask(params);
                    }
                  }
                },
                "立即执行"
              )
            );
            if (that.isEdit) {
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
            }
            if (that.isDel) {
              newArr.push(
                h(
                  "el-poptip",
                  {
                    props: {
                      confirm: true,
                      title: "确定删除吗？",
                      type: "primary",
                      size: "small"
                    },
                    style: { margin: "0 2px" },
                    on: {
                      "on-ok": () => {
                        self.toDel(params);
                      }
                    }
                  },
                  [
                    h(
                      "el-button",
                      {
                        class: "btn_pre",
                        style: { background: "#305e83" },
                        props: {
                          type: "text",
                          content: "删除"
                        }
                      },
                      "删除"
                    )
                  ]
                )
              );
            }
            newArr.push([
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "查看详情>" },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "configure-report",
                        query: {
                          planId: params.row.planId,
                          planName: params.row.planName,
                          planType: params.row.planType
                          //   url: ""
                        }
                      });
                    }
                  }
                },
                "查看详情>"
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
          width: 180,
          align: "center",
          tooltip: true
        },
        {
          title: "监测设备",
          key: "monitorDeviceName",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "已巡视次数",
          key: "inspectNum",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "状态",
          key: "statusName",
          minWidth: 90,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push(
              h("div", [
                h(
                  "span",
                  {
                    class: {
                      table_select: true,
                      interval: params.row.status == "0",
                      patrol: params.row.status == "1"
                    },
                    domProps: {
                      title: params.row.statusName
                    }
                  },
                  params.row.statusName
                )
              ])
            );
            return h("div", newArr);
          }
        },
        {
          title: " ",
          minWidth: 200,
          align: "right",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            let self = that;
            newArr.push(
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#305e83" },
                  props: {
                    type: "text",
                    content: "立即执行",
                    loading: params.row.loading
                  },
                  on: {
                    click: () => {
                      self.toRunTask(params);
                    }
                  }
                },
                "立即执行"
              )
            );
            if (that.isEdit) {
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
            }
            if (that.isDel) {
              newArr.push(
                h(
                  "el-poptip",
                  {
                    props: {
                      confirm: true,
                      title: "确定删除吗？",
                      type: "primary",
                      size: "small"
                    },
                    style: { margin: "0 2px" },
                    on: {
                      "on-ok": () => {
                        self.toDel(params);
                      }
                    }
                  },
                  [
                    h(
                      "el-button",
                      {
                        class: "btn_pre",
                        style: { background: "#305e83" },
                        props: {
                          type: "text",
                          content: "删除"
                        }
                      },
                      "删除"
                    )
                  ]
                )
              );
            }
            newArr.push([
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "查看详情>" },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "configure-report",
                        query: {
                          planId: params.row.planId,
                          planName: params.row.planName,
                          planType: params.row.planType
                          //   url: ""
                        }
                      });
                    }
                  }
                },
                "查看详情>"
              )
            ]);
            return h("div", newArr);
          }
        }
      ],
      columnsDataD: [
        {
          title: "巡视名称",
          key: "planName",
          width: 180,
          align: "center",
          tooltip: true
        },
        {
          title: "巡视步骤",
          key: "stepNum",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "监测设备",
          key: "monitorDeviceName",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "执行时间",
          key: "interval",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "已巡视次数",
          key: "inspectNum",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "状态",
          key: "statusName",
          minWidth: 90,
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
          minWidth: 180,
          align: "right",
          tooltip: true,
          render: (h, params) => {
            let self = that;
            let newArr = [];
            if (that.isEdit) {
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
                        that.taskVisible3 = true;
                      }
                    }
                  },
                  "编辑"
                )
              );
            }
            if (that.isDel) {
              newArr.push(
                h(
                  "el-poptip",
                  {
                    props: {
                      confirm: true,
                      title: "确定删除吗？",
                      type: "primary",
                      size: "small"
                    },
                    style: { margin: "0 2px" },
                    on: {
                      "on-ok": () => {
                        self.toDel(params);
                      }
                    }
                  },
                  [
                    h(
                      "el-button",
                      {
                        class: "btn_pre",
                        style: { background: "#305e83" },
                        props: {
                          type: "text",
                          content: "删除"
                        }
                      },
                      "删除"
                    )
                  ]
                )
              );
            }
            newArr.push([
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "查看详情>" },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "configure-report",
                        query: {
                          planId: params.row.planId,
                          planName: params.row.planName,
                          planType: params.row.planType
                        }
                      });
                    }
                  }
                },
                "查看详情>"
              )
            ]);
            return h("div", newArr);
          }
        },
        {
          title: " ",
          minWidth: 250,
          align: "right",
          tooltip: true,
          render: (h, params) => {
            let self = that;
            let newArr = [];
            if (that.isEdit) {
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
                        that.taskVisible3 = true;
                      }
                    }
                  },
                  "编辑"
                )
              );
            }
            if (that.isDel) {
              newArr.push(
                h(
                  "el-poptip",
                  {
                    props: {
                      confirm: true,
                      title: "确定删除吗？",
                      type: "primary",
                      size: "small"
                    },
                    style: { margin: "0 2px" },
                    on: {
                      "on-ok": () => {
                        self.toDel(params);
                      }
                    }
                  },
                  [
                    h(
                      "el-button",
                      {
                        class: "btn_pre",
                        style: { background: "#305e83" },
                        props: {
                          type: "text",
                          content: "删除"
                        }
                      },
                      "删除"
                    )
                  ]
                )
              );
            }
            newArr.push([
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "查看详情>" },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "configure-report",
                        query: {
                          planId: params.row.planId,
                          planName: params.row.planName,
                          planType: params.row.planType
                        }
                      });
                    }
                  }
                },
                "查看详情>"
              )
            ]);
            return h("div", newArr);
          }
        }
      ],
      columnsData1D: [
        {
          title: "巡视名称",
          key: "planName",
          width: 180,
          align: "center",
          tooltip: true
        },
        {
          title: "已巡视次数",
          key: "inspectNum",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "监测设备",
          key: "monitorDeviceName",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "状态",
          key: "statusName",
          minWidth: 90,
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
            let self = that;
            if (
              params.row.statusName == "任务间隔中" &&
              params.row.planType != 6
            ) {
              newArr.push(
                h(
                  "el-button",
                  {
                    class: "btn_pre",
                    style: { background: "#305e83" },
                    props: {
                      type: "text",
                      content: "立即执行",
                      loading: params.row.loading
                    },
                    on: {
                      click: () => {
                        self.toRunTask(params);
                      }
                    }
                  },
                  "立即执行"
                )
              );
            }
            if (
              params.row.statusName == "正在巡视中" &&
              params.row.planType != 6
            ) {
              newArr.push(
                h(
                  "el-button",
                  {
                    class: "btn_pre",
                    style: { background: "#305e83" },
                    props: {
                      type: "text",
                      content: "立即停止",
                      loading: params.row.isStop
                    },
                    on: {
                      click: () => {
                        self.toStop(params);
                      }
                    }
                  },
                  "立即停止"
                )
              );
            }
            if (that.isEdit && params.row.planType != 6) {
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
                        that.taskVisible2 = true;
                      }
                    }
                  },
                  "编辑"
                )
              );
            }
            if (that.isDel && params.row.planType != 6) {
              newArr.push(
                h(
                  "el-poptip",
                  {
                    props: {
                      confirm: true,
                      title: "确定删除吗？",
                      type: "primary",
                      size: "small"
                    },
                    style: { margin: "0 2px" },
                    on: {
                      "on-ok": () => {
                        self.toDel(params);
                      }
                    }
                  },
                  [
                    h(
                      "el-button",
                      {
                        class: "btn_pre",
                        style: { background: "#305e83" },
                        props: {
                          type: "text",
                          content: "删除"
                        }
                      },
                      "删除"
                    )
                  ]
                )
              );
            }
            newArr.push([
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "查看详情>" },
                  on: {
                    click: () => {
                      if (params.row.planType == 6) {
                        this.$router.push({
                          name: "unifyConfig",
                          query: {
                            planId: params.row.planId,
                            planType: params.row.planType,
                            planName: params.row.planName,
                            inspectName: params.row.inspectName
                          }
                        });
                      } else {
                        this.$router.push({
                          name: "patrolMission",
                          query: {
                            planId: params.row.planId,
                            planName: params.row.planName,
                            planType: params.row.planType,
                            inspectName: params.row.inspectName
                          }
                        });
                      }
                    }
                  }
                },
                "查看详情>"
              )
            ]);
            return h("div", newArr);
          }
        },
        {
          title: " ",
          minWidth: 250,
          align: "right",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            let self = that;
            if (
              params.row.statusName == "任务间隔中" &&
              params.row.planType != 6
            ) {
              newArr.push(
                h(
                  "el-button",
                  {
                    class: "btn_pre",
                    style: { background: "#305e83" },
                    props: {
                      type: "text",
                      content: "立即执行",
                      loading: params.row.loading
                    },
                    on: {
                      click: () => {
                        self.toRunTask(params);
                      }
                    }
                  },
                  "立即执行"
                )
              );
            }
            if (
              params.row.statusName == "正在巡视中" &&
              params.row.planType != 6
            ) {
              newArr.push(
                h(
                  "el-button",
                  {
                    class: "btn_pre",
                    style: { background: "#305e83" },
                    props: {
                      type: "text",
                      content: "立即停止",
                      loading: params.row.isStop
                    },
                    on: {
                      click: () => {
                        self.toStop(params);
                      }
                    }
                  },
                  "立即停止"
                )
              );
            }
            if (that.isEdit && params.row.planType != 6) {
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
                        that.taskVisible2 = true;
                      }
                    }
                  },
                  "编辑"
                )
              );
            }
            if (that.isDel && params.row.planType != 6) {
              newArr.push(
                h(
                  "el-poptip",
                  {
                    props: {
                      confirm: true,
                      title: "确定删除吗？",
                      type: "primary",
                      size: "small"
                    },
                    style: { margin: "0 2px" },
                    on: {
                      "on-ok": () => {
                        self.toDel(params);
                      }
                    }
                  },
                  [
                    h(
                      "el-button",
                      {
                        class: "btn_pre",
                        style: { background: "#305e83" },
                        props: {
                          type: "text",
                          content: "删除"
                        }
                      },
                      "删除"
                    )
                  ]
                )
              );
            }
            newArr.push([
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "查看详情>" },
                  on: {
                    click: () => {
                      if (params.row.planType == 6) {
                        this.$router.push({
                          name: "unifyConfig",
                          query: {
                            planId: params.row.planId,
                            planType: params.row.planType,
                            planName: params.row.planName,
                            inspectName: params.row.inspectName
                          }
                        });
                      } else {
                        this.$router.push({
                          name: "patrolMission",
                          query: {
                            planId: params.row.planId,
                            planName: params.row.planName,
                            planType: params.row.planType,
                            inspectName: params.row.inspectName
                          }
                        });
                      }
                    }
                  }
                },
                "查看详情>"
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
    routeTo() {
      this.$store.state.app.changeNav = "2";
      this.$router.push({
        name: "reportFrom",
        query: {
          planType: "9",
          nav: "2"
        }
      });
    },
    toDel(param) {
      let url = `/lenovo-plan/api/inspection/deletePlanAndTasks?id=${param.row.id}`;
      postAxiosData(url).then(res => {
        this.getDataList();
        this.$message({
          type: "success",
          message: "删除成功"
        });
      });
    },
    toStop(param) {
      let planId = param.row.planId;
      this[param.row.type][param.index]["isStop"] = true;
      getAxiosData("/lenovo-plan/api/plan/stop", { planId: planId }).then(
        res => {
          this.getDataList();
          this[param.row.type][param.index]["isStop"] = false;
          this.$message.success(res.msg);
        }
      );
    },
    toRunTask(param) {
      let planId = param.row.planId;
      this[param.row.type][param.index]["loading"] = true;
      getAxiosData("/lenovo-plan/api/plan/run", { planId: planId }).then(
        res => {
          this.getDataList();
          this[param.row.type][param.index]["loading"] = false;
          this.$message.success(res.msg);
        }
      );
    },
    getType(value) {
      console.log(value);
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
      this.taskVisible3 = false;
      this.taskVisible = true;
    },
    onClose() {
      this.rowData = {};
      this.taskVisible = false;
      this.taskVisible2 = false;
      this.taskVisible3 = false;
      this.getDataList();
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
        res.data.allInspectList.map(item => {
          item["type"] = "allInspectList";
          item["loading"] = false;
          item["isStop"] = false;
        });
        that.allInspectList = res.data.allInspectList;
        res.data.nightInspectList.map(item => {
          item["type"] = "nightInspectList";
          item["loading"] = false;
          item["isStop"] = false;
        });
        that.nightInspectList = res.data.nightInspectList;
        res.data.specialInspectList.map(item => {
          item["type"] = "specialInspectList";
          item["loading"] = false;
          item["isStop"] = false;
        });
        that.specialInspectList = res.data.specialInspectList;
        res.data.environmentInspectList.map(item => {
          item["type"] = "environmentInspectList";
          item["loading"] = false;
          item["isStop"] = false;
        });
        that.environmentInspectList = res.data.environmentInspectList;
        res.data.handHeldInfraredPlanList.map(item => {
          item["type"] = "handHeldInfraredPlanList";
          item["loading"] = false;
          item["isStop"] = false;
        });
        that.handHeldInfraredPlanList = res.data.handHeldInfraredPlanList;
        that.title = `特殊巡视（${that.specialInspectList.length}）`;
        that.title1 = `现场安全管控巡视（${that.environmentInspectList.length}）`;
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
    },
    spliceColumns() {
      if (this.isDel) {
        this.columns.splice(6, 1);
        this.columnsData.splice(6, 1);
        this.columnsDataD.splice(6, 1);
        this.columnsData1D.splice(4, 1);
      } else {
        this.columns.splice(7, 1);
        this.columnsData.splice(7, 1);
        this.columnsDataD.splice(7, 1);
        this.columnsData1D.splice(5, 1);
      }
      this.columns.splice(2, 1);
      this.columnsData.splice(2, 1);
      this.columnsDataD.splice(2, 1);
      this.columnsData1D.splice(2, 1);
    }
  },
  mounted() {
    this.getDataList();
    try {
      this.place = this.getAuthority("10050101");
    } catch (e) {}
    this.isEdit = this.getAuthority("10050102");
    this.isDel = this.getAuthority("10050103");
    this.spliceColumns();
  }
};
</script>

<style lang="scss">
.configDetail {
  width: 100%;
  .allCheck {
    display: flex;
    background: #174152;
    padding: 18px 32px;
    margin-top: 30px;
    .containLeft {
      flex: 1;
      line-height: 31px;
      font-size: 15px;
      .allCheck-title {
        color: white;
        font-size: 18px;
      }
      .allCheck-explain {
        color: #cccccc;
        font-size: 16px;
      }
    }
    .containRight {
      line-height: 60px;
      .btn_pre {
        padding: 10px 15px;
        background-color: #3a81a1;
        border-radius: 16px;
        border: none;
      }
    }
  }

  .ivu-poptip-confirm .ivu-poptip-body {
    text-align: left;
    color: black;
  }
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
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    width: 140px;
    font-size: 16px;
    color: #5fafff !important;
    text-decoration: underline;
  }
  .dunoMain {
    height: inherit;
  }
  .dunoMain_nr {
    padding: 0 20px;
  }
  .table_select {
    text-align: center;
    display: inline-block;
    // width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &.interval {
      color: #ff9000;
    }
    &.patrol {
      color: #53fec0;
    }
  }
  .patrol {
    margin: 0;
  }
}
</style>
