<template>
  <div class="detailLightN">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="controlTitle">
      <div>{{ dataForm.monitorDeviceName }}</div>
    </div>
    <div class="Main_contain">
      <div class="content" style="margin-top: 15px; position: relative">
        <div class="left nr" style="position: absolute;">
          <div
            class="item"
            style="background: linear-gradient(to right, transparent 100%, #132838 0%);"
          >
            <div class="camera_surveillanceDetail">
              <div class="contain">
                <key-monitor
                  :monitorInfo="{ monitorDeviceId: dataForm.monitorDeviceId }"
                  paddingBottom="56%"
                  :pushCamera="pushCamera"
                  class="monitor"
                  :autoplay="playerOptionsd.autoplay"
                  :streamAddr="playerOptionsd.streamAddr"
                  :showBtmOption="false"
                  :isLive='false'
                  :isNav='true'
                  :isAux='true'
                  @on-fresh="onFresh"
                ></key-monitor>
              </div>
            </div>
          </div>
        </div>
        <div class="right nr contain contain_nr_out">
          <div class="main">
            <div class="top not-print">
              <div>历史数据</div>
              <div class="btn">
                <!-- <div>
                   <duno-btn-top
                           @on-select="onSelect"
                           :zIndex="1"
                           class="dunoBtnTo"
                           :isCheck="false"
                           :dataList="allDataK"
                           :title="titleTypeK"
                           :showBtnList="false"
                   ></duno-btn-top>
                </div>-->
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
              </div>
            </div>
            <div class="contain_nr">
              <div class="chartsChange" v-if="chartsList.length && chartsList.length != 1">
                <label>切换表计</label>
                <span v-for="(item, index) in chartsList" @click="changeActive(index)" :class="{'active': item['active']}">{{ index+1 }}</span>
              </div>
              <echarts
                :echartsKind="echartsKind"
                :dataOBJ="echartData"
                :title="echartTitle"
                :unit="unit"
                gridOptionTop="120"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="middle_table">
        <div class="top not-print">
          <div class="name">历史信息记录</div>
          <div class="select">
            <div>
              <duno-btn-top
                style="visibility: hidden"
                @on-select="onSelect"
                class="dunoBtnTo"
                :isCheck="false"
                :dataList="allDataKind"
                :title="titleType"
                :showBtnList="false"
              ></duno-btn-top>
            </div>
            <div>
              <duno-btn-top
                style="visibility: hidden"
                @on-select="onSelect"
                class="dunoBtnTop"
                :isCheck="false"
                :dataList="allDataLevel"
                :title="titleTypeR"
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
                @change="onChangeHis"
              ></el-date-picker>
            </div>
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
        <duno-tables-tep
          class="table_abnormalInfo"
          :columns="columns"
          :data="dataList"
          :totalNum="totalNum"
          :pageSize="pageRows"
          :current="pageIndex"
          :border="true"
          :showSizer="true"
          :isShowPage='mixinViewModuleOptions.isShowPage'
          @on-select="dataListSelectionChangeHandle"
          @clickPage="pageCurrentChangeHandle"
          @on-page-size-change="pageSizeChangeHandle"
        />
      </div>
    </div>
    <warning-setting @handleClose="onClose" :visibleOption="visibleSettingOption" />
    <wraning
      v-if="visible"
      :popData="popData"
      :discriminate="false"
      :hasSelect="true"
      :alarmLevel="alarmLevel"
      :visible="visible"
       :detailsType="detailsType"
      warningID="20190711002"
      :monitorUrl="popData.alarmFileAddress || ''"
      :judgeResult="popData.alarmContent || ''"
      :origin="popData.monitorDeviceId"
      :handleResult="popData.dealRecord || ''"
      @handleClose="handleClose"
    />
    <enlarge :isShow="isEnlarge" :srcData="srcData" @closeEnlarge="closeEnlarge" />
  </div>
</template>

