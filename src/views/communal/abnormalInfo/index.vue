<template>
  <div class="abnormalInfo">
    <!-- <div class="title"></div> -->
    <div class="top">
      <div>
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTo"
            :isCheck="false"
            :dataList="typeMold"
            :title="titleTypeL"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="typeMold"
            :title="titleTypeC"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="typeMold"
            :title="titleTypeR"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
      </div>
      <div class="btn">
        <div class="dateChose">
          <el-date-picker
            unlink-panels
            v-model="value"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="onChangeTime"
          ></el-date-picker>
        </div>
        <div>
          <div>导出Excel</div>
        </div>
        <div class="setting" @click="showSetting">
          <i class="iconfont icon-ico_menu__systemsettings"></i>
        </div>
      </div>
    </div>
    <duno-main class="dunoMain">
      <duno-tables-tep
        class="table_abnormalInfo"
        :columns="columns"
        :data="dataList"
        :totalNum="totalNum"
        :pageSize="pageRows"
        :current="pageIndex"
        :border="true"
        :showSizer="true"
        @on-select="dataListSelectionChangeHandle"
        @clickPage="pageCurrentChangeHandle"
        @on-page-size-change="pageSizeChangeHandle"
      />
    </duno-main>
    <warning-setting @handleClose="onClose" :visibleOption="visibleSettingOption"/>
  </div>
</template>

