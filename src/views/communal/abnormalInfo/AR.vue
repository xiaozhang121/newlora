<template>
  <div class="ARList">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top not-print">
      <div class="title">AR眼镜上传图片</div>
      <div class="btn">
         <div>
          <div @click="clickExcel">
            <i class="iconfont icon-daochu1"></i>
            导出表格
          </div>
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
        :isShowPage="mixinViewModuleOptions.isShowPage"
        @on-select="dataListSelectionChangeHandle"
        @clickPage="pageCurrentChangeHandle"
        @on-page-size-change="pageSizeChangeHandle"
      />
    </duno-main>
  </div>
</template>

<script>
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import dunoMain from "_c/duno-m/duno-main";
import moment from "moment";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import mixinViewModule from "@/mixins/view-module";
import { DunoTablesTep } from "_c/duno-tables-tep";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import screenfull from "screenfull";
export default {
  name: "abnormalInfo",
  mixins: [mixinViewModule],
  components: {
    dunoBtnTop,
    KeyMonitor,
    dunoMain,
    DunoTablesTep,
    Breadcrumb,
  },
  data() {
    const that = this;
    return {
      handleNotes: [],
      alarmType: "",
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: "/lenovo-alarm/api/alarm/history",
        exportURL: "/lenovo-alarm/api/alarm/history/export"
      },
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "/abnormalInfoPath/defectLibrary", name: "权限库管理" },
        { path: "", name: "AR眼镜上传图片" }
      ],
      isFileType: false,
      visibleSettingOption: false,
      visible: false,
      isEnlarge: false,
      totalNum: 20,
      pageRows: 20,
      selectInfo: "更多",
      serious: false,
      commonly: false,
      danger: false,
      srcData: [],
      value: "",
      columns: [
        {
          title: "时间",
          key: "alarmTime",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let timeDay = params.row.alarmTime.slice(5);
            return h("div", [
              h(
                "Tooltip",
                {
                  props: {
                    placement: "top",
                    content: timeDay,
                    transfer: true,
                    maxWidth: "200"
                  }
                },
                [
                  h(
                    "div",
                    {
                      style: {
                        display: "inline-block",
                        width: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }
                    },
                    timeDay
                  )
                ]
              )
            ]);
          }
        },
        {
          title: "报警对象",
          key: "mainDevice",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h(
                "div",
                params.row.mainDevice == null ? "/" : params.row.mainDevice
              )
            ]);
            return h("div", newArr);
          }
        },
        {
          title: "报警部位",
          key: "powerDeviceName",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h(
                "Tooltip",
                {
                  props: {
                    placement: "top",
                    content: params.row.powerDeviceName,
                    transfer: true,
                    maxWidth: "200"
                  }
                },
                [
                  h(
                    "div",
                    {
                      style: {
                        display: "inline-block",
                        width: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }
                    },
                    params.row.powerDeviceName == null
                      ? "/"
                      : params.row.powerDeviceName
                  )
                ]
              )

              // h(
              //   "div",
              //   params.row.powerDeviceName == null
              //     ? "/"
              //     : params.row.powerDeviceName
              // )
            ]);
            return h("div", newArr);
          }
        },
        {
          title: "区域",
          key: "areaName",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "描述",
          key: "alarmContent",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "缺陷等级",
          key: "alarmLevelName",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push(
              h(
                "i-dropdown",
                {
                  props: { trigger: "click", placement: "bottom-start" },
                  style: { marginLeft: "5px" },
                  on: {
                    "on-click": value => {
                      console.log(value);
                    }
                  }
                },
                [
                  h("div", { class: { member_operate_div: true } }, [
                    h(
                      "div",
                      {
                        class: {
                          table_select: true,
                          serious: params.row.alarmLevel === "2",
                          commonly: params.row.alarmLevel === "1",
                          danger: params.row.alarmLevel === "3"
                        }
                      },
                      [
                        h("span", this.cutOut(params.row.alarmLevelName), {
                          class: { member_operate_div: true }
                        }),
                        h("i", {
                          style: { marginLeft: "5px" },
                          class: { "iconfont icon-xiala": true }
                        })
                      ]
                    )
                  ]),
                  h("i-dropdownMenu", { slot: "list" }, [
                    h("i-dropdownItem", {}, [
                      h(
                        "div",
                        {
                          class: { alarmLevel: true },
                          on: {
                            click: () => {
                              that.onClickDropdown(params.row, "一般", "1");
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
                          class: { alarmLevel: true },
                          on: {
                            click: () => {
                              that.onClickDropdown(params.row, "严重", "2");
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
                          class: { alarmLevel: true },
                          on: {
                            click: () => {
                              that.onClickDropdown(params.row, "危急", "3");
                            }
                          }
                        },
                        "危急"
                      )
                    ])
                  ])
                ]
              )
            );
            return h("div", newArr);
          }
        },
        {
          title: "来源",
          key: "monitorDeviceName",
          minWidth: 150,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h(
                "Tooltip",
                {
                  props: {
                    placement: "top",
                    maxWidth: "200",
                    content: params.row.monitorDeviceName
                      ? params.row.monitorDeviceName
                      : params.row.source,
                    transfer: true
                  },
                  style: {
                    // display: "inline-block",
                    // width: "100%",
                    // overflow: "hidden",
                    // textOverflow: "ellipsis",
                    // whiteSpace: "nowrap"
                  }
                },
                [
                  h(
                    "a",
                    {
                      class: "table_link",
                      props: { type: "text" },
                      on: {
                        click: () => {
                          this.getJump(params.row);
                        }
                      }
                    },
                    params.row.monitorDeviceName
                      ? params.row.monitorDeviceName
                      : params.row.source
                  )
                ]
              )
            ]);
            return h("div", { class: { member_operate_div: true } }, newArr);
          }
        },
        {
          title: "视频/图片",
          key: "id",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            if (params.row.fileType == "1") {
              newArr.push([
                h("img", {
                  class: "imgOrMv",
                  attrs: { src: params.row.alarmFileAddress },
                  draggable: false,
                  on: {
                    click: () => {
                      that.isEnlarge = true;
                      that.srcData = params.row;
                      that.$forceUpdate();
                    }
                  }
                })
              ]);
            } else if (params.row.fileType == "2") {
              newArr.push([
                h("video", {
                  class: "imgOrMv",
                  attrs: { src: params.row.alarmFileAddress },
                  draggable: false,
                  on: {
                    click: () => {
                      that.isEnlarge = true;
                      that.srcData = params.row;
                      that.$forceUpdate();
                    }
                  }
                })
              ]);
            }
            return h("div", newArr);
          }
        },
        // {
        //   title: "处理记录",
        //   key: "dealRecord",
        //   width: 120,
        //   align: "center",
        //   tooltip: true
        // },
        {
          title: " ",
          key: "id",
          width: 200,
          align: "center",
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h(
                "el-button",
                {
                  class: ["btnClass", { grey: params.row.isReturn == "1" }],
                  props: { disabled: params.row.isReturn == "1" },
                  style: { marginRight: "20px" },
                  on: {
                    click: () => {
                      that.restoration(params.row, params.row.isReturn);
                    }
                  }
                },
                params.row.isReturn == "0" ? "复归" : "已复归"
              )
            ]);
            newArr.push([
              h(
                "el-button",
                {
                  class: "table_link",
                  style: { marginRight: "20px" },
                  props: { type: "text" },
                  on: {
                    click: () => {
                      that.handleNotes = [];
                      that.handleNotes.push({
                        dealTime: params.row.dealTime,
                        dealType: params.row.dealRecord
                      });
                      that.alarmType = params.row.alarmType;
                      that.popData = params.row;
                      that.alarmLevel = params.row.alarmLevel;
                      that.visible = true;
                      that.$forceUpdate();
                    }
                  }
                },
                "详情"
              )
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
      typeList: [],
      regionList: [],
      statusList: [],
      popData: {},
      clcikQueryData: {},
      alarmLevel: ""
    };
  },
  created() {

  },
  methods: {

  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.ARList {
  .el-select-dropdown {
    background: linear-gradient(
      210deg,
      rgba(48, 107, 135, 0.9),
      rgba(28, 50, 64, 0.7) 60%
    ) !important;
    border: none !important;
    margin-top: 1px !important;
    margin-left: 0px;
    border-radius: 0;
    min-width: 153px !important;
  }
  .el-select-dropdown__item,
  .el-select-dropdown__empty,
  .el-select-dropdown__item.selected {
    color: white;
  }
  .el-select-dropdown__list {
    position: relative;
    top: -5px;
  }
  .el-popper[x-placement^="bottom"] .popper__arrow {
    display: none;
  }
  .main .content-wrapper {
    padding-top: 0;
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
}
</style>

<style lang="scss">
.ARList {
  width: 100%;
  .btnClass {
    border-radius: 15px;
    background: #3a81a1;
    margin: auto;
    border: none;
    &.grey {
      background: #979797;
      color: #767676;
    }
  }
  //-------------------表格样式
  .dunoMain {
    height: inherit;
  }
  .ivu-table th {
    color: #fff;
    border: none;
    height: 60px;
    background-color: #2d5980 !important;
    font-size: 18px;
    font-weight: normal;
    @media screen and (min-width: 3500px) {
      height: 50px;
      font-size: 16px;
    }
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
  .ivu-table {
    font-size: 16px;
    // @media screen and (min-width: 3500px) {
    //   font-size: 14px;
    // }
  }
  .ivu-table-wrapper {
    tr {
      td {
        height: 60px;
        // @media screen and (min-width: 3500px) {
        //   height: 50px;
        //   font-size: 14px;
        // }
      }
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
  }
  .ivu-table-cell {
    @media screen and (min-width: 3500px) {
      padding-left: 10px;
      padding-right: 10px;
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
  .flexPos {
    display: flex;
    align-items: center;
  }
  .imgOrMv {
    width: 80%;
    height: 45px;
    position: relative;
    top: 2px;
  }
  .table_link {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
    width: 140px;
    font-size: 16px;
    color: #5fafff !important;
    text-decoration: underline;
  }
  .table_abnormalInfo {
    padding: 36px 18px;
  }
  .table_select {
    cursor: pointer;
    color: #1d1f26;
    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 30px;
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
    height: 40px;
    margin-bottom: 10px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    .title{
      color: #fff;
      font-size: 20px;
      line-height: 40px;
    }
    .btn {
      display: flex;
      justify-content: space-between;
    }
  }
  .icon-xiala {
    color: white;
    font-size: 13px;
  }
  .dropSelf {
    .icon-xiala {
      font-size: 9px;
      position: absolute;
    }
  }
}
.setting {
  cursor: pointer;
  i {
    font-size: 25px;
    position: relative;
    top: 3px;
    padding-right: 5px;
  }
}
</style>
