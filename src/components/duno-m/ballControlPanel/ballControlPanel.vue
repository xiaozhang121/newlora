<template>
  <div class="ballControlPanel">
    <historical-documents :isShowTip="false" :tabPaneData="tabPaneData" :showHeader="true" :title="monitorDeviceName"
                          :dialogTableVisible="visible" @close="onClose">
      <div class="monitor">
        <key-monitor
                :monitorInfo="{ monitorDeviceId: monitorDeviceId }"
                paddingBottom="56%"
                class="monitor"
                :autoplay="true"
                :streamAddr="streamAddr"
                width="100%"
                :showBtmOption="false"
                :Initialization="true"
                :isLive='false'
                :isNav='true'
                :isAux='true'
                :isRecord="false"
        ></key-monitor>
      </div>
      <div class="status">
        <div class="explain">{{ ballStatus }}</div>
        <div class="btn" @click="routeTo"><a href="javascript:void(0)">详情</a></div>
      </div>
    </historical-documents>
  </div>
</template>

<script>
  import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
  import KeyMonitor from "_c/duno-c/KeyMonitor";
  import { getAxiosData } from "@/api/axiosType";
  export default {
    name: 'ballControlPanel',
    components: {
      HistoricalDocuments,
      KeyMonitor
    },
    data() {
      return {
        streamAddr: '',
        ballStatus: '暂无任务',
        tabPaneData: [
          {
            label: "实时信息",
            name: "first"
          }
        ],
      }
    },
    computed: {
      monitorDeviceId(){
        return this.popData['monitorDeviceId']?this.popData['monitorDeviceId']:''
      },
      monitorDeviceName(){
        return this.popData['monitorDeviceName']?this.popData['monitorDeviceName']:'暂无名称'
      }
    },
    watch: {
      popData: {
        handler(now){
          this.getBallData()
          this.initCamera()
        },
        deep: true,
        immediate: true
      }
    },
    props: {
      popData: {
        type: Object,
        default: () => {
          return {}
        }
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      routeTo(){
        this.$router.push({
          path:'/surveillancePath/ballControlM',
          query:{
            monitorDeviceId: this.monitorDeviceId,
            monitorDeviceName: this.monitorDeviceName
          }
        })
      },
      initCamera() {
        const that = this;
        const url =
          "/lenovo-visible/api/visible-equipment/sdk/rtmp/" +
          this.monitorDeviceId;
        getAxiosData(url, {}).then(res => {
          that.streamAddr = res.data;
        });
      },
      getBallData(){
        getAxiosData('/lenovo-plan/api/device/ball-control/status', {monitorDeviceId: this.monitorDeviceId}).then(res=>{
            let status = res.data.status
            if(status == 0){
              this.ballStatus = '暂无任务'
            }else if(status == 1){
              this.ballStatus = '周界识别监测中'
            }else if(status == 1){
              this.ballStatus = '表计识别监测中'
            }
        })
      },
      onClose(data) {
        this.$emit('onClose')
      },
    },
    created() {
      const that = this
    },
    mounted() {

    }
  }
</script>

<style lang="scss">
  .ballControlPanel {
    .monitor {

    }
    .status {
      display: flex;
      justify-content: space-between;
      margin-top: 17px;
      align-items: center;
      margin-bottom: 11px;
      .explain {
        color: white;
        font-size: 15px;
      }
      .btn {
        border: 1px solid white;
        padding: 3px 18px;
        border-radius: 3px;
        a {
          color: white;
        }
      }
    }
  }
</style>
