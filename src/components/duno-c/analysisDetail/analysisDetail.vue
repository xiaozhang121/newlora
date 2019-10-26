<template>
  <div class="analysis-detail">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top not-print">
      <div>{{dataForm.planType}}{{dataForm.planId}}</div>
      <div class="btn">
        <div>
          <el-select
            class="selectItem"
            v-model="titleType"
            filterable
            clearable
            @change="changeSelect"
            placeholder="请选择"
          >
            <el-option
              v-for="item in regionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div>
          <duno-btn-top
            @on-select="selectDownloadType"
            class="dunoBtnTo"
            :isCheck="false"
            :dataList="downLoadList"
            title="导出表格/PDF"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <!-- <div>
          <div @click="clickExcel" class="clickBtn">
            <i class="iconfont icon-daochu1"></i>
            导出表格
          </div>
        </div>-->
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
    <warning-setting @handleClose="onClose" :visibleOption="visibleSettingOption" />
    <wraning
      :popData="popData"
      :visible="visible"
      :detailsType="detailsType"
      @on-fresh="onFresh"
      @handleClose="handleClose"
    />
    <enlarge :isShow="isEnlarge" :srcData="srcData" @closeEnlarge="closeEnlarge" />
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import dunoMain from "_c/duno-m/duno-main";
import enlarge from "_c/duno-c/enlarge";
import moment from "moment";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import warningSetting from "_c/duno-j/warningSetting";
import wraning from "_c/duno-j/warning";
import mixinViewModule from "@/mixins/view-module";
import { DunoTablesTep } from "_c/duno-tables-tep";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
export default {
  name: "abnormalInfo",
  mixins: [mixinViewModule],
  components: {
    Breadcrumb,
    dunoBtnTop,
    KeyMonitor,
    dunoMain,
    DunoTablesTep,
    warningSetting,
    wraning,
    enlarge
  },
  props: {
    dataBread: {
      type: Array,
      default: () => {
        return [];
      }
    },
    downloadURL: {
      type: String,
      default: () => {
        return "";
      }
    },
    monitorDeviceType: {
      type: String,
      default: () => {
        return "";
      }
    }
    // detailsType: {
    //   type: String,
    //   default: () => {
    //     return "";
    //   }
    // }
  },
  data() {
    const that = this;
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/lenovo-plan/api/statistics/meter-data/list",
        exportURL: "/lenovo-plan/api/statistics/plan/download"
      },
      dataForm: {},
      title: "所有信息",
      handleNotes: [],
      alarmType: "",
      visibleSettingOption: false,
      isEnlarge: false,
      visible: false,
      totalNum: 20,
      pageRows: 20,
      srcData: [],
      selectInfo: "更多",
      serious: false,
      commonly: false,
      danger: false,
      queryForm: {},
      detailsType: "",
      titleType: "按设备筛选",
      downLoadList: [
        {
          describeName: "导出表格",
          monitorDeviceType: "1"
        },
        {
          describeName: "导出PDF",
          monitorDeviceType: "2"
        }
      ],
      columns: [
        {
          title: "序号",
          type: "index",
          minWidth: 80,
          align: "center"
        },
        {
          title: "对象",
          key: "powerDeviceName",
          minWidth: 180,
          align: "center",
          tooltip: true
        },
        {
          title: "部件/相别",
          key: "part",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            return h(
              "div",
              params.row.part ? params.row.part : params.row.phase
            );
          }
        },
        {
          title: "描述",
          key: "content",
          minWidth: 80,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let content;
            if (params.row.content) {
              content = params.row.content;
            } else if (params.row.description) {
              content = params.row.description;
            } else if (params.row.desc) {
              content = params.row.desc;
            }
            return h("div", { class: { member_operate_div: true } }, content);
          }
        },
        {
          title: "巡检结果",
          key: "result",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "缺陷等级",
          key: "alarmLevel",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            if (
              params.row.alarmLevel == "1" ||
              params.row.alarmLevel == "2" ||
              params.row.alarmLevel == "3"
            ) {
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
                          h("span", that.cutOut(params.row.alarmLevelName), {
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
            } else {
              newArr.push(h("div", "/"));
            }
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
                    content: params.row.monitorDeviceName
                      ? params.row.monitorDeviceName
                      : params.row.source,
                    transfer: true
                  },
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
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
          key: "fileType",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            let sic =
              params.row.pic ||
              params.row.fileAddress ||
              params.row.fileAddress;
            if (params.row.fileType == "1") {
              newArr.push([
                h("img", {
                  class: "imgOrMv",
                  attrs: { src: sic },
                  draggable: false,
                  on: {
                    click: () => {
                      that.isEnlarge = true;
                      that.srcData = params.row;
                    }
                  }
                })
              ]);
            } else if (params.row.fileType == "2") {
              newArr.push([
                h("video", {
                  class: "imgOrMv",
                  attrs: { src: sic },
                  draggable: false,
                  on: {
                    click: () => {
                      that.isEnlarge = true;
                      that.srcData = params.row;
                    }
                  }
                })
              ]);
            }
            return h("div", newArr);
          }
        },
        {
          title: "记录时间",
          key: "executeTime",
          minWidth: 100,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let data;
            if (params.row.executeTime) {
              data = params.row.executeTime;
            } else if (params.row.recordTime) {
              data = params.row.recordTime;
            } else if (params.row.date) {
              data = params.row.date;
            }
            return h("div", [
              h(
                "Tooltip",
                {
                  props: { placement: "top", content: data, transfer: true },
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }
                },
                data
              )
            ]);
          }
        },
        {
          title: " ",
          width: 90,
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
      popData: {}
    };
  },
  mounted() {
    this.getDataList();
  },
  created() {
    this.dataForm.planId = this.$route.query.planId;
    this.dataForm.planType = this.$route.query.planType;
    this.dataForm.batchId = this.$route.query.batchId;
    this.dataForm.isRobot = this.$route.query.isRobot;
    this.detailsType = this.$route.query.detailsType;
    this.mixinViewModuleOptions.getDataListURL = this.$route.query.url;
    this.mixinViewModuleOptions.exportURL = this.downloadURL;
    this.queryForm.monitorDeviceType = this.monitorDeviceType;
    this.getRegion();
    this.getStart();
    this.getType();
  },
  methods: {
    // clickExcel() {
    //   const that = this;
    //   that.queryForm = that.dataForm;
    //   that.exportHandle();
    // },
    selectDownloadType(item) {
      const that = this;
      this.dataForm.type = item.monitorDeviceType;
      this.queryForm = this.dataForm;
      that.exportHandle();
    },
    onFresh() {
      this.getDataList();
    },
    cutOut(data) {
      if (data) {
        const index = data.indexOf("缺陷");
        if (index > -1) {
          data = data.substring(0, index);
        }
        return data;
      } else {
        return "更多";
      }
    },
    closeEnlarge() {
      this.isEnlarge = false;
    },
    onClickDropdown(row, type, No) {
      const index = row._index;
      this.dataList[index].alarmLevelName = type;
      this.dataList[index].alarmLevel = No;
      this.psotAlarmData(row, type, No);
    },
    psotAlarmData(row, type, No) {
      const that = this;
      let url;
      if (row.isRobot == "0" || row.isRobot == "1") {
        url = "/lenovo-plan/api/information/overview/alarm/level/edit";
      } else {
        url = "/lenovo-alarm/api/alarm/level-edit";
      }
      let oldLevel;
      if (row.alarmLevel == "1") {
        oldLevel = "一般";
      } else if (row.alarmLevel == "2") {
        oldLevel = "严重";
      } else {
        oldLevel = "危急";
      }
      const query = {
        id: row.id,
        isRobot: row.isRobot,
        isPhaseAlarm: row.isPhaseAlarm,
        alarmLevel: No,
        oldLevel: oldLevel,
        newLevel: type,
        userName: this.$store.state.user.userName
      };
      putAxiosData(url, query).then(
        res => {
          if (res.code !== 200) {
            this.dataList[index].alarmLevel = row.alarmLevel;
            this.dataList[index].alarmLevelName = row.alarmLevelName;
            return that.$message.error(res.msg);
          }
          that.$message.success(res.msg);
        },
        error => {
          this.dataList[index].alarmLevel = row.alarmLevel;
          this.dataList[index].alarmLevelName = row.alarmLevelName;
        }
      );
    },
    onClose() {
      this.visibleSettingOption = false;
    },
    showSetting() {
      this.visibleSettingOption = true;
    },
    // onSelect(item, index) {
    //   this[item.title] = item["describeName"];
    //   this.dataForm.powerDeviceId = item.monitorDeviceType;
    //   this.getDataList();
    // },
    changeSelect(item) {
      this.dataForm.powerDeviceId = item;
      this.getDataList();
    },
    handleClose() {
      this.popData = {};
      this.visible = false;
    },
    restoration(row) {
      const url = "/lenovo-alarm/api/alarm/deal";
      const query = {
        alarmId: row.alarmId,
        type: "1"
      };
      postAxiosData(url, query).then(res => {
        if (res.code !== 200) {
          return this.$message.error(res.msg);
        }
        this.dataList[row._index].isReturn = "1";
        this.$message.success(res.msg);
      });
    },
    getRegion() {
      const that = this;
      const url = "/lenovo-plan/api/plan/power/select-list";
      let query = {
        planId: that.$route.query.planId
      };
      getAxiosData(url, query).then(res => {
        const resData = res.data;
        // const map = resData.map(item => {
        //   const obj = {
        //     describeName: item.label,
        //     monitorDeviceType: item.value,
        //     title: "titleType"
        //   };
        //   return obj;
        // });
        // map.unshift({
        //   describeName: "所有设备",
        //   monitorDeviceType: "",
        //   title: "titleType"
        // });
        this.regionList = resData;
      });
    },
    getStart() {
      const that = this;
      const url = "/lenovo-device/api/monitor/status";
      postAxiosData(url).then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleTypeC"
          };
          return obj;
        });
        map.unshift({
          describeName: "所有报表",
          monitorDeviceType: "",
          title: "titleTypeC"
        });
        this.statusList = map;
      });
    },
    getType() {
      const that = this;
      const url = "/lenovo-plan/api/list/monitor-device-type";
      postAxiosData(url).then(res => {
        const resData = res.data;
        let mapList = resData.filter(item => item.label != "请选择");
        const map = mapList.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleTypeR"
          };
          return obj;
        });
        map.unshift({
          describeName: "所有类型",
          monitorDeviceType: "",
          title: "titleTypeR"
        });
        this.typeList = map;
      });
    },
    getJump(row) {
      let monitorDeviceId =
        "monitorDeviceId" in row && row.monitorDeviceId
          ? row.monitorDeviceId
          : row.monitorDevice[0]["monitorDeviceId"];
      getAxiosData("/lenovo-device/api/preset/type", {
        monitorDeviceId: monitorDeviceId
      }).then(res => {
        let supportPreset = res.data["supportPreset"];
        let monitorDeviceType = res.data["monitorDeviceType"];
        if (monitorDeviceType == 1) {
          if (supportPreset) {
            this.$router.push({
              path: "/surveillancePath/detailLight",
              query: {
                monitorDeviceId: monitorDeviceId
              }
            });
          } else {
            this.$router.push({
              path: "/surveillancePath/detailLightN",
              query: {
                monitorDeviceId: monitorDeviceId
              }
            });
          }
        } else if (monitorDeviceType == 2) {
          if (supportPreset) {
            this.$router.push({
              path: "/surveillancePath/detailRed",
              query: {
                monitorDeviceId: monitorDeviceId,
                typeId: res.data["typeId"]
              }
            });
          } else {
            this.$router.push({
              path: "/surveillancePath/detailRedN",
              query: {
                monitorDeviceId: monitorDeviceId,
                typeId: res.data["typeId"]
              }
            });
          }
        } else if (monitorDeviceType == 3) {
          this.$router.push({
            path: "/surveillancePath/detailEnv",
            query: {
              monitorDeviceId: monitorDeviceId
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.analysis-detail {
  width: 100%;
  //-------------------表格样式
  .dunoMain {
    height: inherit;
  }
  .ivu-table {
    font-size: 16px;
  }
  .ivu-table th {
    color: #fff;
    border: none;
    height: 60px;
    background-color: #2d5980 !important;
    font-size: 18px;
    font-weight: normal;
    @media screen and (min-width: 3500px) {
      font-size: 15px;
      height: 50px;
    }
  }
  .ivu-table-cell {
    @media screen and (min-width: 3500px) {
      padding-left: 10px;
      padding-right: 10px;
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
  .ivu-table-wrapper {
    tr {
      td {
        height: 60px;
        @media screen and (min-width: 3500px) {
          height: 50px;
          font-size: 13px;
        }
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
  .ivu-select-dropdown {
    background: white !important;
  }
  .ivu-table-small td {
    background: black;
  }
  //------------------
  .el-button--text {
    border-color: transparent !important;
    background: transparent;
  }
  .el-button:hover {
    background-color: rgba(0, 0, 0, 0);
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
    font-size: 16px;
    color: #5fafff !important;
    text-decoration: underline;

    text-align: center;
    display: inline-block;
    // width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    @media screen and (min-width: 3500px) {
      height: 35px;
    }
    & > div:first-child {
      font-size: 20px;
      line-height: 40px;
      @media screen and (min-width: 3500px) {
        font-size: 16px;
        line-height: 35px;
      }
    }
    .btn {
      display: flex;
      justify-content: space-between;
      & > div {
        margin-left: 10px;
        .dunoBtnTop {
          width: 150px;
          display: inline-flex;
          padding-bottom: 0;
          .btnList {
            top: inherit !important;
            width: 150px;
            .title {
              padding: 8px 20px;
              @media screen and (min-width: 3500px) {
                height: 35px;
              }
            }
          }
        }
      }
      // .clickBtn {
      //   line-height: 40px;
      //   width: 139px;
      //   background-image: url(../../../assets/images/btn/moreBtn.png);
      //   text-align: center;
      //   font-size: 18px;
      //   cursor: pointer;
      //   color: #ffffff;
      //   @media screen and (min-width: 3500px) {
      //     background-size: 100% 100%;
      //     font-size: 14px;
      //     line-height: 34px;
      //     width: 120px;
      //   }
      // }
    }
  }
  .icon-xiala {
    color: white;
    font-size: 13px;
  }
}
.el-input__inner {
  background-color: #1a2f42;
  border: 1px solid #1a2f42;
}
.setting {
  cursor: pointer;
  i {
    font-size: 30px;
    padding-right: 5px;
  }
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
.el-input--small .el-input__inner {
  height: 40px;
  background: #1a2f42;
}
.el-scrollbar {
  background: #1a2f42;
}
.el-select-dropdown {
  border: solid 1px #1a2f42;
}
</style>