<script>
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import dunoMain from "_c/duno-m/duno-main";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import warningSetting from '_c/duno-j/warningSetting'
import { DunoTablesTep } from "_c/duno-tables-tep";
export default {
  name: "abnormalInfo",
  components: {
    dunoBtnTop,
    KeyMonitor,
    dunoMain,
    DunoTablesTep,
    warningSetting
  },
  data() {
    const that = this;
    return {
      visibleSettingOption: false,
      totalNum: 500,
      pageRows: 20,
      selectInfo: "更多",
      serious: false,
      commonly: false,
      danger: false,
      value: "",
      titleTypeL: "所有区域",
      titleTypeC: "所有状态",
      titleTypeR: "所有来源",
      columns: [
        {
          title: "时间",
          key: "nickname",
          minWidth: 50,
          align: "center",
          tooltip: true
        },
        {
          title: "报警对象",
          key: "phone",
          minWidth: 50,
          align: "center",
          tooltip: true
        },
        {
          title: "报警部位",
          key: "phone",
          minWidth: 50,
          align: "center",
          tooltip: true
        },
        {
          title: "区域",
          key: "phone",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "报警内容",
          key: "phone",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "警告级别",
          key: "submitTime",
          minWidth: 90,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push(
              h(
                "i-dropdown",
                {
                  props: { trigger: "click", placement: "bottom-start" },
                  style: {
                    marginLeft: "5px"
                  },
                  on: {
                    "on-click": value => {
                      console.log(value);
                    }
                  }
                },
                [
                  h(
                    "div",
                    {
                      class: {
                        member_operate_div: true
                      }
                    },
                    [
                      h(
                        "div",
                        {
                          class: {
                            table_select: true,
                            serious: false,
                            commonly: true,
                            danger: false
                          }
                        },
                        [
                          h("span", that.selectInfo, {
                            class: {
                              member_operate_div: true
                            }
                          }),
                          h("i", {
                            style: {
                              marginLeft: "5px"
                            },
                            class: {
                              "iconfont icon-xiala": true
                            }
                          })
                        ]
                      )
                    ]
                  ),
                  h(
                    "i-dropdownMenu",
                    {
                      slot: "list"
                    },
                    [
                      h("i-dropdownItem", {}, [
                        h(
                          "div",
                          {
                            class: {
                              alarmLevel: true
                            },
                            on: {
                              click: () => {
                                that.selectInfo = "一般";
                              }
                            }
                          },
                          "一般"
                        )
                      ]),
                      h("i-dropdownItem", {}, [
                        h(
                          "div",
                          {
                            class: {
                              alarmLevel: true
                            },
                            on: {
                              click: () => {
                                that.selectInfo = "严重";
                              }
                            }
                          },
                          "严重"
                        )
                      ]),
                      h("i-dropdownItem", {}, [
                        h(
                          "div",
                          {
                            class: {
                              alarmLevel: true
                            },
                            on: {
                              click: () => {
                                that.selectInfo = "危急";
                              }
                            }
                          },
                          "危急"
                        )
                      ])
                    ]
                  )
                ]
              )
            );
            return h("div", newArr);
          }
        },
        {
          title: "信息来源",
          key: "sysUserId",
          minWidth: 90,
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
                      alert("");
                    }
                  }
                },
                "可见光摄像头ID"
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
          title: "视频/图片",
          key: "id",
          width: 120,
          fixed: "right",
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push([h("img", { class: "imgOrMv", draggable: false })]);
            return h("div", newArr);
          }
        },
        {
          title: "处理记录",
          key: "id",
          width: 120,
          fixed: "right",
          align: "center",
          tooltip: true
        },
        {
          title: " ",
          key: "id",
          width: 120,
          fixed: "right",
          align: "center",
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h(
                "el-button",
                {
                  class: "table_link",
                  style: { marginRight: "20px" },
                  props: { type: "text" },
                  on: {
                    click: () => {
                      alert("");
                    }
                  }
                },
                "复归"
              )
            ]);
            newArr.push([
              h("i", {
                class: "iconfont icon-daochu",
                style: {
                  cursor: "pointer",
                  position: "relative",
                  top: "0.2px"
                },
                props: { type: "text" },
                on: {
                  click: () => {
                    alert("");
                  }
                }
              })
            ]);
            return h(
              "div",
              {
                class: "flexPos"
              },
              newArr
            );
          }
        }
      ],
      dataList: [
        {
          nickname: 123123,
          phone: 235646465,
          submitTime: 6545646,
          sysUserId: 6544564
        },
        {
          nickname: 123123,
          phone: 235646465,
          submitTime: 6545646,
          sysUserId: 6544564
        },
        {
          nickname: 123123,
          phone: 235646465,
          submitTime: 6545646,
          sysUserId: 6544564
        },
        {
          nickname: 123123,
          phone: 235646465,
          submitTime: 6545646,
          sysUserId: 6544564
        },
        {
          nickname: 123123,
          phone: 235646465,
          submitTime: 6545646,
          sysUserId: 6544564
        },
        {
          nickname: 123123,
          phone: 235646465,
          submitTime: 6545646,
          sysUserId: 6544564
        },
        {
          nickname: 123123,
          phone: 235646465,
          submitTime: 6545646,
          sysUserId: 6544564
        },
        {
          nickname: 123123,
          phone: 235646465,
          submitTime: 6545646,
          sysUserId: 6544564
        },
        {
          nickname: 123123,
          phone: 235646465,
          submitTime: 6545646,
          sysUserId: 6544564
        },
        {
          nickname: 123123,
          phone: 235646465,
          submitTime: 6545646,
          sysUserId: 6544564
        }
      ]
    };
  },
  methods: {
    onClose(){
        this.visibleSettingOption = false
    },
    showSetting(){
        this.visibleSettingOption = true
    },
    onSelect(item, index) {
      this.layoutType = item["describeName"];
    },
    onChangeTime(data) {
      const startTime = moment(data[0]).format("YYYY-MM-DD");
      const endTime = moment(data[1]).format("YYYY-MM-DD");
      this.startTime = JSON.parse(JSON.stringify(startTime));
      this.endTime = JSON.parse(JSON.stringify(endTime));
      this.$emit("onChange", data);
    }
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.abnormalInfo {
  width: 100%;
  //-------------------表格样式
  .ivu-table th {
    color: #fff;
    border: none;
    height: 60px;
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
  .el-button--text {
    border-color: transparent !important;
    background: transparent !important;
  }
  .alarmLevel {
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
      width: 45px;
      height: 22px;
      border-radius: 20px;
    }
    &.serious {
      span {
        background: #f4a723;
      }
    }
    &.commonly {
      span {
        background: #5eb0fc;
      }
    }
    &.danger {
      span {
        background: #d0011b;
      }
    }
  }
  .top {
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      display: flex;
      justify-content: space-between;
      & > div {
        margin-right: 10px;
        .dunoBtnTop {
          width: 120px;
          display: inline-flex;
          padding-bottom: 0;
          .btnList {
            top: inherit !important;
            width: 120px;
            .title {
              font-size: 15px;
            }
          }
        }
      }
    }
    .btn {
      display: flex;
      justify-content: space-between;
      & > div {
        margin-left: 10px;
        i{
          font-size: 25px;
          padding-right: 5px;
        }
      }
      & > div:nth-child(2) {
        & > div {
          width: 140px;
          line-height: 32px;
          text-align: center;
          background-color: #192f41;
          cursor: pointer;
        }
      }
      & > div:last-child {
        font-size: 22px;
      }
      .dateChose {
        .el-date-editor {
          background-color: #192f41;
          border: none;
          .el-range-input {
            background-color: rgba(81, 89, 112, 0);
          }
          .el-range-separator {
            font-size: 20px;
            color: #fff;
          }
          .el-range-input {
            color: #fff;
          }
        }
      }
    }
  }
  .icon-xiala {
    color: white;
    font-size: 13px;
  }
}
.setting{
  cursor: pointer;
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
