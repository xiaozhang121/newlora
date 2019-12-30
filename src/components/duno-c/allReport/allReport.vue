<template>
  <div class="allReport">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top not-print">
      <div>{{ title }}</div>
      <div class="btn">
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTo"
            :isCheck="false"
            :dataList="regionList"
            :title="titleTypeL"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <duno-btn-top
            v-if="dataSource&&isHidden"
            @on-select="onSelectDevice"
            class="dunoBtnTo"
            :isCheck="false"
            :dataList="deviceType"
            :title="deviceTitleType"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <duno-btn-top
            @on-select="onSelectType"
            class="dunoBtnTo"
            :isCheck="false"
            :dataList="typeList"
            :title="titleTypeR"
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
        <!-- <div>
          <div @click="clickExcel" class="clickBtn">
            <i class="iconfont icon-daochu1"></i>
            导出表格
          </div>
        </div>-->
        <div>
          <duno-btn-top
            @on-select="selectDownloadType"
            class="dunoBtnTo"
            :isCheck="false"
            :dataList="downLoadList"
            :output="true"
            title="导出表格"
            :showBtnList="false"
          ></duno-btn-top>
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
    <warning-setting @handleClose="onClose" :visibleOption="visibleSettingOption" />
    <wraning v-if="visible"   :popData="popData" :visible="visible" @handleClose="handleClose" />
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
  name: "allReport",
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
  watch: {
    dataBread: {
      handler(now){
        if(now && now.length){
          this.title = now[3]['name']
        }
      },
      deep: true,
      immediate: true
    }
  },
  props: {
    delSelect: {
      type: Array,
      default: ()=>{
        return []
      }
    },
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
    position: {
      type: String,
      default: () => {
        return "";
      }
    },
    dataSource: {
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
    },
    selectUrl: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    const that = this;
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/lenovo-plan/api/statistics/meter-data/list",
        exportURL: ""
      },
      dataForm: {},
      isHidden: true,
      title: "信息总览记录信息",
      handleNotes: [],
      alarmType: "",
      visibleSettingOption: false,
      isEnlarge: false,
      visible: false,
      totalNum: 10,
      pageRows: 10,
      srcData: [],
      selectInfo: "更多",
      serious: false,
      commonly: false,
      danger: false,
      value: "",
      queryForm: {},
      titleTypeL: "全部设备",
      titleTypeC: "全部报表",
      titleTypeR: "全部类型",
      deviceTitleType: "可见光设备",
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
      deviceType: [
        {
          describeName: "可见光设备",
          monitorDeviceType: "1"
        },
        {
          describeName: "红外设备",
          monitorDeviceType: "2"
        },
        {
          describeName: "室内轨道机器人",
          monitorDeviceType: "3"
        },
        {
          describeName: "室外巡检机器人",
          monitorDeviceType: "4"
        }
      ],
      columns: [
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
            let data = params.row.part ? params.row.part : "/";
            return h("div", data);
          }
        },
        {
          title: "描述",
          key: "content",
          minWidth: 90,
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
          title: "缺陷等级",
          key: "alarmLevel",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            let alarmLevelName;
            if (
              params.row.alarmLevelName &&
              params.row.alarmLevelName.length > 2
            ) {
              alarmLevelName = params.row.alarmLevelName.slice(0, 2);
            } else {
              alarmLevelName = params.row.alarmLevelName;
            }
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
                          h("span", alarmLevelName, {
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
          key: "fileType",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            if (params.row.fileType == "1") {
              newArr.push([
                h("img", {
                  class: "imgOrMv",
                  attrs: {
                    src: params.row.fileAddress
                      ? params.row.fileAddress
                      : params.row.pic
                  },
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
                  attrs: {
                    src: params.row.fileAddress
                      ? params.row.fileAddress
                      : params.row.pic
                  },
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
          title: "数据",
          key: "alarmValue",
          minWidth: 90,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let data = params.row.alarmValue
              ? params.row.alarmValue
              : params.row.resultValue;
            return h("div", data);
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
                  props: {
                    placement: "top",
                    content: data,
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
                    data
                  )
                ]
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
    // this.getDataList();
    this.getPowerDeviceName();
  },
  created() {
    this.getWidth();
    this.init();
    this.getRegion();
    this.getStart();
    this.getType();
  },
  methods: {
    getWidth() {
      let screen = window.screen.availWidth;
      let routePage = this.$route.name;
      console.log(routePage); //overview-detail
      if (screen > 3500) {
        this.columns.splice(4, 1);
        if (routePage == "allReport-detail") {
          this.columns.splice(4, 1);
        }
      }
      if (screen > 3500 && routePage == "overview-detail") {
        this.isHidden = false;
      }
    },
    selectDownloadType(item) {
      const that = this;
      this.queryForm.type = item.monitorDeviceType;
      that.exportHandle();
    },
    getPowerDeviceName() {
      if (this.queryForm.powerDeviceId) {
        let url = "/lenovo-device/api/device/query";
        let query = {
          deviceId: this.$route.query.powerDeviceId
        };
        getAxiosData(url, query).then(res => {
          this.titleTypeL = res.data.deviceName;
        });
      }
    },
    init() {
      this.mixinViewModuleOptions.getDataListURL = this.$route.query.url;
      this.mixinViewModuleOptions.exportURL = this.downloadURL;
      this.queryForm.powerDeviceId = this.$route.query.powerDeviceId;
      this.queryForm.flag = this.$route.query.flag;
      if (this.monitorDeviceType == "") {
        this.queryForm.monitorDeviceType = this.$route.query.monitorDeviceType;
      } else {
        this.queryForm.monitorDeviceType = this.monitorDeviceType;
      }
      if (this.$route.query.deviceName) {
        this.title = this.$route.query.deviceName;
      }
      if (this.$route.query.planId) {
        this.queryForm.planId = this.$route.query.planId;
      }
      if (this.dataSource != "") {
        this.queryForm.dataSource = this.dataSource;
        this.dataForm.dataSource = this.dataSource;
      }
      this.getDataList();
      this.getPowerDeviceName();
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
    onSelect(item, index) {
      this[item.title] = item["describeName"];
      this.dataForm.powerDeviceId = item.monitorDeviceType;
      this.queryForm.powerDeviceId = item.monitorDeviceType;
      // this.getDataList();
      this.clickQuery(this.dataForm);
    },
    onSelectDevice(item, index) {
      this.deviceTitleType = item["describeName"];
      this.queryForm.dataSource = item.monitorDeviceType;
      this.dataForm.dataSource = item.monitorDeviceType;
      // this.getDataList();
      this.clickQuery(this.dataForm);
    },
    onSelectType(item, index) {
      this[item.title] = item["describeName"];
      this.dataForm.planType = item.monitorType;
      this.queryForm.planType = item.monitorType;
      // this.getDataList();
      this.clickQuery(this.dataForm);
    },
    onChangeTime(data) {
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD 00:00:00");
        endTime = moment(data[1]).format("YYYY-MM-DD 23:59:59");
      }
      this.dataForm.startTime = startTime;
      this.dataForm.endTime = endTime;
      this.queryForm.startTime = startTime;
      this.queryForm.endTime = endTime;
      // this.getDataList();
      this.clickQuery(this.dataForm);
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
    // clickExcel() {
    //   const that = this;
    //   that.exportHandle();
    // },
    getRegion() {
      const that = this;
      const url = that.selectUrl;
      let query = {
        monitorDeviceType: this.monitorDeviceType,
        parentDeviceId: this.$route.query.parentDeviceId
      };
      getAxiosData(url, query).then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleTypeL"
          };
          return obj;
        });
        map.unshift({
          describeName: "全部设备",
          monitorDeviceType: "",
          title: "titleTypeL"
        });
        this.regionList = map;
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
          describeName: "全部报表",
          monitorDeviceType: "",
          title: "titleTypeC"
        });
        this.statusList = map;
      });
    },
    getType() {
      const url = "/lenovo-plan/api/list/plan-type";
      let query = {
        position: this.position
      };
      postAxiosData(url, query).then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorType: item.value,
            title: "titleTypeR"
          };
          return obj;
        });
        map.unshift({
          describeName: "所有类型",
          monitorType: "",
          title: "titleTypeR"
        });
        if(this.delSelect.length){
          for(let i=0; i<map.length; i++){
            let item = map[i]
            if(this.delSelect.indexOf(item['describeName']) > -1){
              map.splice(i, 1)
              i--
            }
          }
        }
        this.typeList = map;
      });
    },
    getJump(row) {
      try {
        if (row.monitorDeviceName.indexOf("室内") > -1) {
          this.$router.push({
            path: "/robot-two/list"
          });
          return;
        } else if (row.monitorDeviceName.indexOf("室外") > -1) {
          this.$router.push({
            path: "/robot-one/list"
          });
          return;
        }
      } catch (e) {}
      let monitorDeviceId =
        "monitorDeviceId" in row && row.monitorDeviceId
          ? row.monitorDeviceId
          : row.monitorDevice[0]["monitorDeviceId"];
      getAxiosData("/lenovo-device/api/preset/type", {
        monitorDeviceId: monitorDeviceId
      }).then(res => {
        let supportPreset = res.data["supportPreset"];
        let monitorDeviceType = res.data["monitorDeviceType"];
        if (monitorDeviceType == 1  || monitorDeviceType == 5) {
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
        } else if (monitorDeviceType == 3 || monitorDeviceType == 9) {
          this.$router.push({
            path: "/surveillancePath/detailEnv",
            query: {
              monitorDeviceId: monitorDeviceId
            }
          });
        }else if (monitorDeviceType == 6) {
          this.$router.push({
            path: "/surveillancePath/detailUbiquitou",
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
.allReport {
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
  .flexPos {
    display: flex;
    align-items: center;
  }
  .imgOrMv {
    width: 80%;
    height: 45px;
    position: relative;
    top: 2px;
    z-index: 0 !important;
  }
  .table_link {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
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
      & > div:first-child {
        margin-left: 10px;
        .dunoBtnTop {
          width: 250px;
          display: inline-flex;
          padding-bottom: 0;
          .btnList {
            top: inherit !important;
            width: 250px;
            .title {
              padding: 8px 20px;
              @media screen and (min-width: 3500px) {
                height: 35px;
              }
            }
          }
        }
      }
      & > div:not(:first-child) {
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
      // & > div:nth-child(5) {
      //   & > div {
      //     width: 140px;
      //     line-height: 40px;
      //     text-align: center;
      //     background-color: #192f41;
      //     cursor: pointer;
      //   }
      // }
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
            @media screen and (min-width: 3500px) {
              font-size: 14px;
            }
          }
          .el-range-input {
            color: #fff;
          }
        }
        .el-range-editor--small.el-input__inner {
          height: 40px !important;
          @media screen and (min-width: 3500px) {
            height: 35px !important;
            width: 250px;
          }
        }
        .el-range-editor--small .el-range__icon,
        .el-range-editor--small .el-range__close-icon {
          line-height: 35px;
        }
        .el-range-editor--small .el-range-input {
          font-size: 16px;
          @media screen and (min-width: 3500px) {
            font-size: 14px;
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
</style>
