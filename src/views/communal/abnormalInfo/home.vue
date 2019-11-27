<template>
  <div class="abnormalInfoHome">
    <div class="topNav">
      <scroller :listOption="messageList"></scroller>
    </div>
    <div class="middle">
      <div class="abnormalInfo">
        <div class="contain borderTX">
          <duno-main :controlOver="true" class="main_contain">
            <div class="iconTop topTitle">
              <div class="pointer" @click="handleJump(5)">
                <img src="../../../assets/iconFunction/icon_abnormal.png" alt />
                异常信息
              </div>
              <div>
                <duno-btn-top
                  @on-select="onSelect"
                  class="dunoBtnTo"
                  :isCheck="false"
                  :dataList="regionList"
                  :title="titleType"
                  :showBtnList="false"
                ></duno-btn-top>
              </div>
            </div>
            <div>
              <duno-tables-tep
                class="table_abnormalInfo"
                :columns="columns"
                :data="dataList"
                :totalNum="totalNum"
                :pageSize="pageRows"
                :current="pageIndex"
                :isShowPage="false"
                @on-select="dataListSelectionChangeHandle"
                @clickPage="pageCurrentChangeHandle"
                @on-page-size-change="pageSizeChangeHandle"
              />
            </div>
          </duno-main>
        </div>
      </div>
      <div class="bottom">
        <div class="iconcen" @click="handleJump(1)">
          <duno-main :controlOver="true" class="main_contain contain">
            <div class="iconTop">
              <img src="../../../assets/iconFunction/icon_weather.png" alt />
              微气象环境
            </div>
            <div class="weater">
              <div class="gauge">
                <p>
                  <span style="white-space:pre;">{{ toDay }}</span>
                </p>
                <div>
                  <i class="iconfont icon-wendu"></i>
                  <span>{{ tempEnv['envTemp'] }}℃</span>
                </div>
              </div>
              <div class="gauge">
                <div class="gauge_top">
                  <i class="iconfont icon-shidu1"></i>
                  <p>{{ tempEnv['humidity'] }}%</p>
                  <span>当前湿度</span>
                </div>
                <div class="gauge_btm">
                  <i class="iconfont icon-fengsu"></i>
                  <p>{{ tempEnv['windSpeed'] }}m/s</p>
                  <span>当前风速</span>
                </div>
              </div>
            </div>
          </duno-main>
        </div>
        <div class="iconcen" @click="handleJump(2)">
          <duno-main :controlOver="true" class="main_contain contain">
            <div class="iconTop">
              <img src="../../../assets/iconFunction/icon_space.png" alt />
              泛在盒子
            </div>
            <div class="gauge" id="mountNode"></div>
            <div class="gauge">
              <div class="gauge_top">
                <i class="iconfont icon-wendu1"></i>
                <p>{{envData['temp']}}℃</p>
                <span>当前温度</span>
              </div>
              <div class="gauge_btm">
                <i class="iconfont icon-shidu"></i>
                <p>{{envData['humid']}}%RH</p>
                <span>当前湿度</span>
              </div>
            </div>
          </duno-main>
        </div>
      </div>
    </div>
    <div class="middle-center">
      <div>
        <div class="defect iconcen" @click="handleJump(7)">
          <duno-main :controlOver="true" class="main_contain contain">
            <div class="iconTop">
              <i class="iconfont icon-quexianku"></i>
              缺陷库管理
            </div>
            <div class="defectInfo">
              <progress-d v-for="(item,index) in defectData" :key="index" :dataList="item"></progress-d>
            </div>
          </duno-main>
        </div>
        <div class="conter iconcen" @click="handleJump(4)">
          <duno-main :controlOver="true" class="main_contain contain">
            <div class="iconTop">
              <img src="../../../assets/iconFunction/icon_system.png" alt />
              平台监控
            </div>
            <duno-charts
              paddingBottom="200px"
              :seriesOption="seriesOptionBar"
              :xAxisOption="xAxisOptionBar"
              :yAxisOption="yAxisOptionBar"
              :gridOption="gridOptionBar"
              :tooltipOption="tooltipOptionBar"
              :isItemEchart="isItemEchartBar"
              :isChange="isChangeBar"
            />
          </duno-main>
        </div>
      </div>
      <div class="right iconcen" @click="handleJump(3)">
        <duno-main :controlOver="true" class="main_contain contain">
          <div class="iconTop">
            <img src="../../../assets/iconFunction/icon_lock.png" alt />
            智能锁具
          </div>
          <div :class="{echartBox:isShowEchart}">
            <duno-charts
              :isChange="isChange"
              :isItemEchart="isItemEchart"
              :legendOption="legendOption"
              :gridOption="gridOption"
              :titleOption="titleOption"
              paddingBottom="200px"
              :seriesOption="seriesOption"
              :colorOption="colorOption"
            ></duno-charts>
          </div>
        </duno-main>
      </div>
    </div>
    <div class="middle-right">
      <div class="defect iconcen">
        <duno-main :controlOver="true" class="main_contain contain">
          <div class="iconTop" @click="handleJump(6)">
            <img src="../../../assets/iconFunction/icon_statement.png" alt />
            报表
          </div>
          <div class="report">
            <span>全面巡视报告</span>
            <p @click="handleReport(1)">查看更多-></p>
          </div>
          <div
            class="reportLoad"
            v-loading="loadingOption"
            element-loading-background="rgba(0, 0, 0, 0)"
            element-loading-text="请稍后，正在加载数据…"
          >
            <div class="re-middle">
              <ReportTable
                v-for="(item,index) in mockDataR"
                :key="index"
                :noRobot="true"
                :url="url"
                path="taskReport"
                :reportData="item"
                :isAllInfo="false"
              />
            </div>
          </div>
          <div class="report">
            <span>其他巡视报告</span>
            <p @click="handleReport(0)">查看更多-></p>
          </div>
          <div
            class="reportLoad"
            v-loading="loadingOption"
            element-loading-background="rgba(0, 0, 0, 0)"
            element-loading-text="请稍后，正在加载数据…"
          >
            <div class="re-middle">
              <ReportTable
                v-for="(item,index) in mockData"
                :key="index"
                :url="url"
                :reportData="item"
                :isAllInfo="false"
              />
            </div>
          </div>
          <div class="re-table">
            <duno-tables-tep
              class="table_analysis"
              :columns="RecodeColumns"
              :data="RecodeList"
              :isShowPage="false"
              @on-select="dataListSelectionChangeHandle"
              @clickPage="pageCurrentChangeHandle"
              @on-page-size-change="pageSizeChangeHandle"
            />
          </div>
        </duno-main>
      </div>
    </div>
    <wraning
      @on-fresh="getDataList"
      :popData="popData"
      :detailsType="detailsType"
      :visible="visible"
      @handleClose="handleClose"
    />
  </div>
