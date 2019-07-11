<template>
  <div class="configDetail">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top">任务配置</div>
    <duno-main class="dunoMain">
      <Patrol :dataList="allInspectList" />
      <Patrol :dataList="nightInspectList" :title="titleTwo" />
      <Patrol
        :columns="columnsData"
        :dataList="specialInspectList"
        :title="title"
        :titleCon="titleCon"
        :isShowBtn="true"
      />
      <alert :visible="visible" @handleClose="closeDia" @handleSubmit="submitChange" />
    </duno-main>
  </div>
</template>

<script>
import dunoMain from "_c/duno-m/duno-main";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import Patrol from "_c/duno-c/Patrol";
import alert from "_c/duno-j/statistics/components/alert";
import { getAxiosData } from "@/api/axiosType";
export default {
  name: "configDetail",
  components: {
    Breadcrumb,
    dunoMain,
    Patrol,
    alert
  },
  data() {
    return {
      title: "特殊巡视 (2)",
      titleTwo: "熄灯巡视",
      titleCon: "",
      visible: false,
      allInspectList: [],
      nightInspectList: [],
      specialInspectList: [],
      dataBread: ["操作中台", "配置管理", "任务管理"],
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
          // render: (h, params) => {
          //   let newArr = [];
          //   newArr.push([
          //     h(
          //       "a",
          //       {
          //         class: "table_link",
          //         props: { type: "text" },
          //         on: {
          //           click: () => {
          //             this.visible = true;
          //           }
          //         }
          //       },
          //       "无"
          //     )
          //   ]);
          //   return h(
          //     "div",
          //     {
          //       class: {
          //         member_operate_div: true
          //       }
          //     },
          //     newArr
          //   );
          // }
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
          key: "status",
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
                    interval: true,
                    patrol: false
                  }
                },
                [
                  h(
                    "span",
                    {
                      class: {}
                    },
                    "任务间隔中"
                  )
                ]
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
      ]
    };
  },
  methods: {
    closeDia() {
      this.visible = false;
    },
    submitChange(info) {
      // 提交更改
      console.log(info);
      this.visible = false;
    },
    getDataList() {
      debugger;
      const that = this;
      getAxiosData("/lenovo-plan/api/plan/all-list").then(res => {
        if (res.code !== 200) {
          that.dataList = [];
          that.totalNum = 0;
          return that.$message.error(res.msg);
        }
        this.allInspectList = res.data.allInspectList;
        this.nightInspectList = res.data.nightInspectList;
        this.specialInspectList = res.data.specialInspectList;
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
    font-size: 24px;
  }
  .table_link {
    color: #5fafff !important;
    text-decoration: underline;
  }
  .dunoMain{
    height: inherit;
  }
}
</style>
