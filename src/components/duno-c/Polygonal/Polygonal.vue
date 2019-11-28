<template>
  <div class="polygonal" :style="{width:width+'px'}"  ref="polygonal" :class="{'fullscreen': isFullscreen}">
    <h4 class="title">{{ title }}</h4>
    <div class="time">
      <div class="radioChange" v-show="!isFullscreen">
        <el-radio-group v-model="radio" @change="onChangeRadio">
          <el-radio :label="1">今日</el-radio>
          <el-radio :label="2">昨日</el-radio>
        </el-radio-group>
      </div>
      <div class="block"  v-show="!isFullscreen">
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
      <div class="normalPanel" style="position: relative; left: -9px"  v-show="!isFullscreen">
        <select-chosen  ref="selectChosen" @on-active="onActive" :typeChosen="typeChosen" :monitorInfo="itemData" v-if="itemData && isShow"/>
      </div>
    </div>
    <div class="chartsChange" v-if="chartsList.length && chartsList.length != 1"  v-show="!isFullscreen">
      <label>切换表计</label>
      <span v-for="(item, index) in chartsList" @click="changeActive(index)" :class="{'active': item['active']}">{{ index+1 }}</span>
    </div>
    <div class="echarts">
      <div class="title-fullScreen" v-show="isFullscreen">
        {{ fullTitle }}
        <span @click="clickMagnify($refs.contentMagnify)"><i class="iconfont icon-suoxiao"></i></span>
      </div>
      <duno-charts
        :isChange="isChangeFlag"
        :isItemEchart="isItemEchart"
        :legendOption="legendOption"
        :xAxisOption="xAxisOption"
        :yAxisOption="yAxisOption"
        :seriesOption="seriesOption"
      />
    </div>
    <p class="move moveTarget" id="moveTarget" @drop="drop($event)" @dragover="allowDrop($event)" v-show="!isFullscreen">
      <span>你可拖拽微型气象站至此处进行对比</span>
    </p>
  </div>
</template>

