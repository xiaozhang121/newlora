<template>
  <div class="popupinfo">
    <historical-documents
      :showHeader="true"
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
          :deviceOptionId="deviceId"
          :monitorDeviceType="monitorDeviceType"
          :itemData="itemData"
          :isShowClassify="showClassify"
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
          @onChange="setTime"
          :legendData="legendData"
          :xAxisData="xAxisData"
          :seriesData="seriesData"
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
import { postAxiosData, getAxiosData } from '@/api/axiosType'
import { getAlarmHistory, getPlanHistory } from "@/api/currency/currency.js";
import historicalwarning from "./components/historicalwarning";
export default {
  name: "popupinfo",
  components: { HistoricalDocuments, realtime, historicalwarning, Polygonal },
  data() {
    return {
      monitorDeviceType: '',
      pointList:[],
      mainTitle: '',
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
      isShowClassify: true,
      legendData: [],
      xAxisData: [],
      seriesData: [],
      classifyData: "A"
    };
  },
  props: {
    showClassify:{},
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
    typeProp: {
      // 两种类型monitor(监控)  power(电网)
      type: String,
      default: "monitor"
    }
  },
  watch:{
      classifyData(now){
          if(now == 'A'){
              this.getOPoint(0)
          }else if(now == 'B'){
              this.getOPoint(1)
          }else if(now == 'C'){
              this.getOPoint(2)
          }
      },
      showClassify:{
          handler(now){
              this.isShowClassify = now
          },
          deep: true,
          immediate: true
      },
      itemData:{
          handler(now){
              if(now){
                  this.mainTitle = now['deviceName']
                  now['monitorDeviceId'] = now['deviceIdStr']
                  this.getPointList(now['deviceIdStr'])
              }
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
    getPointList(deviceId){
        getAxiosData('/lenovo-device/api/device/phase',{powerDeviceId: deviceId}).then(res=>{
            this.pointList = res.data
            this.getOPoint(0)
        })
    },
    getOPoint(index){
        this.deviceId = this.pointList[index]['deviceIdStr']
        getAxiosData('lenovo-device/api/device/rtmp',{powerDeviceId: this.pointList[index]['deviceIdStr']}).then(res=>{
            this.monitorDeviceType = res.data['monitorDeviceType']
            this.initData()
        })
    },
    clickClassify(data, flag) {
      console.log("当前为：", data, "相");
      this.classifyData = data;
      if (flag) this.initData();
    },
    onShow(data) {
      this.activeName = data;
      this.initData();
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
    getFifthData() {
      const that = this;
      let queryT = {
        [this["deviceType"]]: this.deviceId,
        monitorDeviceType: this.monitorDeviceType,
        startTime: `${this.startTime} 00:00:00`,
        endTime: `${this.endTime} 23:59:59`
      };
      getPlanHistory(queryT).then(res => {
        const dataList = res.data.dataList;
        const legendData = [];
        const xAxisData = [];
        const seriesData = [];
        for (let i = 0; i < dataList.length; i++) {
          legendData.push(dataList[i].itemName);
          const itemDataList = dataList[i].itemDataList;
          const obj = {
            name: dataList[i].itemName,
            type: "line",
            data: []
          };
          for (let item in itemDataList) {
            if (i == 0) {
              xAxisData.push(itemDataList[item].time);
            }
            obj.data.push(Number(itemDataList[item].data));
          }
          seriesData.push(obj);
        }
        that.legendData = legendData;
        that.xAxisData = xAxisData;
        that.seriesData = seriesData;
        that.isChange = !that.isChange;
      });
    },
    setTime(target) {
      this.startTime = moment(target[0]).format("YYYY-MM-DD");
      this.endTime = moment(target[1]).format("YYYY-MM-DD");
      this.initData();
    }
  },
  created() {
    this.startTime = moment().format("YYYY-MM-DD");
    this.endTime = moment().format("YYYY-MM-DD");
    // this.initData();
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
  .HistoricalDocuments {
    .titleBtn {
      margin-right: 53px;
      margin-top: -40px;
    }
  }
}
</style>