<script>
import enlarge from "_c/duno-c/enlarge";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import echarts from "_c/duno-c/echarts";
import controBtn from "_c/duno-m/controBtn";
import mixinViewModule from "@/mixins/view-module";
import inspection from "_c/duno-m/inspection";
import { DunoTablesTep } from "_c/duno-tables-tep";
import warningSetting from "_c/duno-j/warningSetting";
import wraning from "_c/duno-j/warning";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import moment from "moment";
import {
  getRedLIght,
  getRedType,
  getRedGrade,
  getRedPreset,
  getRedEcharts,
  getPosition
} from "@/api/configuration/configuration.js";
import { setInterval } from "timers";
export default {
  name: "detailLightN",
  mixins: [mixinViewModule],
  components: {
    dunoBtnTop,
    KeyMonitor,
    Breadcrumb,
    controBtn,
    inspection,
    DunoTablesTep,
    echarts,
    warningSetting,
    wraning,
    enlarge
  },
  data() {
    const that = this;
    return {
      pushCamera: true,
      chartsList: [],
      unit: "",
      detailsType:"task",
      echartsKind: 0,
      addOrEdit: "添加",
      disabled: false,
      echartTitle: "",
      isControl: "1",
      currentTime: 10,
      timeOut: null,
      playerOptions: {
        streamAddr: "",
        autoplay: true
      },
      playerOptionsd: {
        streamAddr: "",
        autoplay: true
      },
      mixinViewModuleOptions: {
        // activatedIsNeed: true,
        getDataListURL: "/lenovo-plan/api/task/result/list",
        exportURL: "/lenovo-plan/api/task/result/list/export"
      },
      titleType: "选择对比设备",
      titleTypeL: "全部数据类型",
      titleTypeK: "全部识别类型",
      titleTypeR: "全部异常类型",
      dataForm: {},
      queryForm: {},
      echartForm: {},
      echartData: [],
      isEnlarge: false,
      srcData: [],
      //   typeList: [],
      value: "",
      alarmLevel: "",
      visible: false,
      visibleSettingOption: false,
      popData: {},
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
          title: "时间",
          key: "executeTime",
          minWidth: 100,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let timeDay = params.row.executeTime.slice(5);
            return h("div", [
              h(
                  "Tooltip",
                  {
                    props: { placement: "top", content: timeDay, transfer: true, maxWidth: "200" }
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
          title: "对象",
          key: "monitorDeviceName",
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
            let data = params.row.part?params.row.part:'/'
            return h("div", data);
          }
        },
        {
          title: "描述",
          key: "content",
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
          title: "数据",
          key: "alarmValue",
          minWidth: 120,
          align: "center",
          tooltip: true
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
                  attrs: { src: params.row.pic },
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
                  attrs: { src: params.row.pic },
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
          title: "自动/手动",
          key: "sourceType",
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
            const that = this;
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
                      that.popData = params.row;
                      that.alarmLevel = params.row.alarmLevel;
                      if(params.row.sourceType=='手动'){
                        this.detailsType='alarm'
                      }else{
                        this.detailsType='task'
                      }
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
      allDataKind: [],
      allDataLevel: [],
      allDataK: [],
      dataTime: "",
      dataBread: [{ name: "摄像头详情" }]
    };
  },
  methods: {
    onFresh(){
      this.pageIndex = 1
      this.getDataList();
    },
    isPushCamera() {
      getAxiosData("/lenovo-device/api/monitor/layout-list", {
        userId: this.$store.state.user.userId
      }).then(res => {
        let cameraList = res.data;
        let ids = []
        cameraList.forEach(item => {
          ids.push(item.monitorDeviceId);
        });
        if(ids.indexOf(this.dataForm.monitorDeviceId)>-1){
          this.pushCamera = false
        }
      });
    },
    changeActive(index){
      this.chartsList.map(item=>{
        item['active'] = false
      })
      this.chartsList[index]['active'] = true
      this.handleData(index)
      this.$forceUpdate()
    },
    handleData(index, arr ,flag){
      const that = this
      let dataList = []
      if(arr){
        dataList = arr
      }else{
        dataList = this.chartsList
      }
      const legendData = []
      const seriesData = []
      that.unit = dataList[index].unit
      that.echartsKind = dataList[index].flag
      legendData.push(dataList[index].itemName)
      let elData = dataList[index]['itemDataList']
      let obj = {
        name: dataList[index].itemName,
        type:'line',
        data: elData
      }
      if(dataList[index].flag){
        obj['step'] = 'start'
      }
      seriesData.push(obj)

      let xAxisData = []
      for(let i=0; i<elData.length; i++){
        xAxisData.push(elData[i][0])
      }
      that.xAxisData = xAxisData
      that.legendData = legendData
      that.seriesData = seriesData
      if(!flag)
        that.isChangeFlag = !that.isChangeFlag
      this.echartData = {legendData: legendData, seriesData: seriesData, xAxisData: xAxisData}
      return this.echartData
    },
    closeEnlarge() {
      this.isEnlarge = false;
    },
    onEdit(name) {
      this.presetName = name;
      this.addOrEdit = "编辑";
    },
    addPoint() {
      this.$refs.inspectionRef.addPosInput = this.presetName;
      this.$refs.inspectionRef.addPosition();
      this.addOrEdit = "添加";
      this.presetName = "";
    },
    initCamera() {
      const that = this;
      that.disabled = true;
      if (this.dataForm.monitorDeviceId) {
        const url =
          "/lenovo-visible/api/visible-equipment/sdk/rtmp/" +
          this.dataForm.monitorDeviceId;
        getAxiosData(url, {}).then(res => {
          that.playerOptionsd.streamAddr = res.data;
          that.$nextTick(() => {
            // setTimeout(() => {
            //   this.$refs.controBtnRef.viewCamera(5, false).then(res => {
            //     setTimeout(() => {
            //       this.$refs.controBtnRef.viewCamera(5, true).then(res => {
            //         that.disabled = false;
            //       });
            //     }, 5000);
            //   });
            // }, 500);
          });
        });
      }
    },
    // cutOut(data) {
    //   if (data) {
    //     const index = data.indexOf("缺陷");
    //     if (index > -1) {
    //       data = data.substring(0, index);
    //     }
    //     return data;
    //   } else {
    //     return "更多";
    //   }
    // },
    onClickDropdown(row, type, No) {
      const index = row._index;
      this.dataList[index].alarmLevelName = type;
      this.dataList[index].alarmLevel = No;
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
      getRedLIght(query).then(
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
    onSelect(item, index) {
      this[item.title] = item["describeName"];
      if (item.title == "titleTypeL") {
        this.dataForm.deviceType = item.monitorDeviceType;
        // this.getDataList();
        this.clickQuery(this.dataForm);
      } else if (item.title == "titleTypeR") {
        this.dataForm.alarmLevel = item.monitorDeviceType;
        // this.getDataList();
        this.clickQuery(this.dataForm);
      } else if (item.title == "titleTypeK") {
        this.echartForm.getEchasrts = item.monitorDeviceType;
        this.getEchasrts();
      }
    },
    onChangeHis(data) {
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD 00:00:00");
        endTime = moment(data[1]).format("YYYY-MM-DD 23:59:59");
      }
      this.dataForm.startTime = startTime;
      this.dataForm.endTime = endTime;
      // this.getDataList();
      this.clickQuery(this.dataForm);
    },
    onChangeTime(data) {
      console.log(data)
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD 00:00:00");
        endTime = moment(data[1]).format("YYYY-MM-DD 23:59:59");
      }
      this.echartForm.startTime = startTime;
      this.echartForm.endTime = endTime;
      this.getEchasrts();
    },
    selectDownloadType(item) {
      const that = this;
      that.queryForm = {
        type:item['monitorDeviceType'],
        monitorDeviceId: that.$route.query.monitorDeviceId,
        ...that.echartForm
      };
      that.exportHandle();
    },
    getSelectType() {
      getRedType().then(res => {
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
          describeName: "所有数据类型",
          monitorDeviceType: "",
          title: "titleTypeL"
        });
        this.allDataKind = map;
      });
      getAxiosData("/lenovo-device/api/recognize-type/select-list", {
        monitorDeviceId: this.dataForm.monitorDeviceId
      }).then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleTypeK"
          };
          return obj;
        });
        map.unshift({
          describeName: "全部识别类型",
          monitorDeviceType: "",
          title: "titleTypeK"
        });
        this.allDataK = map;
      });
    },
    getSelcetGrade() {
      getRedGrade().then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleTypeR"
          };
          return obj;
        });
        map.unshift({
          describeName: "所有异常等级",
          monitorDeviceType: "",
          title: "titleTypeR"
        });
        this.allDataLevel = map;
      });
    },
    getEchasrts() {
      const that = this;
      let query = {
        presetId: this.echartForm.getEchasrts,
        startTime: this.echartForm.startTime,
        endTime: this.echartForm.endTime,
        deviceType: "2",
        powerDeviceId: this.echartForm.sources,
        monitorDeviceId: this.$route.query.monitorDeviceId
      };
      getAxiosData("/lenovo-plan/api/plan/history/new", query).then(res => {
        this.chartsList = res.data.dataList
        this.echartTitle = res.data.title.replace(/\//g,'.')
        console.log(res.data)
        this.changeActive(0)
      });
    },
    handleClose() {
      this.popData = {};
      this.visible = false;
    },
    onClose() {
      this.visibleSettingOption = false;
    },
    getControl() {
      if (this.isControl == "1") {
        this.isControl = "2";
        this.endControl();
      } else if (this.isControl == "2" || this.isControl == "3") {
        this.isControl = "1";
      }
    },
    endControl() {
      if (this.isControl == "2") {
        let that = this;
        let num = 10;
        clearInterval(that.timeOut);
        that.timeOut = setInterval(function() {
          that.isControl = "3";
          let countDown = setInterval(function() {
            that.currentTime--;
            num--;
            if (num == 0) {
              clearInterval(countDown);
              that.isControl = "1";
            }
          }, 1000);
        }, 1000 * 60 * 5);
      }
    },
    getMonitorDeviceName() {
      let url = "/lenovo-device/api/device-monitor/device";
      let query = {
        monitorDeviceId: this.$route.query.monitorDeviceId
      };
      getAxiosData(url, query).then(res => {
        this.dataForm.monitorDeviceName = res.data.deviceName;
      });
    }
  },
  created() {
    this.dataForm.monitorDeviceId = this.$route.query.monitorDeviceId;
    this.isPushCamera()
    this.getMonitorDeviceName();
    this.getDataList();
    this.initCamera();
    this.getEchasrts();
  },
  mounted() {
    this.getSelectType();
    this.getSelcetGrade();
    window.addEventListener("onmousemove", this.endControl());
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
@import "@/style/tableStyle.scss";
.mainAside {
  /*min-height: 100%;*/
}
.detailLightN {
  width: 100%;
  min-height: 100%;
  overflow-y: hidden;
  .keyMonitor .camera .explain .block{
    visibility: hidden;
  }
  .keyMonitor .camera .explain .record{
    display: flex;
  }
  .chartsChange{
    position: relative;
    top: 0px;
    left: 20px;
    z-index: 1;
    @media screen and (max-width: 1366px) {
      top: 37px;
    }
    label{
      font-size: 13px;
      color: #a0a2a3;
      margin-right: 7px;
    }
    span{
      cursor: pointer;
      margin: 0 5px;
      color: #a4a5a6;
      padding: 2px 6px;
      border-radius: 50%;
      border: 1px solid #a4a5a6;
      transform: scale(0.8);
      &.active{
        border: 1px solid #01f3f4;
        color: #01f3f4;
      }
    }
  }
  .icon-xiala {
    /*width: 12px;
    height: 15px;*/
  }
  .echartsData {
    background: transparent;
  }
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
  .imgOrMv {
    width: 50%;
    height: 35px;
    position: relative;
    top: 2px;
  }
  .flexPos {
    .el-button {
      background: rgba(0, 0, 0, 0);
      border: none;
    }
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
  .table_select {
    cursor: pointer;
    // color: #1d1f26;
    color: #fff;
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
        color: #1d1f26;
      }
    }
    &.commonly {
      span {
        background: #5eb0fc;
        color: #1d1f26;
      }
    }
    &.danger {
      span {
        background: #d0011b;
        color: #1d1f26;
      }
    }
  }
  .content {
    display: flex;
    .left {
      width: 75%;
      &.nr {
        display: flex;
        flex-direction: column;
        .item {
          background: linear-gradient(to right, transparent 69.5%, #132838 0%);
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
              background: black;
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
      background: #132838;
      .top {
        color: #ffffff;
        height: 40px;
        margin-bottom: 10px;
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
              width: 160px;
              display: inline-flex;
              padding-bottom: 0;
              .btnList {
                top: inherit !important;
                width: 160px;
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
              background-image: url(../../../assets/images/btn/moreBtn.png);
              cursor: pointer;
            }
          }
          // .clickBtn {
          //   line-height: 40px;
          //   width: 139px;
          //   cursor: pointer;
          //   background-image: url(../../../assets/images/btn/moreBtn.png);
          //   text-align: center;
          //   font-size: 18px;
          //   color: #ffffff;
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
              color: #fff;
            }
            .el-range-editor--small .el-range-input {
              font-size: 16px;
            }
            ::placeholder {
              color: #fff;
            }
          }
        }
      }
    }
  }
  .middle_table {
    margin-top: 20px;
    margin-bottom: 96px;
    width: 100%;
    min-height: 300px;
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
        font-size: 20px
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
              width: 160px;
              .title {
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
        .dunoBtnTop {
            width: 150px;
            position: relative;
            left: 10px;
            display: inline-flex;
            padding-bottom: 0;
            .btnList {
              top: inherit !important;
              width: 150px;
              .title {
                padding: 8px 20px;
              }
            }
          }
        // & > div:nth-child(2) {
        //   & > div {
        //     width: 140px;
        //     line-height: 40px;
        //     text-align: center;
        //     background-color: #192f41;
        //     cursor: pointer;
        //   }
        // }
        // & > div:last-child {
        //   font-size: 22px;
        // }
        // .clickBtn {
        //   line-height: 40px;
        //   width: 139px;
        //   background-image: url(../../../assets/images/btn/moreBtn.png);
        //   text-align: center;
        //   font-size: 18px;
        //   color: #ffffff;
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
            color: #fff;
          }
          .el-range-editor--small .el-range-input {
            font-size: 16px;
          }
          ::placeholder {
              color: #fff;
            }
        }
      }
    }
  }
  .contain_nr_out {
    margin-left: 52.1%;
    padding-bottom: 28.6%;
    width: 48% !important;
    position: relative;
    background: linear-gradient(transparent 15%, #132838 0%) !important;
    .main {
      position: absolute;
      width: 100%;
      overflow: hidden;
      height: 100%;
      .contain_nr {
        position: absolute;
        left: 0;
        top: 50px;
        width: 100%;
        height: 400px;
        padding-top: 70px;
        @media screen and (min-width: 3000px) {
          padding-top: 50px;
          top: 30px;
        }
        @media screen and (max-width: 1366px) {
          padding-top: 50px;
          top: 30px;
        }
        & .chartsChange{
          @media screen and (min-width: 3000px) {
            top: 41px;
          }
        }
        .chartBox {
          height: 400px;
          .charts {
            height: 300px;
            @media screen and (min-width: 3000px) {
              height: 250px;
            }
            @media screen and (max-width: 1366px) {
              height: 250px;
            }
          }
        }
      }
    }
  }
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
  .el-popper[x-placement^="bottom"] .popper__arrow {
    display: none;
  }
  .controlTitle {
    overflow: hidden;
    color: #fff;
    margin-bottom: 10px;
    & > div {
      float: left;
    }
    & > div:first-child {
      font-size: 20px;
      width: 52%;
    }
    .control {
      font-size: 18px;
      span {
        font-size: 14px;
        text-align: center;
        cursor: pointer;
        display: inline-block;
        width: 90px;
        line-height: 32px;
        background: #305e83;
        border-radius: 16px;
        margin-left: 10px;
      }
      i {
        color: #ffcc30;
        font-style: normal;
      }
    }
  }
}
.el-popper[x-placement^="bottom"],
.el-popper[x-placement^="top"] {
  /*background: #192f41;*/
  border: none;
}
</style>