<script>
import moment from "moment";
import { getAxiosData } from "@/api/axiosType";
import selectChosen  from "_c/duno-m/selectChosen";
import screenfull from "screenfull"
import { DunoCharts } from "_c/duno-charts";
import { constants } from "crypto";
export default {
  name: "Polygonal",
  components: { DunoCharts, selectChosen },
  props: {
    itemData:{
      type: Object,
      default: () => {
        return {}
      }
    },
    width: {
      type: String,
      default: ""
    },
    xName: {
      type: String,
      default: "(时)"
    },
    yMax: {
      type: Number,
      default: 100
    },
    yMin: {
      type: Number,
      default: 0
    },
    ySplitNumber: {
      type: Number,
      default: 5
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
        return "";
      }
    },
    itemId: {
      type: String | Number
    },
    type: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    const that = this;
    return {
      titleP: '',
      isFullscreen: false,
      chartsType: '',
      yName: '',
      flag: 0,
      chartsList: [],
      seriesData: [],
      legendData: [],
      xAxisData: [],
      typeChosen: 'Multiple',
      isShow: true,
      isChangeFlag: false,
      startTime: "",
      endTime: "",
      radio: 2,
      value: "",
      datePeriod: "",
      // formatter: null,
      legendOption: {
        icon: "circle",
        textStyle: {
          color: "#999"
        },
        data: that.legendData
      },
      xAxisOption: {
        type: "category",
        name: "(时)",
        axisLine: {
          show: true, //x轴的线
          onZero: false,
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
        name: that.yName,
        minInterval: 1,
        // max: that.yMax,
        // min: that.yMin,
        data: ["合", "分"],
        splitNumber: that.ySplitNumber,
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
      seriesOption: that.seriesData
    };
  },
  computed: {
    fullTitle(){
      let arr = this.value
      let startTime = moment(arr[0]).format("YYYY-MM-DD");
      let endTime = moment(arr[1]).format("YYYY-MM-DD");
      return `${this.titleP} (${startTime}-${endTime})`
    }
  },
  methods: {
    clickMagnify(){
      screenfull.toggle(this.$refs.polygonal);
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
      that.yName = dataList[index].unit
      that.flag = dataList[index].flag
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
      if(that.chartsType == 'Single'){
        let xAxisData = []
        for(let i=0; i<elData.length; i++){
          xAxisData.push(elData[i][0])
        }
        that.xAxisData = xAxisData
      }
      that.legendData = legendData
      that.seriesData = seriesData
      if(!flag)
        that.isChangeFlag = !that.isChangeFlag
      return {legendData: legendData, seriesData: seriesData}
    },
    changeActive(index){
      this.chartsList.map(item=>{
        item['active'] = false
      })
      this.chartsList[index]['active'] = true
      this.handleData(index)
      this.$forceUpdate()
    },
    onActive(data){
      let arr = []
      data.forEach(item=>{
        arr.push(item['value'])
      })
      this.$emit('on-charts', arr)
    },
    allowDrop(ev) {
      ev.preventDefault();
    },
    drop(ev) {
      const that = this;
      ev.preventDefault();
      let data = JSON.parse(ev.dataTransfer.getData("itemData"));
      if(data.name != "weatherCheck"){
        this.$message.info('仅可拖拽微型气象站')
        return;
      }
      $(ev.target).append(`<img src="${data.src}" />`);
      if (data.name == "weatherCheck") {
        let timeData = this.xAxisOption.data;
        let timeLength = timeData.length;
        let times = "";
        if (timeLength > 0) {
          for (let i = 0; i < timeLength; i++) {
            times += "," + timeData[i];
          }
          times = times.slice(1);
        } else {
          let timeHour = moment().format("YYYY-MM-DD");
          times = `${timeHour} 00:00:00,${timeHour} 02:00:00,${timeHour} 04:00:00,${timeHour} 06:00:00,${timeHour} 08:00:00,${timeHour} 10:00:00,${timeHour} 12:00:00,${timeHour} 14:00:00,${timeHour} 16:00:00,${timeHour} 18:00:00,${timeHour} 20:00:00,${timeHour} 22:00:00,${timeHour} 24:00:00`;
          this.xAxisOption.data = times.split(",");
        }
        let url = `/lenovo-robot/rest/envTempLine/substation/1/robot/1`;
        let query = {
          times: times
        };
        getAxiosData(url, query).then(res => {
          let that = this;
          let data = res.data;
          let obj = {
            name: "微型气象站",
            type: "line",
            data: []
          };
          data.forEach(el => {
            obj.data.push(el.envTemp);
          });
          that.legendData.push(...["微型气象站"]);
          that.seriesData.push(obj);
          that.$forceUpdate();
          that.isChangeFlag = !that.isChangeFlag;
        });
        /*   that.legendData.push(...['微型气象站'])
            that.seriesData.push(...[{
                data: [50, 70, 10, 0, 20, 80, 30, 10, 20, 1],
                name: "微型气象站",
                type: "line"
            }])
            that.$forceUpdate()
            that.isChangeFlag = !that.isChangeFlag*/
      } else if (data.name == "demoData") {
        that.legendData.push(...["可见光设备"]);
        that.seriesData.push(
          ...[
            {
              data: [10, 90, 50, 0, 20, 0, 20, 40, 60, 5],
              name: "可见光设备",
              type: "line"
            }
          ]
        );
        that.$forceUpdate();
        that.isChangeFlag = !that.isChangeFlag;
      } else
        this.$message.info('仅可拖拽微型气象站')
        // this.getHistoryData(data["monitorDeviceId"], data["monitorDeviceType"]);
    },
    getHistoryData(monitorDeviceId, monitorDeviceType) {
      this.isGetData = false;
      const that = this;
      const url = "/lenovo-plan/api/plan/history/new";
      const query = {
        monitorDeviceId: monitorDeviceId,
        monitorDeviceType: monitorDeviceType,
        startTime: `${this.startTime} 00:00:00`,
        endTime: `${this.endTime} 23:59:59`
      };
      getAxiosData(url, query).then(res => {
        const dataList = res.data.dataList;
        that.yAxisOption["name"] = res.data.unit;
        const legendData = [];
        let xAxisData = [];
        const seriesData = [];
        for (let i = 0; i < dataList.length; i++) {
          legendData.push(dataList[i].itemName);
          const itemDataList = dataList[i].itemDataList;
          let obj = {
            name: dataList[i].itemName,
            type: "line",
            data: []
          };
          if (res.data.flag) {
            obj["step"] = "start";
          }
          xAxisData = [];
          for (let item in itemDataList) {
            xAxisData.push(itemDataList[item].time);
            obj.data.push(Number(itemDataList[item].data));
          }
          seriesData.push(obj);
        }
        that.legendData.push(...legendData);
        that.seriesData.push(...seriesData);
        that.$forceUpdate();
        that.isChangeFlag = !that.isChangeFlag;
      });
    },
    onChangeRadio(data) {
      this.radio = data;
      let date = null;
      let arr = [];
      if (data == 1) {
        date = moment();
      } else {
        date = moment().subtract(1, "days");
      }
      arr.push(date, date);
      const startTime = moment(arr[0]).format("YYYY-MM-DD");
      const endTime = moment(arr[1]).format("YYYY-MM-DD");
      this.value = arr
      this.startTime = JSON.parse(JSON.stringify(startTime));
      this.endTime = JSON.parse(JSON.stringify(endTime));
      $("#moveTarget")
        .find("img")
        .remove();
      this.$emit("onChange", arr);
    },
    onChangeTime(data) {
      $("#moveTarget")
        .find("img")
        .remove();
      const startTime = moment(data[0]).format("YYYY-MM-DD");
      const endTime = moment(data[1]).format("YYYY-MM-DD");
      this.startTime = JSON.parse(JSON.stringify(startTime));
      this.endTime = JSON.parse(JSON.stringify(endTime));
      this.datePeriod = data;
      this.radio = null;
      if (!data) {
        this.onChangeRadio(1);
      } else {
        this.$emit("onChange", this.datePeriod);
      }
    },
    handle() {
      this.$emit("changeHandle");
    }
  },
  watch: {
    itemData: {
      handler(now){
        let supportPreset = now.deviceMessage.supportPreset
        let monitorDeviceType = now.monitorDeviceType
        if(monitorDeviceType == 1 || monitorDeviceType == 5 || monitorDeviceType == 3){
          this.typeChosen = 'Single'
          this.isShow = false
        }else if(monitorDeviceType == 2){
          this.typeChosen = 'Multiple'
          this.isShow = true
        }else{
          this.isShow = false
        }
      },
      deep: true,
      immediate: true
    },
    radio(now) {
      if (now != null) this.value = "";
    },
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
        if (now.length > 2) {
          this.legendOption["type"] = "scroll";
          this.legendOption["padding"] = [0, 0, 0, 0];
          this.legendOption["itemGap"] = 20;
          this.legendOption["itemWidth"] = 14;
          this.legendOption["align"] = "auto";
          this.legendOption["pageIconColor"] = "#aaaaaa";
          this.legendOption["pageIconInactiveColor"] = "#aaaaaa";
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
        this.xAxisOption.data = arr;
      },
      deep: true
    },
    flag(now) {
      if (now == 1) {
        this.yAxisOption["type"] = "category";
        this.yAxisOption.splitLine.show = false;
      }else{
        this.yAxisOption["type"] = "value";
        this.yAxisOption.splitLine.show = false;
      }
    },
    yName(now) {
      this.yAxisOption["name"] = now;
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
  },
  mounted() {
    const that = this;
    document.addEventListener('fullscreenchange', function(event) {
      that.isFullscreen = !that.isFullscreen
    })
    that.$nextTick(()=>{
      that.titleP = document.getElementsByClassName('el-tooltip title titleSpan item')[0].innerText
    })
    if (this.radio) {
      this.onChangeRadio(this.radio);
    } else if (!this.radio && this.datePeriod) {
      this.onChangeTime(this.datePeriod);
    }
    /* that.legendData.push(...['设备01'])
      that.seriesData.push(...[{
          data: [1,1,1,1,1,1,1,1,1,0],
          name: "设备01",
          type: "line"
      }])
      that.xAxisOption.data = ['02', '03', '04', '05', '09', '10', '11', '13', '14', '15']
      that.$forceUpdate()
      that.isChangeFlag = !that.isChangeFlag*/
  }
};
</script>

<style lang="scss">
.polygonal {
  height: 100%;
  &.fullscreen{
    background: #11222e;
  }
  .normalPanel{
    .activeTitle{
      width: 143px !important;
    }
  }
  .title-fullScreen{
    text-align: center;
    font-size: 20px;
    position: relative;
    top: -24px;
    .iconfont{
      cursor: pointer;
      font-size: 20px;
      position: absolute;
      right: 46px;
    }
  }
  .radioChange{
    .el-radio__input.is-checked .el-radio__inner::after{
      transform: translate(-50%, -50%) scale(1.3);
      background: #00fefe;
    }
    .el-radio__input.is-checked .el-radio__inner{
      border-color: #00fefe;
      background: transparent;
    }
    .el-radio__inner{
      background-color: transparent;
      border: 1px solid #a4a5a6;
    }
  }
  .title {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
  }
  .time {
    overflow: hidden;
    margin-top: 20px;
    & > div {
      float: left;
      .el-radio {
        margin-right: 20px;
        .el-radio__label {
          color: #fff;
        }
      }
    }
    & > div:first-child {
      margin-top: 5px;
      margin-right: 30px;
    }
  }
  & .move {
    height: 40px;
    color: #999;
    text-align: center;
    font-size: 14px !important;
    img {
      width: 30px;
      margin-right: 10px;
      margin-left: 10px;
      height: 30px;
    }
  }
  .block {
    .el-date-editor {
      background-color: rgba(81, 89, 112, 0.7);
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
  .echarts {
    margin-top: 30px;
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


