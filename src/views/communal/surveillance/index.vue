<template>
  <div class="surveillance">
     <div class="title" style="margin-bottom: 15px">
       <i class="iconfont icon-zuoyoubuju" v-if="displayType == '1'"></i>
       <i class="iconfont icon-shangxiabuju" v-else></i>
       <span class="nr">{{ layoutTypeName }}</span>
       <duno-btn-top @on-select="onSelect" class="dunoBtnTop" :isCheck="false" :dataList="dataList" title="切换布局" :showBtnList="false"></duno-btn-top>
     </div>
    <div class="main" :class="{widthA : displayType == '2'}">
      <div class="left_main" :class="{widthA : displayType == '2'}">
        <div class="left"  style="padding-bottom: 32%"  v-if="displayType == '2'">
          <key-monitor :monitorInfo="monitorInfo01"   :kilovolt="$store.state.user.configInfo['camera01Name']" :autoplay="true" imgAdress="" :streamAddr="streamAddr01" :showBtmOption="true" paddingBottom="32%" class="monitorM second"></key-monitor>
        </div>
        <div class="left" v-else>
          <key-monitor :monitorInfo="monitorInfo01" :kilovolt="$store.state.user.configInfo['camera01Name']" :autoplay="true" imgAdress="" :streamAddr="streamAddr01" :showBtmOption="true" class="monitorM first"></key-monitor>
        </div>
      </div>
      <div class="right_main" v-if="displayType != '2'" :class="{hidden : displayType == '2'}">
        <div class="right">
          <key-monitor :monitorInfo="monitorInfo02" :kilovolt="$store.state.user.configInfo['camera02Name']" :autoplay="true" imgAdress="" :streamAddr="streamAddr02" :showBtmOption="true" class="monitorM child"></key-monitor>
        </div>
        <div class="right">
          <key-monitor :monitorInfo="monitorInfo03" :kilovolt="$store.state.user.configInfo['camera03Name']" :autoplay="true" imgAdress="" :streamAddr="streamAddr03" :showBtmOption="true" class="monitorM child"></key-monitor>
        </div>
        <div class="right">
          <key-monitor :monitorInfo="monitorInfo04" :kilovolt="$store.state.user.configInfo['camera04Name']" :autoplay="true" imgAdress="" :streamAddr="streamAddr04" :showBtmOption="true" class="monitorM child"></key-monitor>
        </div>
      </div>
    </div>
    <div class="oltagevMain second" v-if="displayType == '2'">
      <div class="item_main">
        <div class="item">
          <key-monitor :monitorInfo="monitorInfo02" :kilovolt="$store.state.user.configInfo['camera02Name']" :autoplay="true" imgAdress="" :streamAddr="streamAddr02"  :showBtmOption="true" class="monitorM"></key-monitor>
        </div>
      </div>
      <div class="item_main">
        <div class="item">
          <key-monitor :monitorInfo="monitorInfo03" :kilovolt="$store.state.user.configInfo['camera03Name']" :autoplay="true" imgAdress="" :streamAddr="streamAddr03" :showBtmOption="true" class="monitorM"></key-monitor>
        </div>
      </div>
      <div class="item_main">
        <div class="item">
          <key-monitor :monitorInfo="monitorInfo04" :kilovolt="$store.state.user.configInfo['camera04Name']" :autoplay="true" imgAdress="" :streamAddr="streamAddr04" :showBtmOption="true" class="monitorM"></key-monitor>
        </div>
      </div>
    </div>
    <div class="title" style="margin: 15px 0">
       <span>{{ oltagevLevel }}</span>
      <!-- 隐藏功  能 -->
       <!-- <duno-btn-top
        @on-select="onSelectVol"
        class="dunoBtnTop"
        :isCheck="false"
        style="margin-left: 10px"
        :dataList="oltagevLevelList"
        :title="titleValue"
        :showBtnList="false"
      ></duno-btn-top> -->
    </div>
    <div class="oltagevMain">
      <div class="item_main" v-for="(item, index) in areaCameraList" :key="'camera'+index" :class="{noMarginRight:(index+1)%3 == 0}">
        <div class="item">
          <key-monitor :autoplay="true" :monitorInfo="{monitorDeviceId: item['monitorDeviceId']}" :imgAdress="item['pic']"  :kilovolt="item['areaName']" :streamAddr="item['streamAddr']" :showBtmOption="true" class="monitorM child"></key-monitor>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { initConfigure } from '@/api/user'
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import { getAxiosData } from "@/api/axiosType";
import mixinViewModule from "@/mixins/view-module";
import { editConfig, getAreaList } from '@/api/currency/currency.js'
import { mapState } from 'vuex'
export default {
  mixins: [mixinViewModule],
  name: "surveillance",
  components: {
    dunoBtnTop,
    KeyMonitor
  },
  computed: {
      ...mapState([
          'user'
      ]),
      isPush(){
          return this.$store.state.app.isPush
      },
      displayType(){
          return this.$store.state.user.configInfo['displayType']
      },
      monitorInfo01(){
          try {
              if (this.cameraList[0]['monitorDeviceId'])
                  return {monitorDeviceId:this.cameraList[0]['monitorDeviceId']}
              else {
                  return {}
              }
          }catch (e) {}
      },
      monitorInfo02(){
          try {
              if (this.cameraList[1]['monitorDeviceId'])
                  return {monitorDeviceId:this.cameraList[1]['monitorDeviceId']}
              else {
                  return {}
              }
          }catch (e) {}
      },
      monitorInfo03(){
          try {
              if (this.cameraList[2]['monitorDeviceId'])
                  return {monitorDeviceId:this.cameraList[2]['monitorDeviceId']}
              else {
                  return {}
              }
          }catch (e) {}
      },
      monitorInfo04(){
          try {
              if (this.cameraList[3]['monitorDeviceId'])
                  return {monitorDeviceId:this.cameraList[3]['monitorDeviceId']}
              else {
                  return {}
              }
          }catch (e) {}
      },
      streamAddr01(){
          try {
              if (this.cameraList[0]['streamAddr'])
                  return this.cameraList[0]['streamAddr']
              else {
                  return ''
              }
          }catch (e) {}
      },
      streamAddr02(){
          try{
            if(this.cameraList[1]['streamAddr'])
                return this.cameraList[1]['streamAddr']
            else{
                return ''
            }
          }catch (e) {}
      },
      streamAddr03(){
          try{
            if(this.cameraList[2]['streamAddr'])
                return this.cameraList[2]['streamAddr']
            else{
                return ''
            }
          }catch (e) {}
      },
      streamAddr04(){
          try{
            if(this.cameraList[3]['streamAddr'])
                return this.cameraList[3]['streamAddr']
            else{
                return ''
            }
          }catch (e) {}
      },
      layoutTypeName(){
          return this.dataList[this.$store.state.user.configInfo['displayType']-1]['describeName']
      }
  },
  watch:{
      isPush:{
          handler(now){
              if(now){
                  this.getCamera()
                  this.getArea()
                  this.initData()
                  this.$store.state.app.isPush = false
              }
          },
          deep: true,
          immediate: true
      }
  },
  data() {
    return {
      activeAreaId: '',
      dataForm: {},
      titleLayout: "切换布局",
      titleValue: "按电压等级",
      cameraList:[],
      dataList: [
        {
          describeName: "布局一",
          format: 1,
          isActive: true
        },
        {
          describeName: "布局二",
          format: 2,
          isActive: false
        }
      ],
      areaCameraList: [],
      oltagevLevelList: [
        {
          describeName: "电压一",
          isActive: true
        },
        {
          describeName: "电压二",
          isActive: false
        }
      ],
      oltagevLevel: "所有电器回路",
      layoutType: 1
    };
  },
  methods:{
    initConfigure(){
        const that = this
        initConfigure({userId:this.$store.state.user.userId, type: '2'}).then(res=>{
            that.$store.state.user.configInfo = res.data
        })
    },
    getArea(){
        getAreaList().then(res=>{
            let data = res.data.areaList
            let arr = []
            data.forEach(item=>{
                arr.push({
                    describeName: item['areaName'],
                    areaId: item['areaId'],
                    id: item['id']
                })
            })
            this.oltagevLevelList = arr
            this.$forceUpdate()
        })
    },
    initData(){
        const that = this
        getAxiosData('/lenovo-device/api/monitor/layout-list',{userId:this.$store.state.user.userId}).then(res=>{
          that.cameraList = res.data
          that.$forceUpdate()
        })
    },
    onSelect(item, index){
        this.$store.state.user.configInfo['displayType'] = item['format']
        editConfig({id:this.$store.state.user.configInfo['id'],displayType:item['format']}).then(res=>{
            sessionStorage.setItem('format', item['format'])
            this.layoutType = item['format']
        })
    },
    onSelectVol(item) {
      this.activeAreaId = item['areaId']
      this.titleValue = item["describeName"];
      this.getCamera(item['areaId'])
    },
    getCamera(areaId){
      const that = this
      let query = {}
      if(areaId){
          query['areaId'] = areaId
      }
      getAxiosData("/lenovo-device/api/monitor/vol-list",query).then(res => {
          if(res.code == 200){
              let data = res.data
              that.areaCameraList = data
              that.$forceUpdate()
          }
      });
    }
  },
  created(){
      this.getCamera()
      this.getArea()
      this.initData()
      this.initConfigure()
  }
}
</script>

