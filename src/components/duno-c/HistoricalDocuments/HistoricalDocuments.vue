<template>
  <div class="HistoricalDocuments">
    <el-dialog :visible="isOpen" width="50%" top="25vh" :modal="false" @close="close">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane
          v-for="(tab,index) in tabPaneData"
          :key="index"
          :label="tab.label"
          :name="tab.name"
        ></el-tab-pane>
      </el-tabs>
      <div class="connent">
        <slot></slot>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { DunoTablesTep } from "_c/duno-tables-tep";
import { method } from "bluebird";
export default {
  name: "HistoricalDocuments",
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false
    }, //是否弹出模态框
    dataList: {
      type: Array,
      default: () => {
        return [];
      }
    }, //表格数据
    tabPaneData: {
      type: Array, //头部标签页
      default: () => {
        return [
          {
            label: "实时监控",
            name: "first"
          },
          {
            label: "巡航",
            name: "second"
          },
          {
            label: "预置位",
            name: "third"
          },
          {
            label: "历史告警",
            name: "fourth"
          },
          {
            label: "历史数据",
            name: "fifth"
          },
          {
            label: "历史文件",
            name: "sixth"
          }
        ];
      }
    }
  },
  components: {
    DunoTablesTep
  },
  data() {
    return {
      activeName: "sixth",
      isOpen: false
    };
  },
  watch: {
    dialogTableVisible(now) {
        debugger
      this.isOpen = now
    }
  },
  methods: {
    close() {
      this.isOpen = !this.isOpen;
      this.$emit("close", this.isOpen);
    },
    handleClick(tab) {
      this.activeName = tab.name;
      this.$emit("on-show", this.activeName);
    }
  },
  mounted() {
    this.isOpen = this.dialogTableVisible
  }
};
</script>
<style lang="scss">
.HistoricalDocuments {
  width: 100%;
  height: 100%;
  .el-dialog {
    box-shadow: 5px 0px 10px #333, 0px 5px 10px #333;
    background-color: rgba(47, 51, 63, 0.7);
    width: 100%;
    border-radius: 5px;
    position: relative;
    .el-dialog__body {
      .el-tabs {
        .el-tabs__header {
          width: 90%;
          position: absolute;
          top: 0;
          left: 0;
          border: none;
          .el-tabs__nav-wrap {
            border: none;
            .el-tabs__nav-scroll {
              border: none;
              .el-tabs__nav {
                border: none;
                .el-tabs__item {
                  width: 96px;
                  text-align: center;
                  border: none;
                  margin-right: 5px;
                  border-radius: 3px;
                  color: #fff;
                  background-color: #515970;
                  opacity: 0.7;
                }
                .is-active {
                  opacity: 1;
                  color: #ffffff;
                }
              }
            }
          }
        }
      }
      .connent {
        & > div {
          p {
            font-size: 18px;
          }
          color: #ffffff;
          .AlarmModuleTable {
            height: 272px;
            margin-top: 20px;
            overflow: hidden;
            .tablesTep {
              overflow-y: scroll;
              height: 100%;
              background-color: rgba(0, 0, 0, 0);
              .ivu-table-wrapper {
                margin-right: 15px;
                tr:nth-child(odd) {
                  td {
                    background-color: rgba(81, 89, 113, 0.7);
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
          //滚动条样式
          ::-webkit-scrollbar {
            width: 10px;
            height: 5px;
          }
          ::-webkit-scrollbar-button {
            display: none;
          }
          ::-webkit-scrollbar-track {
            display: none;
          }
          ::-webkit-scrollbar-thumb {
            background: #515970;
            border-radius: 5px;
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
      }
    }
  }
  .tableBtnName {
    background-size: contain;
    box-sizing: border-box;
    z-index: 99;
  }
  .el-dialog__close {
    color: #fff;
    font-size: 30px;
  }
}
</style>