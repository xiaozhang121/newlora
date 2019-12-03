<template>
  <div class="robotDetail">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="configure">
      <div>任务配置列表</div>
      <div class="main">
        <div class="left">
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="InspectData"
            :title="titleInspect"
            :showBtnList="false"
          ></duno-btn-top>
          <div>
            <p>
              监控设备总数:
              <span>1</span>
            </p>
            <p>
              巡视步骤总数:
              <span>{{ taskNormalData['linkCount'] }}</span>
            </p>
            <p>
              任务计划时长:
              <span>{{ taskNormalData['taskPlanCostTime'] }}</span>
            </p>
            <p>
              任务间隔:
              <span>{{ taskNormalData['taskInterval'] }}</span>
            </p>
          </div>
        </div>
        <div class="center">
          <duno-tables-tep
            :columns="newColumns"
            :data="dataList"
            :border="true"
            :stripe="true"
            :isShowPage="false"
            :showSizer="true"
            :height="280"
          />
        </div>
        <div class="right">
          <!-- <img :src="taskNormalData['roadImgPath']" /> -->
          <el-image :src="taskNormalData['roadImgPath']">
            <div slot="error" class="image-slot">
              未能获取到图片
            </div>
          </el-image>
        </div>
      </div>
    </div>
    <div class="table">
      <Patrol
        :isShowBtn="true"
        :columns="columnsData"
        :dataList="specialInspectList['data']"
        :title="title"
        :titleCon="titleCon"
        @add-task="addTask"
      />
      <el-pagination
        :page-size="specialInspectList.pageRows"
        :current-page="specialInspectList.pageIndex"
        layout="prev, pager, next"
        @current-change="changePage"
        :total="specialInspectList.totalRows"
      ></el-pagination>
    </div>
    <select-district @on-success="success" @on-close="onClose" :visible="dialogVisible" />
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import Patrol from "_c/duno-c/Patrol";
import { DunoTablesTep } from "_c/duno-tables-tep";
import mixinViewModule from "@/mixins/view-module";
import { postAxiosData, getAxiosData } from "@/api/axiosType";
import selectDistrict from "_c/duno-m/selectDistrict";
import { infrInformation } from "@/api/configuration/configuration.js";
export default {
  mixins: [mixinViewModule],
  name: "robot-detail",
  components: {
    Breadcrumb,
    dunoBtnTop,
    DunoTablesTep,
    Patrol,
    selectDistrict
  },
  data() {
    const that = this;
    return {
      timer: null,
      taskId: "",
      routeName: "",
      taskNormalData: "",
      dialogVisible: false,
      mixinViewModuleOptions: {
        activatedIsNeed: true
        // getDataListURL: "/lenovo-plan/api/statistics/plan/list"
      },
      InspectData: [],
      specialInspectList: {
        data: [],
        pageRows: 10,
        pageIndex: 1,
        totalRows: ""
      },
      title: "特殊巡视",
      titleCon: "",
      dataList: [],
      titleInspect: "例行巡视编号",
      dataBread: [
        { path: "/realEnv/list", name: "操作中台" },
        { path: "/robot-one/list", name: "机器人巡视" },
        { path: "/robot-one/list", name: "室外巡检机器人" },
        { path: "", name: "任务配置列表" }
      ],
      newColumns: [
        {
          type: "index",
          title: "序号",
          minWidth: 80,
          align: "center"
        },
        {
          key: "stepContent",
          title: "步骤内容",
          minWidth: 100,
          align: "center"
        },
        {
          key: "recordContent",
          title: "记录内容",
          minWidth: 100,
          align: "center"
        }
      ],
      columnsData: [
        {
          title: "创建时间",
          key: "createTime",
          minWidth: 50,
          align: "center",
          tooltip: true
        },
        {
          title: "巡视名称",
          key: "taskName",
          minWidth: 50,
          align: "center",
          tooltip: true
        },
        {
          title: "巡视步骤",
          key: "linkCount",
          minWidth: 50,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h(
                "span",
                {
                  props: { type: "text" },
                  on: {
                    click: () => {
                      this.visible = true;
                    }
                  }
                },
                params.row.linkCount
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
          title: "已巡视次数",
          key: "doneTimes",
          minWidth: 50,
          align: "center",
          tooltip: true
        },
        {
          title: "状态",
          key: "taskStatus",
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
                params.row.taskStatus == 1 ? "空闲中" : "运行中"
              )
            );
            return h("div", newArr);
          }
        },
        {
          title: " ",
          minWidth: 150,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
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
            newArr.push(
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "开始巡视" },
                  on: {
                    click: () => {
                      this.startBoot(params);
                    }
                  }
                },
                params.row.taskStatus == 1 ? "开始任务" : "结束任务"
              )
            );
            newArr.push(
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1" },
                  props: { type: "text", content: "查看报告>" },
                  on: {
                    click: () => {
                      console.log(params);
                      this.$router.push({
                        path: "report",
                        query: {
                          taskId: params.row.taskId,
                          taskRunHisId: params.row.latestTaskRunHisId,
                          planType: params.row.taskType,
                          path:'/robot-one/detail?substationId=1&robotId=1',
                          name:'任务配置列表'
                        }
                      });
                    }
                  }
                },
                "查看报告>"
              )
            );
            return h("div", newArr);
          }
        }
      ],
      baseUrl:
        process.env.NODE_ENV === "development"
          ? that.$config.baseUrl.dev
          : that.$config.baseUrl.pro
    };
  },
  watch: {
    $route(to) {
      this.routeName = to.name;
    },
        // routeName(now) {
        //   if (now == "robot-twoList") {
        //     this.$set(this.dataBread, 2, "机器人二");
        //   } else {
        //     this.dataBread[2] = "机器人一";
        //     this.$set(this.dataBread, 2, "机器人一");
        //   }
        // }
  },
  methods: {
    success() {
      setTimeout(() => {
        this.getInfor();
      }, 2000);
    },
    changePage(cur) {
      this.specialInspectList.pageIndex = cur;
      this.getInfor();
    },
    startBoot(params) {
      let index = params.index;
      let substationId = this.$route.query.substationId;
      let robotId = this.$route.query.robotId;
      let state = "";
      if ("taskStatus" in params.row && params.row["taskStatus"] == 1) {
        this.specialInspectList["data"][index]["taskStatus"] = 2;
        state = "2";
      } else if ("taskStatus" in params.row && params.row["taskStatus"] == 2) {
        this.specialInspectList["data"][index]["taskStatus"] = 1;
        state = "1";
      }
      this.$forceUpdate();
      postAxiosData("/lenovo-robot/rest/taskControl", {
        taskID: params.row.taskId,
        substationID: substationId,
        robotID: robotId,
        state: state
      }).then(res => {
        if (res.data.resConf) this.$message.info("更新中，请稍等....");
        else this.$message.info(res.data.resInfo);
        setTimeout(() => {
          this.getInfor();
        }, 10000);
      });
    },
    getTableData() {
      const that = this;
      postAxiosData("/lenovo-robot/rest/taskNormalDetail", {
        taskId: that.taskId
      }).then(res => {
        let data = res.data;
        // data['roadImgPath'] =  that.baseUrl + '/' + data['roadImgPath']
        data["roadImgPath"] = data["roadImg"];
        that.dataList = data["details"];
        if (data["details"] == null) {
          that.dataList = [];
        }
        that.taskNormalData = data;
        that.$forceUpdate();
      });
    },
    initData() {
      const that = this;
      let substationId = this.$route.query.substationId;
      let robotId = this.$route.query.robotId;
      postAxiosData("/lenovo-robot/rest/tasks", {
        substationId: substationId,
        robotId: robotId
      }).then(res => {
        let data = res.data.taskList;
        data.map(item => {
          item["describeName"] = item["Name"];
        });
        that.InspectData = data;
        let index = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].length > 0) {
            index = i;
            break;
          }
        }
        that.onSelect(data[0]);
      });
    },
    onClose() {
      this.dialogVisible = false;
    },
    addTask() {
      this.dialogVisible = true;
    },
    onSelect(item) {
      this.taskId = item["ID"];
      this.titleInspect = item["Name"];
      this.getTableData();
    },
    getInfor() {
      let substationId = this.$route.query.substationId;
      let robotId = this.$route.query.robotId;
      getAxiosData("/lenovo-robot/rest/specialTasks", {
        substationId: substationId,
        robotId: robotId,
        pageIndex: this.specialInspectList["pageIndex"],
        pageRows: this.specialInspectList["pageRows"]
      }).then(res => {
        let data = res.data["specialTasks"];
        data.map(item => {
          item["start"] = 1;
        });
        this.title = "特殊巡视" + "(" + res.data["total"] + ")";
        this.specialInspectList["totalRows"] = res.data["total"];
        this.specialInspectList["data"] = data;
        this.$forceUpdate();
      });
      /* infrInformation().then(res => {
      });*/
    }
  },
  created() {
    this.initData();
    this.timer = setInterval(() => {
      this.getInfor();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  mounted() {
    this.getInfor();
    this.routeName = this.$route.name;
    /* setTimeout(()=>{
        this.dialogVisible = true
    },1000)*/
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.robotDetail {
  .dunoBtnTop .icon-xiala {
    /* width: 12px !important;
    height: 15px !important;*/
    right: 20px !important;
    top: 12px !important;
  }
  .configure {
    color: #ffffff;
    & > div {
      margin-top: 20px;
    }
    .main {
      height: 328px;
      padding: 20px;
      overflow: hidden;
      background-color: rgba(20, 40, 56, 0.8);
      & > div {
        float: left;
      }
      .left {
        width: 20%;
        .dunoBtnTop {
          min-width: 200px;
          display: inline-flex;
          padding-bottom: 0;
          height: 42px;
          border-bottom: 2px solid #305e83;
          .btnList {
            top: inherit !important;
            min-width: 200px;
            .title {
              background: rgba(20, 40, 56, 1);
              padding: 8px 20px;
            }
            .btnNr {
              color: white;
            }
          }
        }
        & > div:nth-child(2) {
          margin-top: 30px;
          p {
            margin-bottom: 10px;
          }
          & > p:nth-child(2) {
            margin-bottom: 40px;
          }
        }
      }
      .center {
        width: calc(40% - 20px);
        margin-left: 20px;
        .tablesTep {
          height: 100%;
          background-color: rgba(0, 0, 0, 0);
          .ivu-table-wrapper {
            .ivu-table-tip{
              background: #203E52;
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
            border: none;
            .ivu-table {
              font-size: 16px;
              border: none !important;
              color: #fff;
              background-color: rgba(0, 0, 0, 0);
            }
            .ivu-table:before,
            .ivu-table:after {
              background-color: rgba(0, 0, 0, 0);
            }
            .ivu-table td,
            .ivu-table th {
              font-size: 14px;
              height: 40px;
              color: #fff;
              border: none;
              background-color: rgba(0, 0, 0, 0);
            }
          }
          .ivu-select-dropdown {
            background-color: #1b3b47;
          }
        }
      }
      .right {
        width: calc(40% - 20px);
        margin-left: 20px;
        height: 100%;
        position: relative;
        .el-image {
          width: 100%;
          height: 100%;
          .image-slot{
            height: inherit;
            background: #707070;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #aaa;
          }
        }
      }
    }
  }
  .table {
    .patrol {
      margin: 0;
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
</style>


