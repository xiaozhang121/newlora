<template>
  <div class="surveillanceDetail">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="Main_contain">
      <div class="content">
        <div class="left nr">
          <div class="item">
            <div class="camera_surveillanceDetail">
              <div class="contain">
                <key-monitor
                  paddingBottom="56%"
                  class="monitor"
                  streamAddr="rtmp://47.103.63.92:1935/rtsp/stream1"
                  :showBtmOption="false"
                ></key-monitor>
              </div>
            </div>
            <div class="control">
              <div class="controBtnContain">
                <contro-btn></contro-btn>
              </div>
              <div class="inputGroup">
                <el-input v-model="presetName" placeholder="添加预置位名称"></el-input>
                <el-button class="addPoint" type="success">添加</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="right nr contain">
          <inspection></inspection>
        </div>
      </div>
      <div class="middle_table">
        <div class="top">
          <div class="name">历史信息记录</div>
          <div class="select">
            <div>
              <duno-btn-top
                @on-select="onSelect"
                class="dunoBtnTo"
                :isCheck="false"
                :dataList="allDataKind"
                :title="titleTypeL"
                :showBtnList="false"
              ></duno-btn-top>
            </div>
            <div>
              <duno-btn-top
                @on-select="onSelect"
                class="dunoBtnTop"
                :isCheck="false"
                :dataList="allDataLevel"
                :title="titleTypeC"
                :showBtnList="false"
              ></duno-btn-top>
            </div>
          </div>
          <div class="btn">
            <div class="dateChose">
              <el-date-picker
                unlink-panels
                v-model="dataTime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
            <div>
              <div class="exportExcel">导出Excel</div>
            </div>
          </div>
        </div>
        <duno-tables-tep
          class="table_abnormalInfo"
          :columns="columns"
          :data="dataList"
          :totalNum="totalNum"
          :pageSize="pageRows"
          :current="pageIndex"
          :border="true"
          :isShowPage="false"
          :showSizer="true"
          @on-select="dataListSelectionChangeHandle"
          @clickPage="pageCurrentChangeHandle"
          @on-page-size-change="pageSizeChangeHandle"
        />
      </div>
      <div class="historicalData">
        <div class="top">
          <div>历史数据</div>
          <div class="btn">
            <div>
              <duno-btn-top
                @on-select="onSelect"
                class="dunoBtnTop"
                :isCheck="false"
                :dataList="typeList"
                :title="titleType"
                :showBtnList="false"
              ></duno-btn-top>
            </div>
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
              <div @click="clickExcel" class="clickBtn">
                <i class="iconfont icon-daochu1"></i>
                导出Excel
              </div>
            </div>
          </div>
        </div>
        <div class="con-chart">
          <echarts />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import echarts from "_c/duno-c/echarts";