<style lang="scss">
.surveillance {
  .icon-xiala{
   /* width: 12px;
    height: 15px;*/
  }
  .noMarginRight{
    margin-right: 0 !important;
  }
  width: 100%;
  .monitorM {
    width: 100% !important;
    height: 100% !important;
    position: absolute;
  }
  .widthA {
    width: 100% !important;
    position: relative;
  }
  .single {
    width: 100% !important;
    height: 50% !important;
  }
  .hidden {
    display: none;
  }
  .topHeight {
    padding-bottom: 34% !important;
  }
  .dunoBtnTop {
    width: 134px;
    display: inline-flex;
    padding-bottom: 0;
    .btnList {
      top: inherit !important;
      width: 134px;
      .title {
        font-size: 15px;
      }
    }
  }
  .title {
    color: white;
    display: flex;
    align-items: center;

    .icon-zuoyoubuju,
    .icon-shangxiabuju {
      font-size: 18px;
      margin-right: 7px;
    }
    .nr {
      font-size: 16px;
      margin-right: 10px;
    }
  }
  .main {
    display: flex;
    width: 99.5%;
    .left_main {
      width: 80.7%;
      .left {
        position: relative;
        width: 100%;
        padding-bottom: 56%;
      }
    }
    .right_main {
      width: 24.2%;
      .right {
        position: relative;
        width: 100%;
        padding-bottom: 56%;
        margin-left: 3.3%;
        margin-bottom: 9.3%;
      }
    }
  }
  .oltagevMain {
    min-height: 300px;
    width: 100%;
    zoom: 1;
    &:after {
      clear: both;
      content: "";
      display: block;
      width: 0;
      height: 0;
      visibility: hidden;
    }
    &.second {
      margin-top: 3%;
      .item_main {
        margin-right: 1% !important;
      }
      .item_main:last-child {
        margin-right: 0 !important;
      }
    }
    .item_main {
      float: left;
      width: calc(98% / 3);
      margin-right: 1%;
      margin-bottom: 3%;
      .item {
        position: relative;
        width: 100%;
        padding-bottom: 56%;
      }
    }
    .item_main:nth-last-child(3n-1) {
    }
  }
  .monitorM.child {
    .vjs-fluid {
      padding-top: 56%;
    }
  }
  .monitorM.first {
    .vjs-fluid {
      padding-top: 56%;
    }
  }
  .monitorM.second {
    .vjs-fluid {
      padding-top: 32%;
    }
  }
  .oltagevMain.second{
    .vjs-fluid {
      padding-top: 56%;
    }
  }
}
</style>