</template>

<script>
import echarts from "echarts";
import G2 from "@antv/g2";
import Scroller from "_c/duno-m/Scroller";
import dunoMain from "_c/duno-m/duno-main";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import { DunoTablesTep } from "_c/duno-tables-tep";
import mixinViewModule from "@/mixins/view-module";
import ReportTable from "_c/duno-c/ReportTable";
import wraningT from "_c/duno-j/warningT";
import wraning from "_c/duno-j/warning";
import progressD from "./components/progressD";
import { DunoCharts } from "_c/duno-charts";
import { DunoChartPieLoop, DunoChartBarLine } from "_c/duno-charts/index";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import { getRecode } from "@/api/configuration/configuration.js";
import moment from "moment";
import "moment/locale/zh-cn";
export default {
  mixins: [mixinViewModule],
  name: "abnormalInfo",
  components: {
    Scroller,
    dunoBtnTop,
    dunoMain,
    DunoTablesTep,
    ReportTable,
    DunoChartPieLoop,
    DunoChartBarLine,
    DunoCharts,
    wraning,
    wraningT,
    progressD
  },
  computed: {
    isAlarm() {
      return this.$store.state.user.isAlarm;
    },
    toDay() {
      return moment().format("MM月DD日") + " " + moment().format("dddd");
    }
  },
  watch: {
    visible(now) {
      if (!now) {
        this.detailsType = "alarm";
      }
    },
    isAlarm: {
      handler(now) {
        this.getData();
      },
      deep: true
    }
  },
  data() {
    const that = this;
    return {
      mockDataR: [],
      detailsType: "alarm",
      loadingOption: true,
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: "/lenovo-alarm/api/alarm/history",
        exportURL: "/lenovo-alarm/api/alarm/history/export"
      },
      url: "/lenovo-plan/api/statistics/plan/download",
      RecodeList: [],
      popData: {},
      visible: false,
      isItemEchart: true,
      isChange: true,
      dataForm: {},
      alarmLevel: "",
      regionList: [],
      titleType: "全部告警类别",
      messageList: [],
      handleNotes: [],
      ubiquitousData: [],
      alarmType: "",
      isShowEchart: false,
      lockData: [],
      mockData: [],
      envData: {
        temp: 0,
        humid: 0
      },
      defectData: [
        {
          name: "总体",
          num: "320",
          flex: 1,
          color: "#fff"
        },
        {
          name: "手动导入",
          num: "130",
          flex: 0.4,
          color: "#1B6697"
        },
        {
          name: "摄像机标定",
          num: "100",
          flex: 0.35,
          color: "#53CBC3"
        },
        {
          name: "设别结果",
          num: "90",
          flex: 0.3,
          color: "#FFDB29"
        }
      ],
      columns: [
        {
          title: "时间",
          key: "alarmTime",
          minWidth: 90,
          align: "center",
          tooltip: true
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
          title: "描述",
          key: "alarmContent",
          minWidth: 90,
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
          title: " ",
          key: "id",
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
      RecodeColumns: [
        {
          title: "时间",
          key: "date",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "对象",
          key: "monitorDeviceName",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "识别结果",
          key: "description",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: " ",
          key: "id",
          width: 90,
          align: "center",
          render: (h, params) => {
            const that = this;
            let newArr = [];
            newArr.push([
              h(
                "el-button",
                {
                  class: "detail_main",
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
                      that.detailsType = "task";
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
      gridOption: {
        top: 10
      },
      legendOption: {
        orient: "vertical",
        right: "20%",
        top: "60%",
        data: ["解锁", "闭锁"],
        textStyle: {
          color: "#fff",
          fontSize: 14
        }
      },
      titleOption: {
        text: "锁具状态",
        right: "17%",
        top: "45%",
        textStyle: {
          color: "#fff",
          fontSize: 16
        }
      },
      seriesOption: [
        {
          name: "半径模式",
          type: "pie",
          radius: "55%",
          roseType: "radius",
          center: ["35%", "50%"],
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          data: [{ value: 1, name: "解锁" }, { value: 3, name: "闭锁" }]
        }
      ],
      colorOption: ["#1b6697", "#53cbc3"],
      radiusOption: "80%",
      // centerOption: ["30%", "50%"],
      tempEnv: {
        envTemp: 0,
        humidity: 0,
        resConf: 0,
        windSpeed: 0,
        resInfo: 0
      },
      xAxisOptionBar: {
        type: "category",
        axisTick: { show: false },
        data: ["处理器", "内存", "磁盘"],
        axisLine: {
          lineStyle: {
            color: "#678a99" // X轴及其文字颜色
          }
        }
      },
      yAxisOptionBar: [
        {
          type: "value",
          name: "(%)",
          nameTextStyle: {
            padding: [0, 30, 0, 0]
          },
          data: [0, 20, 40, 60, 80, 100],
          axisLine: {
            lineStyle: {
              color: "#678a99" // X轴及其文字颜色
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#134b63",
              type: "dashed"
            }
          }
        }
      ],
      gridOptionBar: {
        // top: "5%"
      },
      seriesOptionBar: [
        {
          name: "已占用",
          type: "bar",
          barGap: 0,
          barWidth: 20,
          data: [20, 52, 69]
        },
        {
          name: "未占用",
          type: "bar",
          barWidth: 20,
          data: [90, 80, 30]
        }
      ],
      tooltipOptionBar: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      isItemEchartBar: true,
      isChangeBar: true
    };
  },
  created() {
    this.getdefectData();
    this.getRecodeList();
    this.getData();
    this.getMockData();
    this.getTableD();
    this.getLevel();
    this.isScreen();
    this.getEnv();
    this.$nextTick(() => {
      this.getUbiquitous();
      this.getEchartsBar();
      this.getLock();
    });
  },
  methods: {
    getdefectData() {
      let url = "/lenovo-sample/api/sample/data/statistics";
      getAxiosData(url).then(res => {
        let data = res.data;
        this.defectData[0].num = data.totalNum;
        this.defectData[1].num = data.handleNum;
        this.defectData[1].flex = (data.handleNum / data.totalNum).toFixed(2);
        this.defectData[2].num = data.cameraNum;
        this.defectData[2].flex = (data.cameraNum / data.totalNum).toFixed(2);
        this.defectData[3].num = data.resultNum;
        this.defectData[3].flex = (data.resultNum / data.totalNum).toFixed(2);
      });
    },
    handleReport(item) {
      let planType;
      if (item) {
        planType = "1";
      } else {
        planType = "2,3,4,5";
      }
      this.$router.push({
        name: "reportFrom",
        query: {
          planType: planType
        }
      });
    },
    getLock() {
      let that = this;
      let url = "/lenovo-smartlock/permit/getDevicesStatus";
      postAxiosData(url).then(res => {
        let data = res.data;
        if (data.open == 0 && data.close == 0) {
          that.legendOption.data = ["解锁 : 50%（0）", "闭锁 : 50%（0）"];
          that.seriesOption[0].data = [
            { value: data.open, name: that.legendOption.data[0] },
            { value: data.close, name: that.legendOption.data[1] }
          ];
        } else {
          let total = data.close + data.open;
          let close = Math.round((data.close / total) * 100);
          let open = Math.round((data.open / total) * 100);
          that.legendOption.data = [
            `解锁 : ${open}%（${data.open}）`,
            `闭锁 : ${close}%（${data.close}）`
          ];
          that.seriesOption[0].data = [
            { value: data.open, name: that.legendOption.data[0] },
            { value: data.close, name: that.legendOption.data[1] }
          ];
        }
        that.isChange = !that.isChange;
        that.$forceUpdate();
      });
    },
    getEchartsBar() {
      let occupied = [];
      let unoccupied = [];
      let query = {
        hostType: "0"
      };
      getAxiosData(
        "/lenovo-mon/api/monitoring/pro/zabbix/getCpuLoad",
        query
      ).then(res => {
        let data = res.data;
        occupied.push(
          Math.round(((data.total - data.used) / data.total) * 100)
        );
        unoccupied.push(Math.round((data.used / data.total) * 100));
        getAxiosData(
          "/lenovo-mon/api/monitoring/memory/zabbix/getMemoryLoad",
          query
        ).then(res => {
          let data1 = res.data;
          occupied.push(Math.round((data1.available / data1.total) * 100));
          unoccupied.push(
            Math.round(((data1.total - data1.available) / data1.total) * 100)
          );
          getAxiosData(
            "/lenovo-mon/api/monitoring/disk/zabbix/getDiskStatus",
            query
          ).then(res => {
            let data2 = res.data;
            occupied.push(Math.round((data2.available / data2.total) * 100));
            unoccupied.push(
              Math.round(((data2.total - data2.available) / data2.total) * 100)
            );
            this.seriesOptionBar[0].data = occupied;
            this.seriesOptionBar[1].data = unoccupied;
            this.isChangeBar = !this.isChangeBar;
            this.$forceUpdate();
          });
        });
      });
    },
    getUbiquitous() {
      let url = "/lenovo-mon/api/monitoring/rack/zabbix/rack-health";
      getAxiosData(url).then(res => {
        let ubiquitousData = res.data;
        this.init(ubiquitousData);
      });
      let url1 = "/lenovo-mon/api/monitoring/env/zabbix/env-status";
      getAxiosData(url1).then(res => {
        this.envData = res.data.data;
      });
    },
    getEnv() {
      getAxiosData("/lenovo-robot/rest/envTemp/substation/1/robot/1").then(
        res => {
          let data = res.data;
          for (let i = 0; i < Object.keys(data).length; i++) {
            data[Object.keys(data)[i]] = Number(
              data[Object.keys(data)[i]]
            ).toFixed(2);
          }
          this.tempEnv = data;
          this.$forceUpdate();
        }
      );
    },
    isScreen() {
      let distinguish = window.screen.availWidth;
      let that = this;
      if (distinguish > 3500) {
        let legendOption = that.legendOption;
        that.radiusOption = "30%";
        legendOption.right = "-2%";
        legendOption.textStyle.fontSize = 12;
        that.isShowEchart = true;
        that.seriesOption[0].radius = "35%";
        this.RecodeColumns.splice(1, 1);
      }
    },
    onSelect(item) {
      this.titleType = item["describeName"];
      this.dataForm.alarmLevel = item["monitorDeviceType"];
      // this.getDataList();
      this.clickQuery(this.dataForm);
    },
    getLevel() {
      postAxiosData("/lenovo-alarm/api/alarm/level").then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleType"
          };
          return obj;
        });
        map.unshift({
          describeName: "全部告警类型",
          monitorDeviceType: "",
          title: "titleType"
        });
        this.regionList = map;
      });
    },
    handleJump(item) {
      let route;
      if (item == 1) {
        route = "meteorological";
      } else if (item == 2) {
        route = "box";
      } else if (item == 3) {
        route = "intellLock";
      } else if (item == 5) {
        route = "list";
      } else if (item == 6) {
        route = "taskForm";
      } else if (item == 7) {
        route = "defectLibrary";
      } else {
        route = "platformMonitor";
      }
      this.$router.push({
        path: route
      });
    },
    getTableD(){
      getAxiosData('/lenovo-plan/api/report/template/list').then(res=>{
        let data = res.data
        data.map(item=>{
          item['planName'] = item['label']
          item['pic'] = require('@/assets/images/tablePic.png')
        })
        this.mockDataR = data.slice(0, 2)
      })
    },
    getMockData() {
      let url = "/lenovo-plan/api/statistics/plan/list";
      let query = {
        pageIndex: 1,
        pageRows: 2
      };
      getAxiosData(url, query).then(res => {
        this.mockData = res.data.tableData;
        this.loadingOption = false;
      });
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
    onClickDropdown(row, type, No) {
      const index = row._index;
      this.dataList[index].alarmLevelName = type;
      this.dataList[index].alarmLevel = No;
      this.psotAlarmData(row, type, No);
    },
    psotAlarmData(row, type, No) {
      const that = this;
      const url = "/lenovo-alarm/api/alarm/level-edit";
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
    getData() {
      const that = this;
      const url = "/lenovo-alarm/api/alarm/list";
      const query = {
        pageIndex: 1,
        pageRows: 10,
        isDeal: "0",
        deviceName: ""
      };
      getAxiosData(url, query).then(res => {
        if (res.code !== 200) {
          that.messageList = [];
          return false;
        }
        that.messageList = res.data.tableData;
      });
    },
    // onClose() {
    //   this.visibleSettingOption = false;
    // },
    handleClose() {
      this.popData = {};
      this.visible = false;
    },
    getRecodeList() {
      getRecode().then(res => {
        this.RecodeList = res.data.tableData.slice(0, 3);
      });
    },
    // getIn() {
    //   this.$router.push({
    //     path: "/abnormalInfoPath/list"
    //   });
    // },
    init(ubiquitousData) {
      let Shape = G2.Shape;
      // 自定义Shape 部分
      Shape.registerShape("point", "pointer", {
        drawShape: function drawShape(cfg, group) {
          let center = this.parsePoint({
            // 获取极坐标系下画布中心点
            x: 0,
            y: 0
          });
          // 绘制指针
          group.addShape("line", {
            attrs: {
              x1: center.x,
              y1: center.y,
              x2: cfg.x,
              y2: cfg.y,
              stroke: cfg.color,
              lineWidth: 3,
              lineCap: "round"
            }
          });
          return group.addShape("circle", {
            attrs: {
              x: center.x,
              y: center.y,
              r: 9.75,
              stroke: cfg.color,
              lineWidth: 3,
              fill: "#fff"
            }
          });
        }
      });

      let data = [
        {
          type: "正常",
          value: ubiquitousData.normal / ubiquitousData.total
        }
      ];
      let chart = new G2.Chart({
        container: "mountNode",
        forceFit: true,
        height: "198",
        padding: "auto"
      });
      chart.source(data);

      chart.coord("polar", {
        startAngle: (-10 / 8) * Math.PI,
        endAngle: (2 / 8) * Math.PI,
        radius: 0.75
      });
      chart.scale("value", {
        min: 0,
        max: 1,
        tickInterval: 1,
        nice: false
      });

      chart.axis(false);
      chart.legend(false);
      chart
        .point()
        .position("value*1")
        .shape("pointer")
        .color("#53cbc3")
        .active(false);

      // 绘制仪表盘背景
      chart.guide().arc({
        zIndex: 0,
        top: false,
        start: [0, 0.945],
        end: [9, 0.945],
        style: {
          // 底灰色
          stroke: "#cccccc",
          lineWidth: 5
        }
      });
      // 绘制指标
      chart.guide().arc({
        zIndex: 1,
        start: [0, 0.945],
        end: [data[0].value, 0.945],
        style: {
          stroke: "#53cbc3",
          lineWidth: 5
        }
      });
      // 绘制指标数字
      chart.guide().html({
        position: ["50%", "80%"],
        html:
          '<div style="width: 300px;text-align: center;">' +
          '<p class="gaugeClass">正常</p>' +
          '<p class="gaugeClass1">' +
          data[0].value * 100 +
          "%</p>" +
          "</div> "
      });

      chart.render();
    }
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.abnormalInfoHome {
  height: 90%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .reportTable .btn > div:first-child {
    border-right: 2px solid #203e52;
  }
  .reportTable {
    & > div:first-child {
      padding-bottom: 56%;
      height: inherit;
      position: relative;
      img {
        height: 100% !important;
        width: 100%;
        display: block;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    .content {
      padding: 10px 20px 10px 20px;
      margin-bottom: 45px;
    }
  }
  .dunoMain_nr {
    overflow-y: auto;
    padding: 0;
  }
  .detail_main {
    color: #539ce3;
    text-decoration: underline;
  }
  .el-loading-text {
    color: #969696 !important;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .main_contain {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 10px;
    background: rgba(20, 40, 56, 0.8);
  }
  .topNav {
    width: 100%;
    background-color: rgba(20, 40, 56, 0.8);
    height: 80px;
  }
  .middle {
    margin-top: 20px;
    margin-bottom: 20px;
    overflow: hidden;
    height: 100%;
    width: calc(50% - 10px);
    // @media screen and (max-width: 1366px) {
    //   height: 70%;
    // }
    // @media screen and (max-width: 1366px), screen and (max-height: 1080px) {
    //   height: 80%;
    // }
    .abnormalInfo {
      width: 100%;
      margin-right: 20px;
      position: relative;
      padding: 2px;
      height: 64%;
      .ivu-table-cell {
        padding-left: 0;
        padding-right: 0;
      }
      .contain {
        padding: 20px;
        width: 100%;
        height: 100%;
        background-color: rgba(20, 40, 56, 0.8);
        border: 2px solid transparent;
        transition: border 0.5s;
        &:hover {
          border: 2px solid white;
          transition-duration: 0.5s;
        }
        .pointer {
          cursor: pointer;
          flex: 1;
        }
        .table_abnormalInfo {
          margin-top: 20px;
        }
        .dunoMain_nr {
          // padding: 20px;
          padding: 0;
          .tablesTep {
            height: 510px;
            .ivu-table {
              height: 432px;
            }
          }
        }
      }
    }
  }
  .middle-center {
    width: calc(25% - 20px);
    height: 100%;
    margin: 20px 20px 0;
    @media screen and (max-width: 1366px) {
      // margin: 10px 10px 0;
      font-size: 12px;
    }
    & > div:first-child {
      width: 100%;
      height: 64%;
    }
    .right {
      background-color: rgba(32, 62, 82, 0.8);
      width: 100%;
      height: 32%;
      margin-top: 20px;
      & > div:nth-child(2) {
        width: 100%;
        height: 88%;
      }
      .echartBox {
        // padding-top: 30px;
      }
    }
    .defect {
      background-color: rgba(32, 62, 82, 0.8);
      width: 100%;
      height: calc(50% - 10px);
      margin-bottom: 20px;
      .defectInfo {
        margin: 30px 20px 20px 20px;
        @media screen and (max-width: 1366px) {
          margin: 20px 10px;
        }
      }
    }
    .conter {
      width: 100%;
      height: calc(50% - 10px);
      background-color: rgba(0, 70, 101, 0.8);
      margin-bottom: 20px;
    }
  }
  .middle-right {
    width: calc(25% - 10px);
    height: 100%;
    margin-top: 20px;
    & > div {
      height: 100%;
    }
    .report {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      span {
        color: #aaa;
      }
      p {
        color: #5fafff;
        text-decoration: underline;
        text-decoration-color: #5fafff;
      }
    }
    .re-middle {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      & > div:last-child {
        margin-left: 10px;
      }
      .reportTable {
        height: 100%;
        width: calc(50% - 5px);
        margin-bottom: 0;
        .content {
          padding: 10px 10px 0 10px;
          h3 {
            margin-bottom: 5px;
            font-size: 14px;
          }
          p {
            font-size: 12px;
          }
        }
        .btn {
          div {
            font-size: 12px;
          }
        }
      }
    }
    .reportLoad {
      height: 34.5%;
      @media screen and (max-width: 1366px) {
        height: 28%;
      }
    }
    .re-table {
      margin-top: 20px;
      .ivu-table {
        font-size: 12px;
      }
      .ivu-table th {
        font-size: 14px;
        height: 32px;
      }
      .ivu-table-wrapper {
        tr {
          td {
            height: 32px;
          }
        }
      }
    }
  }
  .bottom {
    margin-top: 20px;
    width: 100%;
    height: 32%;
    display: flex;
    justify-content: flex-start;
    & > div {
      height: 100%;
    }
    & > div:first-child {
      width: calc(55% - 20px);
      margin-right: 20px;
      background-color: rgba(0, 70, 101, 0.8);
    }
    & > div:nth-child(2) {
      width: 45%;
      background-color: rgba(32, 62, 82, 0.8);
    }
    .weater {
      overflow: hidden;
      & > div:first-child {
        padding-top: 30px;
        p {
          padding-left: 30px;
          font-size: 18px;
          color: #aaa;
          @media screen and (max-width: 1366px) {
            padding-left: 20px;
          }
        }
        div {
          color: #fff;
          @media screen and (max-width: 1366px) {
            margin-left: -10px;
          }
          i {
            font-size: 100px;
            @media screen and (max-width: 1366px) {
              font-size: 80px;
            }
          }
          span {
            font-size: 36px;
            @media screen and (max-width: 1366px) {
              font-size: 24px;
            }
          }
        }
      }
    }
    .btmWeater {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
      & > div {
        color: #fff;
        img {
          vertical-align: bottom;
        }
      }
      & > div:first-child {
        margin-left: 25px;
      }
      & > div:nth-child(2) {
        margin-right: 11%;
      }
    }
  }
  .iconTop {
    cursor: pointer;
    flex: 1;
    color: #ffffff;
    font-size: 18px;
    line-height: 30px;
    img {
      vertical-align: top;
    }
    .icon-quexianku {
      font-size: 26px;
    }
  }
  .topTitle {
    display: flex;
    justify-content: space-between;
    & > div:nth-child(2) {
      .dunoBtnTop {
        width: 200px;
        .btnList {
          top: 0;
        }
      }
    }
  }
  .iconcen {
    cursor: pointer;
    padding: 20px;
    position: relative;
    .contain {
      // padding: 20px;
      width: 100%;
      height: 100%;
      background-color: rgba(20, 40, 56, 0.8);
      border: 2px solid transparent;
      transition: border 0.5s;
      overflow: hidden;
      &:hover {
        border: 2px solid #435360;
        transition-duration: 0.5s;
        box-sizing: border-box;
      }
      .demo {
        .angle:first-child {
          top: -2px;
          left: -2px;
        }
        .angle-top-right {
          right: 0;
          top: 0;
        }
        .angle-botton-left {
          left: 0;
          bottom: 0;
        }
        .angle-botton-right {
          bottom: 0;
          right: 0;
        }
      }
    }
    .dunoMain_nr {
      overflow: hidden;
      background: transparent;
    }
    .gauge {
      float: left;
      height: 198px;
      width: 50%;
      .gauge_top,
      .gauge_btm {
        height: 50%;
        padding-left: 50%;
        padding-top: 10%;
        position: relative;
        p {
          font-size: 20px;
          color: #fff;
          white-space: nowrap;
          @media screen and (max-width: 1366px) {
            font-size: 16px;
          }
        }
        span {
          font-size: 18px;
          color: #8f9598;
          white-space: nowrap;
          @media screen and (max-width: 1366px) {
            font-size: 14px;
          }
        }
        i {
          color: #fff;
          font-size: 30px;
          position: absolute;
          top: 30%;
          left: 30%;
          @media screen and (max-width: 1366px) {
            font-size: 25px;
            left: 20%;
            top: 20%;
          }
        }
      }
    }
    .echartsBar {
      height: 198px;
    }
    .gaugeClass {
      font-size: 14px;
      color: #ffffff;
      margin: 0;
      @media screen and (max-width: 1366px) {
        font-size: 12px;
        margin-top: -10px;
      }
    }
    .gaugeClass1 {
      font-size: 20px;
      color: #fff;
      margin: 0;
      @media screen and (max-width: 1366px) {
        font-size: 16px;
      }
    }
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
  .icon-xiala {
    color: white;
    font-size: 13px;
  }
  .el-button--text {
    border-color: transparent !important;
    background: transparent !important;
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
  .flexPos {
    display: flex;
    align-items: center;
  }
  //-------------------表格样式
  .dunoMain {
    height: inherit;
  }
  .ivu-table {
    font-size: 14px;
  }
  .ivu-table th {
    color: #fff;
    border: none;
    height: 48px;
    background-color: #2d5980 !important;
    font-size: 16px;
    font-weight: normal;
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
</style>
