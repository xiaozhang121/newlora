<template>
  <div class="keyErea">
    <div class="dunoDrap">
      <div>重点监测区域</div>
      <div class="selectBtn">
        <div>
          <duno-btn-top
            zIndex="10"
            @on-select="onSelect"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="numberCameras"
            :title="titleValueL"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <el-select
            @change="selectData"
            class="selectSearch"
            multiple
            collapse-tags
            :multiple-limit="selectCount"
            v-model="valueSelect"
            filterable
            :placeholder="titleValueR"
          >
            <el-option
              v-for="item in optionsList"
              :key="item.monitorDeviceId"
              :label="item.serialNo"
              :value="item.monitorDeviceId"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="monitorArea" :class="{'center': isCenter}">
      <!--@on-push="onPush"-->
      <KeyMonitor
        v-for="(item,index) in dataMonitor"
        :autoplay="true"
        :class="{'noMargin': (index+1) % active == 0}"
        :key="index"
        :imgAdress="item['pic']"
        :streamAddr="item['streamAddress']"
        :monitorInfo="item"
        :width="videoWidth"
      />
    </div>
    <!--<push-mov :pic="cameraPic" @on-push="onPushReal" @on-close="onClose" :visible="pushMovVisable" />-->
  </div>
</template>

<script>
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import { mapState } from "vuex";
import pushMov from "_c/duno-m/pushMov";
import {
  getMonitorSelect,
  securityMonitor,
  editConfig,
  getMonitorView
} from "@/api/currency/currency.js";
export default {
  name: "keyErea",
  components: {
    Breadcrumb,
    dunoBtnTop,
    KeyMonitor,
    pushMov
  },
  data() {
    return {
      initCount: 0,
      isFirst: true,
      selectCount: 0,
      cameraPic: '',
      isSecond: false,
      isCenter: false,
      pushMovVisable: false,
      showBtnList: false,
      titleValueR: "监控摄像头选择",
      titleValueL: "个摄像头",
      videoWidth: "calc(50% - 10px)",
      valueSelect: [],
      dataMonitor: [],
      active: 4,
      optionsList: [
       /* {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }*/
      ],
      numberCameras: [
        {
          circleColor: "#00B4FF",
          describeName: "两个摄像头",
          style: 'calc(50% - 10px)',
          widthType: 2,
          count: 2,
          isActive: true
        },
        {
          circleColor: "#FF5EB9",
          describeName: "四个摄像头",
          style: 'calc(50% - 10px)',
          widthType: 2,
          count: 4,
          isActive: true
        },
        {
          circleColor: "#4FF2B7",
          describeName: "六个摄像头",
          style: 'calc(100%/3 - 14px)',
          count: 6,
          widthType: 3,
          isActive: true
        },
        {
          circleColor: "#FF9000",
          describeName: "八个摄像头",
          style: 'calc(25% - 15px)',
          count: 8,
          widthType: 4,
          isActive: true
        }
      ]
    };
  },
  props:{
      configType:{
          type: String,
          default: '3'
      }
  },
  computed: {
    ...mapState(["app"]),
  },
  watch:{
      selectCount(now){
          this.numberCameras.forEach(item=>{
              if(item['count'] == now){
                  this.active = item['widthType']
                  this.titleValueL = item['describeName']
                  this.videoWidth = item['style']
              }
          })
      },
      valueSelect:{

      }
  },
  methods: {
    onClose() {
      this.pushMovVisable = false;
    },
    onPushReal(index) {
      const that = this;
      let query = {
        ["cameraPos0" + index]: this.cameraInfo["monitorDeviceId"],
        id: this.$store.state.user.configInfo.id
      };
      editConfig(query).then(res => {
        if (res.data.isSuccess) that.$message.success(res.msg);
        else that.$message.error(res.msg);
      });
    },
    onPush(item) {
      this.pushMovVisable = true;
      this.cameraInfo = item;
      if (this.cameraInfo) {
          this.cameraPic =  this.cameraInfo["pic"]
      } else {
          this.cameraPic =  ""
      }
    },
    getCamera() {
      const that = this;
      securityMonitor({configType: this.configType, userId: this.$store.state.user.userId}).then(res => {
        if (res.data && res.data.length) {
          let data = res.data
        /*  data.map(item=>{
              item['pic'] = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563287964020&di=5e687df08ed0f7f258186ce35c8a6ae9&imgtype=0&src=http%3A%2F%2Fp1.ifengimg.com%2Ffck%2F2018_01%2F4b3586c88209a81_w640_h429.jpg'
          })*/
          that.dataMonitorAll = data;
          that.selectCount = that.valueSelect.length
          that.initCount = that.selectCount
          that.dataMonitor = data.slice(0, that.selectCount);
        }
      });
    },
    initData() {
      const that = this;
      getMonitorSelect({configType: that.configType, userId: this.$store.state.user.userId}).then(res => {
        if(res.data){
          let data = res.data
          data = data.filter(item=>{
              return item['isSelected'] == true || item['isSelected'] == 1
          })
          if(data.length){
            let arr = []
            data.forEach(item=>{
                if(item['monitorDeviceId'] != null)
                  arr.push(item['monitorDeviceId'])
            })
            that.valueSelect = arr
            // that.getCameraInfo(data)
          }else{
            that.valueSelect = []
          }
          that.optionsList = res.data;
        }
      });
    },
    getCameraInfo(arr){
        const that = this
        // 现在正在播放，但是没有被选择的项
        let addArr = []
       /* that.dataMonitor.forEach((item, index)=>{
            if(arr.indexOf(item['monitorDeviceId'])< 0){
                addArr.push(item['monitorDeviceId'])
            }
        })*/
      /*  arr = [...arr].slice(0,that.selectCount)
        if(!arr.length){
            that.selectCount = this.$store.state.user.cameraNum
        }
        securityMonitor({configType: '3', monitorDeviceId: arr.join(','), userId: that.$store.state.user.userId }).then(res=>{
            that.dataMonitor = res.data
        })*/
    },
    saveCamera(){
        const that = this
        let query = {}
        that.valueSelect.forEach((item, index)=>{
            query['camera0'+(index+1)+'Id'] = item
        })
        query['selectCount'] = that.selectCount
        query['userId'] = this.$store.state.user.userId
        query['configType'] = that.configType
        postAxiosData('/lenovo-device/api/camera/config/update', query).then(res=>{

        })
    },
    selectData(value) {
      const that = this;
      if(!value.length){
        that.selectCount = this.initCount
      }
      securityMonitor({ monitorDeviceId: value.join(','), configType: that.configType, userId: this.$store.state.user.userId }).then(res => {
        // that.titleValueL = "监控摄像头数量";
        that.dataMonitor = res.data
        that.$forceUpdate()
        // that.videoWidth = "calc(50%)";
        // that.active = 1;
        // that.isCenter = true;
      });
    },
    onSelect(item) {
      this.selectCount = item['count']
      this.titleValueL = item["describeName"];
      console.log(item.widthType);
      this.dataMonitor = this.dataMonitor.slice(0,item["count"]);
      this.valueSelect = this.valueSelect.slice(0, item["count"]);
      switch (item.widthType) {
        case 2:
          this.videoWidth = "calc(50% - 10px)";
          this.active = 2;
          this.isCenter = false;
          break;
        case 3:
          this.videoWidth = "calc(100%/3 - 14px)";
          this.active = 3;
          this.isCenter = false;
          break;
        case 4:
          this.videoWidth = "calc(25% - 15px)";
          this.active = 4;
          this.isCenter = false;
          break;
        default:
          this.active = 4;
          this.isCenter = false;
      }
    },
    beforeunload(e){
        const that = this
        console.log('保存相关操作')
        console.log("I want to cancel");
        // Cancel the event
        e.preventDefault()
        that.saveCamera()
        // Chrome requires returnValue to be set
        e.returnValue = "hello";
    }
  },
  beforeDestroy(){
      const that = this
      console.log('destory')
      that.saveCamera()
      window.removeEventListener('beforeunload', this.beforeunload)
  },
  created() {
    this.initData();
    this.getCamera();
  },
  mounted(){
      this.$nextTick(()=>{
          window.addEventListener("beforeunload", this.beforeunload);
      })
  },
};
</script>

<style lang="scss">



.keyErea {
  .el-select .el-tag:first-child{
    margin-left: 14px;
  }
  .dunoDrap {
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      margin-top: 20px;
      margin-bottom: 20px;
      font-size: 18px;
      color: #ffffff;
    }
    .selectBtn {
      display: flex;
      justify-content: space-between;
      width: 380px;
      margin-top: 14px;
      height: 50px;
      .dunoBtnTop {
        width: 185px;
        display: inline-flex;
        padding-bottom: 0;
        height: 40px;
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
  .monitorArea {
    box-sizing: border-box;
    width: 100%;
    min-height: 491px;
    background-color: #142838;
    opacity: 0.8;
    padding: 20px 20px;
    overflow: hidden;
    &.center {
      display: flex;
      justify-content: center;
    }
    & > div {
      float: left;
      margin-bottom: 20px;
      margin-right: 20px;
    }
    .noMargin {
      margin-right: 0;
    }
  }
}
</style>

