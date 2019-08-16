<template>
  <div class="analysis">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="dunoDrap not-print">
      <div>表计分析</div>
      <div class="selectBtn">
        <div>
          <duno-btn-top
            @on-select="onSelectAmmeter"
            class="dunoBtnTop"
            zIndex="30"
            :isCheck="false"
            :dataList="ammeterData"
            :title="titleAmmeter"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <el-select
            @change="selectParts"
            class="selectSearch"
            multiple
            collapse-tags
            v-model="valueParts"
            filterable
            :placeholder="titleParts"
          >
            <el-option
              v-for="(item,index) in partsList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div>
          <el-select
            @change="selectPhase"
            class="selectSearch"
            multiple
            collapse-tags
            v-model="valuePhase"
            filterable
            :placeholder="titlePhase"
          >
            <el-option
              v-for="(item,index) in phaseList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="echarts not-print">
      <div class="title">
        <div>泄露电流表24小时温度分析</div>
        <div>
          <div>
            <duno-btn-top
              @on-select="onSelectByDay"
              class="dunoBtnTop"
              :isCheck="false"
              zIndex="20"
              :dataList="ByDayData"
              :title="titleByDay"
              :showBtnList="false"
            ></duno-btn-top>
            <!-- <el-select v-model="titleByDay" @change="onSelectByDay" placeholder="请选择">
              <el-option
                v-for="(item,index) in ByDayData"
                :key="index"
                :label="item.describeName"
                :value="item.value"
              ></el-option>
            </el-select>-->
          </div>
          <div class="dateStyle">
            <el-date-picker
              v-if="this.changeDate=='1'"
              v-model="valueDate"
              type="date"
              placeholder="选择日期"
              @change="change"
            ></el-date-picker>
            <el-date-picker
              v-else-if="this.changeDate=='2'"
              v-model="valueDate"
              type="week"
              format="yyyy 第 WW 周"
              placeholder="选择周"
              @change="change"
            ></el-date-picker>
            <el-date-picker
              v-else-if="this.changeDate=='3'"
              v-model="valueDate"
              type="month"
              placeholder="选择月"
              @change="change"
            ></el-date-picker>
            <el-date-picker
              v-else-if="this.changeDate=='4'"
              v-model="valueDate"
              type="year"
              placeholder="选择年"
              @change="change"
            ></el-date-picker>
          </div>
        </div>
      </div>
      <duno-charts
        :isChange="isChangeFlag"
        :isItemEchart="isItemEchart"
        :legendOption="legendOption"
        :xAxisOption="xAxisOption"
        :yAxisOption="yAxisOption"
        :gridOption="gridOption"
        :seriesOption="seriesOption"
      />
    </div>
    <div class="btn not-print">
      <div>最新记录</div>
      <div @click="handleToMore">查看更多 ></div>
    </div>
    <div class="table not-print">
      <duno-tables-tep
        class="table_analysis"
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
    </div>
    <warning-setting @handleClose="onClose" :visibleOption="visibleSettingOption" />
    <wraning :popData="popData" :visible="visible" @handleClose="handleClose" />
    <enlarge :isShow="isEnlarge" :srcData="srcData" @closeEnlarge="closeEnlarge" />
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import enlarge from "_c/duno-c/enlarge";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import { DunoCharts } from "_c/duno-charts";
import { DunoTablesTep } from "_c/duno-tables-tep";
import mixinViewModule from "@/mixins/view-module";
import warningSetting from "_c/duno-j/warningSetting";
import wraning from "_c/duno-j/warning";
import moment from "moment";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import {
  getEchartsData,
  getAmmeter,
  getMainEqui,
  getDifference,
  getviewDetail
} from "@/api/configuration/configuration.js";
import itemMixin from "../../duno-default/main/components/side-menu/item-mixin";
export default {
  name: "analysis",
  mixins: [mixinViewModule],
  components: {
    Breadcrumb,
    dunoBtnTop,
    DunoCharts,
    DunoTablesTep,
    warningSetting,
    wraning,
    enlarge
  },
  props: {
    legendData: {
      type: Array,
      default: () => {
        return ["4号主变1000千伏侧压变B相", "4号主变1000千伏侧压变C相"];
      }
    },
    xAxisData: {
      type: Array,
      default: () => {
        return [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24"
        ];
      }
    },
    yMax: {
      type: Number,
      default: 100
    },
    yMin: {
      type: Number,
      default: 0
    },
    seriesData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isChange: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    isItemEchart: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    title: {
      type: String,
      default: () => {
        return "泄露电流表24小时温度分析";
      }
    }
  },
  data() {
    const that = this;
    return {
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: "/lenovo-plan/api/statistics/meter-data/list"
      },
      titleAmmeter: "泄露电流表",
      titleParts: "主设备名-部件名",
      titlePhase: "选择相别",
      titleByDay: "按日",
      titleDate: "今日",
      valueParts: [],
      ammeterData: [],
      valuePhase: [],
      partsList: [],
      phaseList: [],
      valueDate: "",
      handleNotes: [],
      alarmType: "",
      isEnlarge: false,
      srcData: [],
      ByDayData: [
        {
          describeName: "按日",
          value: "按日",
          type: "day"
        },
        {
          describeName: "按周",
          value: "按周",
          type: "week"
        },
        {
          describeName: "按月",
          value: "按月",
          type: "month"
        },
        {
          describeName: "按年",
          value: "按年",
          type: "year"
        }
      ],
      changeDate: "1",
      dateData: [],
      echartsData: [],
      popData: {},
      visible: false,
      visibleSettingOption: false,
      alarmLevel: "",
      startTime: "",
      endTime: "",
      dataBread: [
        { path: "/realEnv/list", name: "操作中台" },
        { path: "/meterdata/list", name: "所有报表" },
        { path: "", name: "表计分析" }
      ],
      //   isChangeFlag: true,
      //   titleOption: {
      //     text: "泄露电流表24小时温度分析",
      //     x: "center",
      //     y: "20",
      //     textStyle: {
      //       color: "#fff",
      //       fontWeight: "normal"
      //     }
      //   },
      legendOption: {
        icon: "circle",
        y: "20",
        textStyle: {
          color: "#fff"
        },
        data: that.legendData
      },
      gridOption: {
        top: "80"
      },
      xAxisOption: {
        type: "category",
        name: "(时)",
        axisLine: {
          show: true, //x轴的线
          lineStyle: {
            color: ["#999"]
          }
        },
        // 控制网格线是否显示
        splitLine: {
          show: false,
          lineStyle: {
            color: ["#999"]
          }
        },
        //除去x轴刻度
        axisTick: {
          show: false
        },
        data: that.xAxisData
      },
      yAxisOption: {
        type: "value",
        name: "(温度℃)",
        max: that.yMax,
        min: that.yMin,
        splitNumber: 5,
        // boundaryGap: ["0", "2"],
        axisLine: {
          show: true, //Y轴的线
          lineStyle: {
            color: ["#999"]
          }
        },
        // 控制网格线是否显示
        splitLine: {
          show: true,
          lineStyle: {
            //网格颜色
            color: ["#999"]
          }
        },
        axisTick: {
          show: false
        }
      },
      seriesOption: that.seriesData,
      columns: [
        {
          title: "时间",
          key: "date",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let timeDay = params.row.date.slice(5);
            return h("div", timeDay);
          }
        },
        {
          title: "对象",
          key: "powerDeviceName",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "部件/相别",
          key: "part",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "描述",
          key: "description",
          minWidth: 90,
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
          key: "monitorDeviceName",
          minWidth: 120,
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
                      this.getJump(params.row);
                    }
                  }
                },
                params.row.monitorDeviceName
              )
            ]);
            return h("div", { class: { member_operate_div: true } }, newArr);
          }
        },
        {
          title: "数据",
          key: "resultValue",
          minWidth: 90,
          align: "center",
          tooltip: true
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
                  attrs: { src: params.row.fileAddress },
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
                  attrs: { src: params.row.alarmFileAddress },
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
                      //   that.getviewData(params.row);
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
      ]
    };
  },
  methods: {
    closeEnlarge() {
      this.isEnlarge = false;
    },
    cutOut(data) {
      if (data) {
        const index = data.indexOf("缺陷");
        if (index > -1) {
          data = data.substring(0, index);
        }
        return data;
      } else {
        return "无";
      }
    },
    onClickDropdown(row, type, No) {
      const index = row._index;
      this.dataList[index].alarmLevelName = type;
      this.dataList[index].alarmLevel = No;
      this.psotAlarmData(row, No);
    },
    psotAlarmData(row, No) {
      const that = this;
      const url = "/lenovo-alarm/api/alarm/level-edit";
      const query = {
        id: row.id,
        alarmLevel: No
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
    handleClose() {
      this.popData = {};
      this.visible = false;
    },
    onSelectAmmeter(item) {
      this.titleAmmeter = item["describeName"];
      let query = {
        meterType: item["ammeterType"]
      };
      this.getEquipment(query);
    },
    selectParts(item) {
      this.titleParts = item["describeName"];
      let query = {
        part: this.valueParts.join(",")
      };
      this.getdiffentData(query);
    },
    selectPhase(item) {
      //   this.titlePhase = item["describeName"];
      let monitorDeviceId = item.join(",");
      this.getEcharts(monitorDeviceId);
    },
    onSelectByDay(item) {
      this.titleByDay = item["describeName"];
      switch (item["type"]) {
        case "day":
          this.changeDate = "1";
          this.valueDate = "";
          break;
        case "week":
          this.changeDate = "2";
          this.valueDate = "";
          break;
        case "month":
          this.changeDate = "3";
          this.valueDate = "";
          break;
        case "year":
          this.changeDate = "4";
          this.valueDate = "";
          break;
        default:
      }
    },
    onSelectDate(item) {
      this.titleDate = item["describeName"];
    },
    getEcharts(monitorDeviceId) {
      let that = this;
      const query = {
        monitorDeviceId: monitorDeviceId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      getEchartsData(query).then(res => {
        const dataList = res.data[0];
        const legendData = [];
        const xAxisData = [];
        const seriesData = [];
        for (let i = 0; i < dataList.length; i++) {
          console.log(i, dataList[i]);
          legendData.push(dataList[i].deviceName);
          const itemDataList = dataList[i].dataList;
          const obj = {
            name: dataList[i].deviceName,
            type: "line",
            data: []
          };
          for (let item in itemDataList) {
            if (i == 0) {
              xAxisData.push(itemDataList[item].time);
            }
            obj.data.push(Number(itemDataList[item].value));
          }
          seriesData.push(obj);
        }
        that.legendData.push(...legendData);
        that.seriesData.push(...seriesData);
        that.$forceUpdate();
        console.log(that.legendData);
        console.log(that.seriesData);
        that.isChangeFlag = !that.isChangeFlag;
      });
    },
    handleToMore() {
      this.$router.push({
        name: "meterdata-detail",
        query: {
          url: "/lenovo-plan/api/statistics/meter-data/list"
        }
      });
    },
    getAmmeterData() {
      let that = this;
      getAmmeter().then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            ammeterType: item.value,
            title: "titleAmmeter"
          };
          return obj;
        });
        this.ammeterData = map;
      });
    },
    getEquipment(query) {
      getMainEqui(query).then(res => {
        this.partsList = res.data;
      });
    },
    getdiffentData(query) {
      getDifference(query).then(res => {
        this.phaseList = res.data;
      });
    },
    change(data) {
      let startTime = "";
      let endTime = "";
      console.log(this.changeDate);
      switch (this.changeDate) {
        case "1":
          startTime = moment(data).format("YYYY-MM-DD HH:mm:ss");
          endTime = moment(data)
            .add(1, "days")
            .format("YYYY-MM-DD HH:mm:ss");
          break;
        case "2":
          startTime = moment(data).format("YYYY-MM-DD HH:mm:ss");
          endTime = moment(data)
            .add(1, "weeks")
            .format("YYYY-MM-DD HH:mm:ss");
          break;
        case "3":
          startTime = moment(data).format("YYYY-MM-DD HH:mm:ss");
          endTime = moment(data)
            .add(1, "months")
            .format("YYYY-MM-DD HH:mm:ss");
          break;
        case "4":
          startTime = moment(data).format("YYYY-MM-DD HH:mm:ss");
          endTime = moment(data)
            .add(1, "years")
            .format("YYYY-MM-DD HH:mm:ss");
          break;
      }
      this.startTime = startTime;
      this.endTime = endTime;
      this.getEcharts();
    },
    getJump(row) {
      if (row.monitorDeviceType == "1") {
        this.$router.push({
          path: "/surveillancePath/detailLight",
          query: {
            monitorDeviceId: row.monitorDeviceId
          }
        });
      } else if (row.monitorDeviceType == "2") {
        this.$router.push({
          path: "/surveillancePath/detailRed",
          query: {
            monitorDeviceId: row.monitorDeviceId
          }
        });
      }
    },
    // getviewData(row) {
    //   console.log(row);
    //   let that = this;
    //   that.visible = true;
    //   let query = {
    //     planId: row.planId
    //   };
    //   getviewDetail(query).then(res => {
    //     this.popData = res.data;
    //   });
    // },
    dataListSelectionChangeHandle() {},
    pageSizeChangeHandle() {}
  },
  mounted() {
    // this.getEcharts();
    this.getAmmeterData();
  },
  watch: {
    isChange: {
      handler(now) {
        this.isChangeFlag = now;
      },
      immediate: true
    },
    legendData: {
      handler(now) {
        let arr = [];
        if (now && now.length) {
          arr = now;
        }
        this.legendOption.data = arr;
      },
      deep: true
    },
    xAxisData: {
      handler(now) {
        let arr = [];
        if (now && now.length) {
          arr = now;
        }
      },
      deep: true
    },
    yName(now) {
      this.yAxisOption.yName = now;
    },
    yMax(now) {
      this.yAxisOption.yMax = now;
    },
    yMin(now) {
      this.yAxisOption.yMin = now;
    },
    ySplitNumber(now) {
      this.yAxisOption.ySplitNumber = now;
    },
    seriesData: {
      handler(now) {
        let arr = [];
        if (now && now.length) {
          arr = now;
        }
        this.seriesOption = arr;
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
@media print {
  .not-print {
    opacity: 0;
  }
}
.analysis {
  .selectSearch {
    overflow: hidden;
  }
  //下拉多选框
  .popper__arrow {
    display: none !important;
  }
  .selectSearch {
    height: 40px;
    .el-input--small .el-input__inner {
      background: #1a2f42;
      height: 40px;
      border: none;
      margin-left: 5px;
      border-radius: 0 !important;
      width: 180px;
      color: white;
      font-size: 16px;
    }
    .el-input--small .el-input__inner::-webkit-input-placeholder {
      color: white;
      font-size: 16px;
    }
    .el-input--small .el-input__inner:-moz-placeholder {
      color: white;
      font-size: 16px;
    }
    .el-input--small .el-input__inner:-ms-input-placeholder {
      color: white;
      font-size: 16px;
    }
  }
  //--
  .dunoDrap {
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      margin-top: 20px;
      margin-bottom: 20px;
      font-size: 20px;
      color: #ffffff;
    }
    .selectBtn {
      display: flex;
      justify-content: space-between;
      width: 575px;
      margin-top: 14px;
      height: 50px;
      .dunoBtnTop {
        width: 185px;
        display: inline-flex;
        padding-bottom: 0;
        height: 40px;
        .icon-xiala {
          /*  width: 13px !important;
          height: 14px !important;*/
        }
        .btnList {
          top: inherit !important;
          width: 185px;
          .title {
            padding: 8px 20px;
          }
          .btnNr {
            color: white;
          }
        }
      }
    }
  }
  .echarts {
    overflow: hidden;
    height: 340px;
    background-color: #142838;
    .chartBox {
      height: 300px;
      .charts {
        height: 300px;
      }
    }
    .title {
      overflow: hidden;
      margin-top: 20px;
      & > div {
        float: left;
      }
      & > div:first-child {
        width: 70%;
        // text-align: center;
        padding-left: 43%;
        font-size: 18px;
        color: #fff;
      }
      & > div:nth-child(2) {
        width: 30%;
        overflow: hidden;
        & > div:first-child {
          overflow: hidden;
          //   padding-left: 50%;
          width: 30%;
          & > div {
            // float: right;
          }
        }
        & > div:nth-child(2) {
          width: 50%;
        }
        & > div {
          float: left;
          .dunoBtnTop {
            padding-bottom: 0;
            .btnList {
              /*background: rgba(0, 0, 0, 0);*/
              width: 100px;
              top: 133px;
              .btnItem {
                color: white;
              }
              .title {
                margin-top: 0;
                /*background: rgba(0, 0, 0, 0);*/
                & > div {
                  font-size: 12px;
                }
              }
            }
            .icon-xiala {
              height: 15px;
              right: 11px;
              top: 12px;
              width: 12px;
            }
          }
        }
      }
      .dateStyle {
        .el-input--small .el-input__inner {
          height: 40px;
          line-height: 40px;
        }
        .el-input__inner {
          background: rgba(0, 0, 0, 0);
          border: none;
          color: #ffffff;
          font-size: 16px;
        }
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
          height: 40px;
        }
        .el-range-editor--small .el-range-input {
          font-size: 16px;
        }
      }
    }
  }
  .btn {
    margin-top: 25px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      line-height: 40px;
      color: #ffffff;
      font-size: 20px;
    }
    & > div:nth-child(2) {
      line-height: 40px;
      width: 139px;
      background-image: url(../../../assets/images/btn/moreBtn.png);
      text-align: center;
      font-size: 18px;
      color: #ffffff;
      cursor: pointer;
    }
  }
  //
  .el-button--text {
    border-color: transparent !important;
    background: transparent !important;
  }
  .table_link {
    font-size: 16px;
    color: #5fafff !important;
    text-decoration: underline;
  }
  .table_select {
    cursor: pointer;
    // color: #1d1f26;
    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 30px;
      color: #fff;
      border-radius: 20px;
    }
    &.serious {
      span {
        color: #1d1f26;
        background: #f4a723;
      }
    }
    &.commonly {
      span {
        color: #1d1f26;
        background: #5eb0fc;
      }
    }
    &.danger {
      span {
        color: #1d1f26;
        background: #d0011b;
      }
    }
  }
  .imgOrMv {
    width: 80%;
    height: 45px;
    position: relative;
    top: 2px;
  }
  //-------------------表格样式
  .ivu-table {
    font-size: 16px;
    @media screen and (min-width: 3500px) {
      font-size: 14px;
    }
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
        height: 48px;
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
}
.el-select .el-tag:first-child {
  margin-top: 33px;
}
.el-select-dropdown {
  background: linear-gradient(
    210deg,
    rgba(48, 107, 135, 0.9),
    rgba(28, 50, 64, 0.7) 60%
  ) !important;
  border: none !important;
  margin-top: 1px !important;
  margin-left: 6px;
  border-radius: 0;
  min-width: 179px !important;
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
.el-date-table.is-week-mode .el-date-table__row.current div {
  background: rgba(81, 89, 112, 0.7);
}
.el-date-table.is-week-mode .el-date-table__row:hover div {
  background: rgba(81, 89, 112, 0.7);
}

.el-select .el-tag:first-child {
  margin-left: 9px;
}
</style>
