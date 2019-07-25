<template>
  <div class="robotDetail">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="configure">
      <div>任务配置管理（机器人一）</div>
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
              <span>1日</span>
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
          <img :src="taskNormalData['roadImgPath']" />
        </div>
      </div>
    </div>
    <div class="table">
      <Patrol
        :isShowBtn="true"
        :columns="columnsData"
        :dataList="specialInspectList"
        :title="title"
        :titleCon="titleCon"
        @add-task="addTask"
      />
      <el-pagination
        :page-size="specialInspectList.pageSize"
        :current-page="specialInspectList.pageIndex"
        layout="prev, pager, next"
        :total="specialInspectList.totalRows"
      ></el-pagination>
    </div>
    <select-district @on-close="onClose" :visible="dialogVisible" />
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import Patrol from "_c/duno-c/Patrol";
import { DunoTablesTep } from "_c/duno-tables-tep";
import mixinViewModule from "@/mixins/view-module";
import { postAxiosData } from '@/api/axiosType'
import selectDistrict from '_c/duno-m/selectDistrict'
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
    const that = this
    return {
      taskNormalData: '',
      dialogVisible: false,
      mixinViewModuleOptions: {
        activatedIsNeed: true
        // getDataListURL: "/lenovo-plan/api/statistics/plan/list"
      },
      InspectData: [],
      specialInspectList: [],
      title: "特殊巡视 (2)",
      titleCon: "",
      dataList: [
        {
          step: "4号主变",
          record: "数值/状态"
        },
        {
          step: "4号主变",
          record: "数值/状态"
        },
        {
          step: "4号主变",
          record: "数值/状态"
        },
        {
          step: "4号主变",
          record: "数值/状态"
        },
        {
          step: "4号主变",
          record: "数值/状态"
        },
        {
          step: "4号主变",
          record: "数值/状态"
        },
        {
          step: "4号主变",
          record: "数值/状态"
        },
        {
          step: "4号主变",
          record: "数值/状态"
        },
        {
          step: "4号主变",
          record: "数值/状态"
        }
      ],
      titleInspect: "例行巡视编号",
      dataBread: ["操作中台", "机器人巡视", "机器人一", "任务配置管理"],
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
          key: "dataType",
          title: "记录内容",
          minWidth: 100,
          align: "center"
        }
      ],
      columnsData: [
        {
          title: "巡视名称",
          key: "inspectName",
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
          title: "巡视间隔",
          key: "interval",
          minWidth: 50,
          align: "center",
          tooltip: true,
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
                      this.visible = true;
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
          }
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
                      console.log(111);
                    }
                  }
                },
                "开始巡视"
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
                      console.log(111);
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
      baseUrl: process.env.NODE_ENV === 'development' ? that.$config.baseUrl.dev : that.$config.baseUrl.pro
    };
  },
  methods: {
    initData(){
        const that = this
        postAxiosData('/robot/rest/taskNormalDetail',{'taskId':'14'}).then(res=>{
          let data = res.data
          data['roadImgPath'] =  that.baseUrl + '/' + data['roadImgPath']
          that.dataList = data['details']
          that.taskNormalData =  data
          that.$forceUpdate()
        })
    },
    onClose(){
      this.dialogVisible = false
    },
    addTask(){
      this.dialogVisible = true
    },
    onSelect(item) {
      this.titleInspect = item["describeName"];
    },
    getInfor() {
      infrInformation().then(res => {
        this.InspectData = res.data.specialInspectList;
      });
    }
  },
  created(){
      this.initData()
  },
  mounted() {
    this.getInfor();
   /* setTimeout(()=>{
        this.dialogVisible = true
    },1000)*/
  }
};
</script>

<style lang="scss">
.robotDetail {
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
          min-width: 300px;
          display: inline-flex;
          padding-bottom: 0;
          height: 42px;
          border-bottom: 2px solid #305e83;
          .btnList {
            top: inherit !important;
            min-width: 300px;
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
            tr:nth-child(odd) {
              td {
                background-color: #1b3b47;
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
        img{
          width: 100%;
          height: 100%;
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


