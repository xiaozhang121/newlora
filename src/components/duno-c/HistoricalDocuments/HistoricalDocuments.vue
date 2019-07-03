<template>
  <div :class="['HistoricalDocuments', !isShowTab? 'noHistorical':'']">
    <el-dialog class="elDialogMain" v-dialogDrag :close-on-click-modal="false" :visible="isOpen" :width="width" :top="top" :modal="false" @close="close">
      <div slot="title">
        <span class="title titleSpan" v-if="!isShowTab">{{title}}</span>
        <div v-if="isShowTab" class="titleBtn">
          <el-button class="titleTopBtn" v-if="activeName == 'fourth'" @click="clickExport()"><i class="iconfont icon-daochu"></i></el-button>
          <el-button class="titleTopBtn" v-if="activeName == 'fifth'" @click="clickMagnify($refs.contentMagnify)"><i class="iconfont icon-fangda"></i></el-button>
        </div>
      </div>
      <el-tabs v-if="isShowTab" v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane
          v-for="(tab,index) in tabPaneData"
          :key="index"
          :label="tab.label"
          :name="tab.name"
        ></el-tab-pane>
      </el-tabs>
      <div v-if="isClassify" class="classifyBtn">
        <el-button :class="[classifyActive == 'A'? 'classifyActive':'']" @click="clickClassify('A', true)">A 相</el-button>
        <el-button :class="[classifyActive == 'B'? 'classifyActive':'']" @click="clickClassify('B', true)">B 相</el-button>
        <el-button :class="[classifyActive == 'C'? 'classifyActive':'']" @click="clickClassify('C', true)">C 相</el-button>
      </div>
      <div class="connent" ref="contentMagnify">
        <slot></slot>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { DunoTablesTep } from "_c/duno-tables-tep";
import { method } from "bluebird";
import { mapState } from 'vuex'
import screenfull from 'screenfull'
import qs from 'qs'
export default {
  name: "HistoricalDocuments",
  props: {
    isShowTab: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
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
    },
    width: {
      type: String,
      default: () => {
        return '50%'
      }
    },
    top: {
      type: String,
      default: () => {
        return '15vh'
      }
    },
    itemId: {
      type: Number | String
    },
    isClassify: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  components: {
    DunoTablesTep
  },
  data() {
    return {
      activeName: "first",
      classifyActive: "A",
      isOpen: false
    };
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  watch: {
    dialogTableVisible(now) {
      this.isOpen = now
    }
  },
  methods: {
    clickClassify (type, flag) {
      this.classifyActive = type
      this.$emit('clickClassify', type, flag)
    },
    clickExport () {
      const baseUrl = process.env.NODE_ENV === 'development' ? this.$config.baseUrl.dev : this.$config.baseUrl.pro
      let params = qs.stringify({
        't': this.user.token,
        'monitorDeviceId': this.itemId
      })
      window.location.href = `${baseUrl}/lenovo-alarm/api/alarm/history/export?${params}`
    },
    clickMagnify (target) {
      screenfull.toggle(target)
    },
    close() {
      this.isOpen = !this.isOpen;
      if (this.isClassify && !this.isOpen) {
        this.clickClassify('A', false)
      }
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
.noHistorical {
  .el-dialog__headerbtn {
    top: 25px;
  }
}
  .HistoricalDocuments {
    width: 100%;
    height: 100%;
    .el-dialog__wrapper{
      overflow: visible !important;
    }
    .title {
      color: #fff;
      font-size: 22px;
    }
    .titleSpan {
      padding: 15px 10px;
      display: block;
      background: rgba(50, 95, 125, 0.8);
    }
    .el-dialog {
      box-shadow: 5px 0px 10px #333, 0px 5px 10px #333;
      background-color: rgba(18, 33, 39, 0.7);
      width: 100%;
      border-radius: 5px;
      position: relative;
      border: 1px solid #4b9bc1;
      .el-dialog__header {
        padding: 10px;
      }
      
      .el-dialog__body {
        .el-tabs {
          .el-tabs__header {
            width: 84%;
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
                    background-color: #305e83;
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
              /*height: 272px;*/
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
                      background-color: rgba(32, 54, 68, 0.7);
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
                  background-color: #1b3b47;
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
              background-color: #1b3b47;
            }
            .selected {
              background-color: #1b3b47;
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
    .titleBtn {
      float: right;
      margin-right: 42px;
      margin-top: 12px;
      z-index: 5;
      position: relative;
      .titleTopBtn {
        background: transparent;
        width: auto;
        height: auto;
        line-height: initial;
        padding: 0;
        border: none;
        .iconfont {
          font-size: 22px;
          color: #fff;
        }
      }
    }
    .classifyBtn {
      position: absolute;
      top: 45px;
      left: -68px;
      button {
        display: block;
        margin: 10px 0;
        background-color: rgba(27, 59, 71, 0.7);
        border: none;
      }
      .classifyActive {
        background: rgba(32, 54, 68, 0.7);
      }
    }
  }
</style>