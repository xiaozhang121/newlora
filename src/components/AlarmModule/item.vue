<template>
  <div class="AlarmModule">
    <div class="AlarmModuleTop">
      <div class="fl">
        <span>{{ volt }}</span>
      </div>
      <div class="fr">
        <el-select v-model="value" @change="onChange" placeholder="设备类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="AlarmModuleTable">
      <duno-tables-tep
        :columns="newColumns"
        :data="dataList"
        :border="true"
        :stripe="true"
        :isShowPage="false"
        :showSizer="true"
        :height="272"
      />
    </div>
  </div>
</template>
<script>
import { DunoTablesTep } from "_c/duno-tables-tep";
export default {
  name: "Item",
  props: {
    index:{
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      default: () => {
        return [];
      }
    }, //设备类型
    dataList: {
      type: Array,
      default: () => {
        return [];
      }
    }, //表格数据
    volt: {
      type: String, //显示多少千伏
      default: ""
    },
    isHandle: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    columns: {
      type: Array, //表头
      default: () => {
        return []
      }
    }
  },
  components: {
    DunoTablesTep
  },
  data() {
    return {
      value: "",
      handleImg: require("@/assets/images/btn/ico_operation__check.png"),
      newColumns: [
        {
            key: "alarmTime",
            title: "时间",
            minWidth: 80,
            align: "left"
          },
          {
            key: "deviceName",
            title: "设备名称",
            minWidth: 100,
            align: "left"
          },
          {
            key: "alarmContent",
            title: "告警信息",
            minWidth: 100,
            align: "center"
          },
       /*   {
            title: "处理记录",
            key: "id",
            width: 80,
            align: "center",
            render: (h, params) => {
              let newArr = [];
              if (this.isHandle) {
                newArr.push(
                  h(
                    "el-tooltip",
                    { props: { content: "处理" }},
                    [
                      h("el-button", {
                        class: "tableBtnName",
                        style: { backgroundImage: "url(" + this.handleImg + ")",  backgroundSize: "contain",boxSize: "border-box"},
                        on: { click: () => {}}
                      })
                    ]
                  )
                );
              }
              return h("div", newArr);
            }
          }*/
          {
              title: "处理记录",
              key: "id",
              width: 100,
              align: "center",
              render: (h, params) => {
                  return h("div", '暂无');
              }
          }
      ]
    };
  },
  watch: {
    columns: {
      handler (now) {
        console.log('b')
        if (now && now.length) {
          this.newColumns = now
        }
      },
      deep: true
    }
  },
  methods: {
    onChange() {
      this.$emit("onChange", {value: this.value, index: this.index});
    }
  },
  mounted () {}
};
</script>
<style lang="scss">
.AlarmModule {
  background-color: #272b35;
  width: 100%;
  margin: 10px auto;
  border-radius: 3px;
  padding: 20px;
  color: #fff;
  overflow: hidden;
  &Top {
    overflow: hidden;
    .el-select {
      background-color: rgba(0, 0, 0, 0);
      width: 120px;
      .el-input {
        background-color: rgba(0, 0, 0, 0);
        .el-input__inner {
          border: none;
          color: #fff;
          background-color: #303544;
        }
        .el-select__caret {
          background-color: rgba(0, 0, 0, 0);
        }
      }
      .el-input::-webkit-scrollbar-corner {
        background-color: rgba(0, 0, 0, 0);
      }
    }
  }
  &Table {
    margin-top: 20px;
    overflow: hidden;
    .tablesTep {
      height: 100%;
      background-color: rgba(0, 0, 0, 0);
      .ivu-table-wrapper {
        tr:nth-child(odd) {
          td {
            background-color: #303544;
          }
        }
        border: none;
        .ivu-table {
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
          color: #fff;
          border: none;
          background-color: rgba(0, 0, 0, 0);
        }
      }
      .ivu-select-dropdown {
        background-color: #303544;
      }
    }
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
}
.el-select-dropdown {
  border: none;
  background-color: #272b35;
  .el-select-dropdown__item {
    color: #fff;
  }
  .el-select-dropdown__item:hover {
    background-color: #303544;
  }
  .selected {
    background-color: #303544;
  }
}
</style>