import controBtn from "_c/duno-m/controBtn";
import mixinViewModule from "@/mixins/view-module";
import inspection from "_c/duno-m/inspection";
import { DunoTablesTep } from "_c/duno-tables-tep";
export default {
  name: "surveillanceDetail",
  mixins: [mixinViewModule],
  components: {
    dunoBtnTop,
    KeyMonitor,
    Breadcrumb,
    controBtn,
    inspection,
    DunoTablesTep,
    echarts
  },
  data() {
    return {
      titleType: "选择预置位",
      titleTypeL: "全部数据类型",
      titleTypeC: "全部异常类型",
      columns: [
        {
          title: "时间",
          key: "alarmTime",
          minWidth: 100,
          align: "center",
          tooltip: true
        },
        {
          title: "报警对象",
          key: "powerDeviceName",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "报警部位",
          key: "alarmPart",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "区域",
          key: "areaName",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "报警内容",
          key: "alarmContent",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "警告级别",
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
          title: "信息来源",
          key: "monitorDeviceId",
          minWidth: 150,
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
                      console.log("摄像头ID：", params.row.monitorDeviceId);
                    }
                  }
                },
                params.row.monitorDeviceId
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
                  draggable: false
                })
              ]);
            } else if (params.row.fileType == "2") {
              newArr.push([
                h("video", {
                  class: "imgOrMv",
                  attrs: { src: params.row.alarmFileAddress },
                  draggable: false
                })
              ]);
            }
            return h("div", newArr);
          }
        },
        {
          title: "处理记录",
          key: "dealRecord",
          width: 120,
          align: "center",
          tooltip: true
        },
        {
          title: " ",
          key: "id",
          width: 220,
          align: "center",
          render: (h, params) => {
            let newArr = [];
            if (params.row.isReturn == "0") {
              newArr.push([
                h(
                  "el-button",
                  {
                    class: "table_link",
                    style: { marginRight: "20px" },
                    props: { type: "text" },
                    on: {
                      click: () => {
                        that.restoration(params.row);
                      }
                    }
                  },
                  "复归"
                )
              ]);
            }
            newArr.push([
              h(
                "el-button",
                {
                  class: "table_link",
                  style: { marginRight: "20px" },
                  props: { type: "text" },
                  on: {
                    click: () => {
                      that.popData = params.row;
                      that.visible = true;
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
      presetName: "",
      allDataKind: [
        {
          describeName: "所有区域",
          monitorDeviceType: "",
          title: "titleTypeL"
        },
        {
          describeName: "所有区域",
          monitorDeviceType: "",
          title: "titleTypeL"
        }
      ],
      allDataLevel: [
        {
          describeName: "所有区域",
          monitorDeviceType: "",
          title: "titleTypeC"
        },
        {
          describeName: "所有区域",
          monitorDeviceType: "",
          title: "titleTypeC"
        }
      ],
      dataTime: "",
      dataBread: ["视频监控", "1000kv", "摄像头详情"]
    };
  },
  methods: {
    onSelect(item, index) {
      this[item.title] = item["describeName"];
    }
  },
  mounted() {
    document.querySelector(".mainAside").style.height = "inherit";
    document.querySelector(".mainAside").style.minHeight = "100%";
  },
  beforeDestroy() {
    document.querySelector(".mainAside").style.height = "calc(100% - 80px)";
    document.querySelector(".mainAside").style.minHeight = "inherit";
  }
};
</script>

<style lang="scss">
.mainAside {
  /*min-height: 100%;*/
}
.surveillanceDetail {
  width: 100%;
  min-height: 100%;
  padding-bottom: 100px;
  /*overflow-y: hidden;*/
  .el-input--small .el-input__inner {
    border-radius: 0;
    width: 100%;
  }
  .control_slider {
    width: 94%;
    position: absolute;
    height: 8%;
    top: calc(100% + 9%);
    left: 3%;
    .iconfont {
      color: white;
    }
  }
  .breadcrumb {
    margin-bottom: 20px;
  }
  .exportExcel {
    font-size: 16px;
  }
  .content {
    display: flex;
    .left {
      width: 75%;
      &.nr {
        display: flex;
        flex-direction: column;
        padding-bottom: 3px;
        .item {
          background: #132838;
          display: flex;
          &:first-child {
            /*margin-bottom: 15px;*/
          }
          .camera_surveillanceDetail {
            width: 68%;
            .contain {
              position: relative;
              width: 100%;
              padding-bottom: 56%;
              background: grey;
              .monitor {
                position: absolute;
                width: 100% !important;
                top: 0;
                left: 0;
              }
            }
          }
          .control {
            position: relative;
            display: flex;
            margin-left: 3.4%;
            flex-direction: column;
            justify-content: center;
            /*margin-right: 15px;*/
            width: 25%;
            .controBtnContain {
              margin-bottom: 26%;
            }
            .inputGroup {
              display: flex;
              text-align: right;
              padding-left: 12px;
              .el-input el-input--small {
                margin-left: 10px;
              }
              .addPoint {
                margin-left: 9px;
                border-radius: 20px;
              }
            }
          }
        }
      }
    }
    .right {
      width: 25%;
      margin-left: 20px;
      background: #132838;
    }
  }
  .middle_table {
    margin-top: 20px;
    width: 100%;
    height: 300px;
    .top {
      color: #ffffff;
      height: 40px;
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-end;
      .name {
        align-items: center;
        display: flex;
        flex: 1;
      }
      & > .select {
        display: flex;
        & > div {
          margin-right: 10px;
          .dunoBtnTop {
            width: 170px;
            position: relative;
            left: 10px;
            display: inline-flex;
            padding-bottom: 0;
            .btnList {
              top: inherit !important;
              // line-height: 30px;
              width: 160px;
              .title {
                // font-size: 16px;
                padding: 8px 20px;
              }
            }
          }
        }
      }
      .btn {
        display: flex;
        & > div {
          margin-left: 10px;
        }
        & > div:nth-child(2) {
          & > div {
            width: 140px;
            line-height: 40px;
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
          .el-range-editor--small.el-input__inner {
            height: 40px !important;
          }
          .el-range-editor--small .el-range__icon,
          .el-range-editor--small .el-range__close-icon {
            line-height: 35px;
          }
          .el-range-editor--small .el-range-input {
            font-size: 16px;
          }
        }
      }
    }
  }
  .historicalData {
    .top {
      color: #ffffff;
      height: 40px;
      margin-top: 20px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      & > div:first-child {
        font-size: 20px;
        line-height: 40px;
      }
      .btn {
        display: flex;
        justify-content: space-between;
        position: relative;
        & > div {
          margin-left: 10px;
          .dunoBtnTop {
            width: 145px;
            display: inline-flex;
            padding-bottom: 0;
            .btnList {
              top: inherit !important;
              width: 145px;
              .title {
                padding: 8px 20px;
              }
            }
          }
        }
        & > div:nth-child(5) {
          & > div {
            width: 140px;
            line-height: 40px;
            text-align: center;
            background-color: #192f41;
            cursor: pointer;
          }
        }
        .clickBtn {
          line-height: 40px;
          width: 139px;
          background-image: url(../../../assets/images/btn/moreBtn.png);
          text-align: center;
          font-size: 18px;
          color: #ffffff;
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
          .el-range-editor--small.el-input__inner {
            height: 40px !important;
          }
          .el-range-editor--small .el-range__icon,
          .el-range-editor--small .el-range__close-icon {
            line-height: 35px;
          }
          .el-range-editor--small .el-range-input {
            font-size: 16px;
          }
        }
      }
    }
    .con-chart {
      width: 100%;
      height: 340px;
      .chartBox {
        height: 340px;
        .charts {
          height: 340px;
        }
      }
    }
  }
}
</style>
