<template>
  <div class="configDetail">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top">检测设备管理</div>
    <duno-main class="dunoMain">
      <Patrol />
      <Patrol />
      <Patrol :columns="columnsData" :title='title' :titleCon='titleCon' :isShowBtn="true" />
    </duno-main>
  </div>
</template>

<script>
import dunoMain from "_c/duno-m/duno-main";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import Patrol from "_c/duno-c/Patrol";
export default {
  name: "configDetail",
  components: {
    Breadcrumb,
    dunoMain,
    Patrol
  },
  data() {
    return {
      title:'特殊巡视 (2)',
      titleCon:'',
      dataBread: {
        "/": "操作中台",
        "/environmental": "配置管理",
        "/environmental/list": "任务配置"
      },
      columnsData: [
        {
          title: "总步骤",
          key: "step",
          minWidth: 50,
          align: "center",
          tooltip: true
        },
        {
          title: "监测设备",
          key: "device",
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
          key: "frequency",
          minWidth: 50,
          align: "center",
          tooltip: true
        },
        {
          title: "状态",
          key: "state",
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
          key: "Presentation",
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
  methods: {}
};
</script>

<style lang="scss">
.configDetail {
  width: 100%;

  .top {
    color: #ffffff;
    line-height: 40px;
  }
}
</style>
