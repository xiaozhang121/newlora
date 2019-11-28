<template>
  <div class="popupinfo">
    <historical-documents
      :showHeader="true"
      class="vNormal"
      :title="mainTitle"
      width="500px"
      :itemId="deviceId"
      :isClassify="isShowClassify"
      :tabPaneData="tabPaneData"
      @clickClassify="clickClassify"
      @on-show="onShow"
      :dialogTableVisible="visible"
      @close="onClose"
    >
      <div>
        <realtime
          :monitorDeviceType="monitorDeviceType"
          :itemData="itemData"
          :classifyData="classifyData"
          :isClassify="isShowClassify"
          v-if="activeName == 'first'"
        />
        <historicalwarning
          :title="title"
          :dataList="alarmHistoryData"
          v-if="activeName == 'fourth'"
        />
        <polygonal
          ref="polygonalRef"
          @on-charts="onCharts"
          @onChange="setTime"
          :itemData="itemData"
          :legendData="legendData"
          :yName="yName"
          :xAxisData="xAxisData"
          :seriesData="seriesData"
          :flag="flag"
          :isChange="isChange"
          v-if="activeName == 'fifth'"
        />
      </div>
    </historical-documents>
  </div>
</template>
<script>
import moment from "moment";
import HistoricalDocuments from "_c/duno-c/HistoricalDocuments";
import realtime from "./components/realtime";
import Polygonal from "_c/duno-c/Polygonal";
import { getAlarmHistory, getPlanHistory, getPlanHistoryN } from "@/api/currency/currency.js";
import historicalwarning from "./components/historicalwarning";
export default {
  name: "popupinfo",
  components: { HistoricalDocuments, realtime, historicalwarning, Polygonal },
  data() {
    return {
      typeChosen:'Single',
      presetPos: [],
      yName: "",
      mainTitle: "",
      alarmHistoryData: [],
      activeName: "first",
      tabPaneData: [
        {
          label: "实时信息",
          name: "first"
        },
        {
          label: "历史告警",
          name: "fourth"
        },
        {
          label: "历史数据",
          name: "fifth"
        }
      ],
      startTime: "",
      endTime: "",
      isChange: true,
      isShowClassify: false,
      legendData: [],
      xAxisData: [],
      seriesData: [],
      flag: null,
      classifyData: "A",
      isInit: false
    };
  },
  props: {
    showClassify: {},
    isDiagram: {},
    itemData: {},
    index: {},
    title: {
      type: String,
      default: () => {
        return "";
      }
    },
    visible: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    deviceId: {
      type: [Number, String],
      default: 1
    },
    monitorDeviceType: {
      type: [Number, String],
      default: "1"
    },
    typeProp: {
      // 两种类型monitor(监控)  power(电网)
      type: String,
      default: "monitor"
    }
  },
  watch: {
    itemData: {
        handler(now) {
          if(now['realMonitorDeviceType']==7){
            this.tabPaneData.splice(this.tabPaneData.length-1,1)
            this.tabPaneData.splice(this.tabPaneData.length-1,1)
          }else if(now['realMonitorDeviceType']==3){
            this.tabPaneData.splice(this.tabPaneData.length-1,1)
          }
          let supportPreset = now.deviceMessage.supportPreset
          let monitorDeviceType = now.monitorDeviceType
          if(monitorDeviceType == 1 && monitorDeviceType){
            this.typeChosen = 'Single'
          }else if(monitorDeviceType == 2){
            this.typeChosen = 'Multiple'
          }
        },
        deep: true,
        immediate: true
    },
    activeName(now){
      if(now != 'fifth')
          this.flag = null
    },
    showClassify: {
      handler(now) {
        this.isShowClassify = now;
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    deviceType() {
      switch (this.typeProp) {
        case "monitor":
          return "monitorDeviceId";
        case "power":
          return "powerDeviceId";
      }
    }
  },
  methods: {
    onCharts(now){
      if (this.activeName == 'fifth'){
        this.presetPos = now
        this.initData()
      }
    },
    clickClassify(data, flag) {
      console.log("当前为：", data, "相");
      this.classifyData = data;
      if (flag) this.initData();
    },
    onShow(data) {
      this.activeName = data;
      // this.initData();
    },
    onClose(data) {
      this.$emit("onClose", data, this.index, "popupinfoVisable");
    },
    initData() {
      if (this.activeName == "fourth") {
        this.getFourthData();
      } else if (this.activeName == "fifth") {
        this.getFifthData();
      }
    },
    getFourthData() {
      const that = this;
      let query = {
        [this["deviceType"]]: this.deviceId,
        pageIndex: 1,
        pageRows: 10
      };
      getAlarmHistory(query).then(res => {
        res.data.tableData.map(item => {
          item["show"] = false;
        });
        console.log(res.data.tableData);
        that.alarmHistoryData = res.data.tableData;
      });
    },
    getAxisData(data){
      let xAxisData = []
      data.forEach(item=>{
        item['itemDataList'].forEach(el =>{
          if(xAxisData.indexOf(el[0]) < 0)
            xAxisData.push(el[0])
        })
      })
      xAxisData.sort(function (a, b) {
        return a < b ? -1 : 1
      })
      return xAxisData
    },
    getFifthData() {
      const that = this;
      this.isInit = true
      let queryT = {
        [this["deviceType"]]: this.deviceId,
        monitorDeviceType: this.monitorDeviceType,
        startTime: `${this.startTime} 00:00:00`,
        endTime: `${this.endTime} 23:59:59`,
        recognizeType: this.presetPos.join(',')
      };
      getPlanHistoryN(queryT).then(res => {
        const dataList = res.data.dataList;
        /*let dataList = [
          {
            itemName: '项目名称（可见光为电网设备名称，热感为roi名称）222222222',
            itemDataList: [
              ['2019-01-01', '10'],
              ['2019-01-02', '20'],
              ['2019-01-06', '90']
            ],
            maxData: 100,
            minData: 30,
            unit: '单位',
            flag: 0
          },
          {
            itemName: '项目名称（可见光为电网设备名称，热感为roi名称）1111111111',
            itemDataList: [
              ['2019-01-01', 200],
              ['2019-01-09', 40],
              ['2019-01-20', 300]
            ],
            maxData: 100,
            minData: 30,
            unit: '单位123',
            flag: 0
          }
        ]*/
        let xAxisData = that.getAxisData(dataList)
        let domData = this.$refs.polygonalRef.$data
        let dom = this.$refs.polygonalRef
        domData.chartsType = this.typeChosen
        if(this.typeChosen == 'Single'){
          domData.chartsList = dataList
          this.$refs.polygonalRef.changeActive(0)
        }else{
          this.$refs.polygonalRef.chartsList = []
          domData.xAxisData = xAxisData
          let legendData = []
          let seriesData = []
          for(let i=0; i<dataList.length; i++){
            let obj = dom.handleData(i, dataList, true)
            legendData.push(...obj.legendData)
            seriesData.push(...obj.seriesData)
          }
          domData.legendData = legendData
          domData.seriesData = seriesData
          domData.isChangeFlag = !domData.isChangeFlag
        }
      });
    },
    setTime(target) {
      this.startTime = moment(target[0]).format("YYYY-MM-DD");
      this.endTime = moment(target[1]).format("YYYY-MM-DD");
      if(this.isInit || this.typeChosen == 'Single')
        this.initData();
    }
  },
  created() {
    this.startTime = moment().format("YYYY-MM-DD");
    this.endTime = moment().format("YYYY-MM-DD");
    console.log(
      "设备类型：",
      this.itemData.monitorDeviceType == "1" ||
        this.itemData.monitorDeviceType == "5"
        ? "可见光"
        : this.itemData.monitorDeviceType == "2"
        ? "红外"
        : "参数没对上"
    );
    if (
      this.itemData.monitorDeviceType == "1" ||
      this.itemData.monitorDeviceType == "5"
    ) {
      this.mainTitle = this.itemData.deviceMessage.cameraName;
    } else if (this.itemData.monitorDeviceType == "2") {
      this.mainTitle = this.itemData.deviceMessage.name;
    }
    if (
      this.itemData &&
      this.itemData.monitorDeviceType &&
      (this.itemData.monitorDeviceType == "1" ||
        this.itemData.monitorDeviceType == "5") &&
      this.isDiagram == 1
    ) {
      this.isShowClassify = true;
    }
  }
};
</script>
<style lang="scss">
.time > div {
  margin-bottom: 10px;
}
.popupinfo {
  .historicalwarning,
  .realtime,
  .polygonal {
    position: relative;
    top: -13px;
  }
  .vNormal{
    .elDialogMain{
      height: 0 !important;
    }
  }
  .HistoricalDocuments {
    .titleBtn {
      position: absolute;
      right: 0;
      top: 63px;
    }
  }
}
</style>
